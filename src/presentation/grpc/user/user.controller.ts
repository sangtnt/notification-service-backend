import {
  CreateUsersRequestDto,
  CreateUsersResponseDto,
} from '@/application/user/dtos/create-user.dto';
import { CreateUsersUseCase } from '@/application/user/usecases/create-users.usecase';
import { KafkaService } from '@/infra/kafka/kafka.service';
import { Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export class UserController {
  constructor(
    @Inject() private readonly createUserUseCase: CreateUsersUseCase,
    private readonly kafkaService: KafkaService,
  ) {}

  @GrpcMethod('UserService', 'CreateUsers')
  async createUsers(req: CreateUsersRequestDto): Promise<CreateUsersResponseDto> {
    await this.kafkaService.sendMessage('demo-topic', req);
    return await this.createUserUseCase.execute(req);
  }
}
