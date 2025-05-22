import { ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class CreateUsersRequestDto {
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];
}

export class CreateUsersResponseDto {
  ids: string[];
}

export class CreateUserResponseDto {
  id: string;
}
