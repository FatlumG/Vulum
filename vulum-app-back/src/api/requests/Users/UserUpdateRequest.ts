import {IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UserUpdateRequest {
  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  Username?: string;

  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  FName?: string;

  @IsOptional()
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  LName?: string;

  @IsOptional()
  @MinLength(9)
  Phone?: string;

  @IsOptional()
  @IsString()
  Address?: string;

  @IsOptional()
  @IsString()
  Bio?: string;
}
