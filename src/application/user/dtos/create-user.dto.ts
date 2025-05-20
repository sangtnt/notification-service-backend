import { ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUsersRequestDto {
  @ValidateNested({ each: true })
  users: UserDto[];
}

export class CreateUsersResponseDto {
  ids: string[];
}

export class CreateUserResponseDto {
  id: string;
}
