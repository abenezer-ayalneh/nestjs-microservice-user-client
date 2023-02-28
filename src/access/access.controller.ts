import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateRoleRequest,
  DeleteRoleRequest,
  UpdateRoleRequest,
} from 'src/custom/requests/user.request';
import { UserService } from 'src/user/user.service';

@Controller()
export class AccessController {
  constructor(private userService: UserService) {}

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
}
