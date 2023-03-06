import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationMessages } from '../maps/validation.maps';

// Access Requests
// Permission requests
export class GetUsersViaPermissionsRequest {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  permissions: string[];
}

export class RevokePermissionsFromUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  permissions: string[];
}

export class GetUserPermissionsRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;
}

export class GetUserRolesRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;
}

export class UserHasPermissionsRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  permissions: string[];
}

export class AssignPermissionsToUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  permissions: string[];
}

export class CreatePermissionRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  name: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  description: string;
}

export class DeletePermissionRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;
}

export class UpdatePermissionRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  name: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  description: string;
}

// Role requests
export class GetUsersViaRolesRequest {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  roles: string[];
}

export class RevokeRolesFromUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  roles: string[];
}

export class AssignRolesToUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  roles: string[] = [];
}

export class AssignPermissionsToRoleRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1, {
    message: ValidationMessages.TARGET_MIN_SIZE_SHOULD_BE_THIS,
  })
  @IsArray({ message: ValidationMessages.TARGET_SHOULD_BE_ARRAY })
  permissions: string[];
}

export class CreateRoleRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  // @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  name: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  description: string;
}

export class DeleteRoleRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;
}

export class UpdateRoleRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  name: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  description: string;
}

// User requests
export class CheckUserRequest {
  @IsEmail({}, { message: ValidationMessages.TARGET_SHOULD_BE_VALID })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  email: string;
}

export class StoreUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  name: string;

  @IsEmail({}, { message: ValidationMessages.TARGET_SHOULD_BE_VALID })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  email: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  password: string;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  email_verified_at: string;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  plan = 0;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  plan_expire_date: string;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  requested_plan = 0;

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
  mode = 'light';

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  created_by = 0;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  default_pipeline = 0;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  delete_status = 1;

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsOptional()
  is_active: boolean;

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

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  active_status = false;

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  dark_mode = false;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  messenger_color = '#2180F3';
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

  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
  @IsNumber({}, { message: ValidationMessages.TARGET_SHOULD_BE_NUMBER })
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

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  active_status;

  @IsBoolean({ message: ValidationMessages.TARGET_SHOULD_BE_BOOLEAN })
  @IsOptional()
  dark_mode;

  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsOptional()
  messenger_color: string;
}

export class DeleteUserRequest {
  @IsString({ message: ValidationMessages.TARGET_SHOULD_BE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TARGET_SHOULD_NOT_BE_EMPTY })
  id: string;
}
