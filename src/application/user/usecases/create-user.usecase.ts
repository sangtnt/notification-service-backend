import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserResponseDto } from '../dtos/create-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { hashString } from '@/shared/utils/hashing.util';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: UserDto): Promise<CreateUserResponseDto> {
    this.validateCreateUserRequest(request);

    const isAvailable = await this.userRepository.checkAvailableEmailsAndPhones(
      request.email?.trim() ? [request.email?.trim()] : [],
      request.phoneNumber?.trim() ? [request.phoneNumber?.trim()] : [],
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

    await processUserData(request);

    return { id: await this.userRepository.save(request) };
  }

  private validateCreateUserRequest(createUserDto: UserDto): void {
    const validateUserData = (user: UserDto): boolean => {
      if (!user.email && !user.phoneNumber) {
        return false;
      }
      return true;
    };

    if (!validateUserData(createUserDto)) {
      throw new RpcException({
        error: ErrorCodes.BAD_REQ,
        code: RpcExceptionStatus.INVALID_ARGUMENT,
      });
    }
  }
}
