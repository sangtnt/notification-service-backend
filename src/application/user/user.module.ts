import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { CreateUsersUseCase } from './usecases/create-users.usecase';
import { InfrastructureModule } from '@/infra/infra.module';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateUserUseCase, CreateUsersUseCase],
  exports: [CreateUserUseCase, CreateUsersUseCase],
})
export class UserModule {}
