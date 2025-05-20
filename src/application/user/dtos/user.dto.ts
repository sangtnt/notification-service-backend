import { IsEmail, IsOptional, MaxLength, IsString, IsPhoneNumber } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  password?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @MaxLength(255)
  createdBy: string;
}
