import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidationMessages } from '../maps/validation.maps';

export class CheckUserRequest {
  @IsEmail({}, { message: ValidationMessages.TARGET_SHOULD_BE_VALID })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  email: string;
}

export class StoreUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  name: string = null;

  @IsEmail({}, { message: ValidationMessages.TARGET_SHOULD_BE_VALID })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  email: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  password: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  email_verified_at: string = null;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  plan: number = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  plan_expire_date: string = null;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  requested_plan = 0;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  type: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  avatar: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  lang: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  mode = 'light';

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  created_by = 0;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  default_pipeline: number = null;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  delete_status = 1;

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  is_active = true;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  remember_token: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  last_login_at: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  created_at: string = null;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  updated_at: string = null;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  active_status = 0;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  dark_mode = 0;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  messenger_color: string = null;
}

export class UpdateUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  name: string;

  @IsEmail({}, { message: ValidationMessages.TARGET_SHOULD_BE_VALID })
  @IsOptional()
  email: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  password: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  email_verified_at: string;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  plan: number;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  plan_expire_date: string;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  requested_plan;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  type: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  avatar: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  lang: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  mode;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  created_by;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  default_pipeline: number;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  delete_status;

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  is_active;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  remember_token: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  last_login_at: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  created_at: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  updated_at: string;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  active_status;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  dark_mode;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  messenger_color: string;
}