import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateRoleRequest,
  DeleteRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  DeletePermissionRequest,
  UpdatePermissionRequest,
  AssignPermissionsToRoleRequest,
} from 'src/custom/requests/user.request';
import { UserService } from 'src/user/user.service';

@Controller()
export class AccessController {
  constructor(private userService: UserService) {}

  // Role routes
  @GrpcMethod('UserGrpcService', 'CreateRole')
  createRole(request: CreateRoleRequest) {
    return this.userService.createRole(request);
  }

  @GrpcMethod('UserGrpcService', 'UpdateRole')
  updateRole(request: UpdateRoleRequest) {
    return this.userService.updateRole(request);
  }

  @GrpcMethod('UserGrpcService', 'DeleteRole')
  deleteRole(request: DeleteRoleRequest) {
    return this.userService.deleteRole(request);
  }

  @GrpcMethod('UserGrpcService', 'GetRoles')
  getRoles() {
    return this.userService.getRoles();
  }

  @GrpcMethod('UserGrpcService', 'AssignPermissionsToRole')
  assignPermissionToRole(request: AssignPermissionsToRoleRequest) {
    return this.userService.assignPermissionToRole(request);
  }

  // Permission routes
  @GrpcMethod('UserGrpcService', 'CreatePermission')
  createPermission(request: CreatePermissionRequest) {
    return this.userService.createPermission(request);
  }

  @GrpcMethod('UserGrpcService', 'UpdatePermission')
  updatePermission(request: UpdatePermissionRequest) {
    return this.userService.updatePermission(request);
  }

  @GrpcMethod('UserGrpcService', 'DeletePermission')
  deletePermission(request: DeletePermissionRequest) {
    return this.userService.deletePermission(request);
  }

  @GrpcMethod('UserGrpcService', 'GetPermissions')
  getPermissions() {
    return this.userService.getPermissions();
  }
}
