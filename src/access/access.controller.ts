import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AssignPermissionsToRoleRequest,
  AssignRolesToUserRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  DeletePermissionRequest,
  DeleteRoleRequest,
  UpdatePermissionRequest,
  UpdateRoleRequest,
  UserHasPermissionsRequest,
  GetUserRolesRequest,
  GetUserPermissionsRequest,
  RevokeRolesFromUserRequest,
  RevokePermissionsFromUserRequest,
  GetUsersViaRolesRequest,
  GetUsersViaPermissionsRequest,
} from 'src/custom/requests/user.request';
import { AccessService } from './access.service';

@Controller()
export class AccessController {
  constructor(private accessService: AccessService) {}

  // Role routes
  @GrpcMethod('UserGrpcService', 'CreateRole')
  createRole(request: CreateRoleRequest) {
    return this.accessService.createRole(request);
  }

  @GrpcMethod('UserGrpcService', 'UpdateRole')
  updateRole(request: UpdateRoleRequest) {
    return this.accessService.updateRole(request);
  }

  @GrpcMethod('UserGrpcService', 'DeleteRole')
  deleteRole(request: DeleteRoleRequest) {
    return this.accessService.deleteRole(request);
  }

  @GrpcMethod('UserGrpcService', 'GetRoles')
  getRoles() {
    return this.accessService.getRoles();
  }

  @GrpcMethod('UserGrpcService', 'AssignPermissionsToRole')
  assignPermissionsToRole(request: AssignPermissionsToRoleRequest) {
    return this.accessService.assignPermissionToRole(request);
  }

  @GrpcMethod('UserGrpcService', 'AssignRolesToUser')
  assignRolesToUser(request: AssignRolesToUserRequest) {
    return this.accessService.assignRolesToUser(request);
  }

  @GrpcMethod('UserGrpcService', 'RevokeRolesFromUser')
  revokeRolesFromUser(request: RevokeRolesFromUserRequest) {
    return this.accessService.revokeRolesFromUser(request);
  }

  // Permission routes
  @GrpcMethod('UserGrpcService', 'CreatePermission')
  createPermission(request: CreatePermissionRequest) {
    return this.accessService.createPermission(request);
  }

  @GrpcMethod('UserGrpcService', 'UpdatePermission')
  updatePermission(request: UpdatePermissionRequest) {
    return this.accessService.updatePermission(request);
  }

  @GrpcMethod('UserGrpcService', 'DeletePermission')
  deletePermission(request: DeletePermissionRequest) {
    return this.accessService.deletePermission(request);
  }

  @GrpcMethod('UserGrpcService', 'GetPermissions')
  getPermissions() {
    return this.accessService.getPermissions();
  }

  @GrpcMethod('UserGrpcService', 'AssignPermissionsToUser')
  assignPermissionsToUser(request: AssignPermissionsToRoleRequest) {
    return this.accessService.assignPermissionsToUser(request);
  }

  @GrpcMethod('UserGrpcService', 'UserHasPermissions')
  userHasPermissions(request: UserHasPermissionsRequest) {
    return this.accessService.userHasPermissions(request);
  }

  @GrpcMethod('UserGrpcService', 'GetUserRoles')
  getUserRoles(request: GetUserRolesRequest) {
    return this.accessService.getUserRoles(request);
  }

  @GrpcMethod('UserGrpcService', 'GetUserPermissions')
  getUserPermissions(request: GetUserPermissionsRequest) {
    return this.accessService.getUserPermissions(request);
  }

  @GrpcMethod('UserGrpcService', 'RevokePermissionsFromUser')
  revokePermissionsFromUser(request: RevokePermissionsFromUserRequest) {
    return this.accessService.revokePermissionsFromUser(request);
  }

  @GrpcMethod('UserGrpcService', 'GetUsersViaRoles')
  getUsersViaRoles(request: GetUsersViaRolesRequest) {
    return this.accessService.getUsersViaRoles(request);
  }

  @GrpcMethod('UserGrpcService', 'GetUsersViaPermissions')
  getUsersViaPermissions(request: GetUsersViaPermissionsRequest) {
    return this.accessService.getUsersViaPermissions(request);
  }
}
