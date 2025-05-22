import { Module } from '@nestjs/common';
import { CreateUsersUseCase } from './usecases/create-users.usecase';
import { InfrastructureModule } from '@/infra/infra.module';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateUsersUseCase],
  exports: [CreateUsersUseCase],
})
export class UserModule {}
