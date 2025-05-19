import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserResponseDto } from '../dtos/create-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { hashString } from '@/shared/utils/hashing.util';
import { UserEntity } from '@/core/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: UserEntity): Promise<CreateUserResponseDto> {
    this.validateCreateUserRequest(createUserDto);

    const isAvailable = await this.userRepository.checkAvailableEmailsAndPhones(
      createUserDto.email?.trim() ? [createUserDto.email?.trim()] : [],
      createUserDto.phoneNumber?.trim() ? [createUserDto.phoneNumber?.trim()] : [],
    );

    if (isAvailable) {
      throw new RpcException({
        error: ErrorCodes.DATA_EXISTS,
        code: RpcExceptionStatus.ALREADY_EXISTS,
      });
    }

    const processUserData = async (user: UserEntity): Promise<void> => {
      user.password = await hashString(user.password);
      user.email = user.email?.trim()?.toLowerCase();
    };

    await processUserData(createUserDto);

    return { id: await this.userRepository.save(createUserDto) };
  }

  private validateCreateUserRequest(createUserDto: UserEntity): void {
    const validateUserData = (user: UserEntity): boolean => {
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
