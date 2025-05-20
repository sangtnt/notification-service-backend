import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersRequestDto, CreateUsersResponseDto } from '../dtos/create-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { hashString } from '@/shared/utils/hashing.util';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class CreateUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateUsersRequestDto): Promise<CreateUsersResponseDto> {
    this.validateCreateUserRequest(request);

    const isAvailable = await this.userRepository.checkAvailableEmailsAndPhones(
      request.users.map((user) => user.email?.trim()).filter((email) => typeof email === 'string'),
      request.users
        .map((user) => user.phoneNumber?.trim())
        .filter((phone) => typeof phone === 'string'),
    );

    if (isAvailable) {
      throw new RpcException({
        error: ErrorCodes.DATA_EXISTS,
        code: RpcExceptionStatus.ALREADY_EXISTS,
      });
    }

    const processUserData = async (user: UserDto): Promise<void> => {
      user.password = await hashString(user.password);
      user.email = user.email?.trim()?.toLowerCase();
    };

    await Promise.all(
      request.users
        .map((user) => {
          if (user.password?.trim()) {
            return processUserData(user);
          }
          return undefined;
        })
        .filter((task) => task !== undefined),
    );

    return { ids: await this.userRepository.saveMany(request.users) };
  }

  private validateCreateUserRequest(createUserDto: CreateUsersRequestDto): void {
    const validateUserData = (user: UserDto): boolean => {
      if (!user.email && !user.phoneNumber) {
        return false;
      }
      return true;
    };

    const isInvalidUsers = createUserDto.users.some((user) => !validateUserData(user));

    if (!createUserDto.users || createUserDto.users.length === 0 || isInvalidUsers) {
      throw new RpcException({
        error: ErrorCodes.BAD_REQ,
        code: RpcExceptionStatus.INVALID_ARGUMENT,
      });
    }
  }
}
