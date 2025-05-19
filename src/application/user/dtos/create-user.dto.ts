import { UserEntity } from '@/core/entities/user.entity';

export class CreateUsersRequestDto {
  users: UserEntity[];
}

export class CreateUsersResponseDto {
  ids: string[];
}

export class CreateUserResponseDto {
  id: string;
}
