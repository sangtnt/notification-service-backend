import {
  CreateUsersRequestDto,
  CreateUsersResponseDto,
} from '@/application/user/dtos/create-user.dto';
import { CreateUsersUseCase } from '@/application/user/usecases/create-users.usecase';
import { Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export class UserController {
  constructor(@Inject() private readonly createUserUseCase: CreateUsersUseCase) {}

  @GrpcMethod('UserService', 'CreateUsers')
  async createUsers(req: CreateUsersRequestDto): Promise<CreateUsersResponseDto> {
    return await this.createUserUseCase.execute(req);
  }
}
