import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UserUpdateRequest {
  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  username?: string;

  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  first_name?: string;

  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  last_name?: string;

  @IsOptional()
  @MinLength(9)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
