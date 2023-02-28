import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StoreUserRequest } from '../custom/requests/user.request';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @GrpcMethod('UserGrpcService', 'CheckUser')
  checkUser(request: StoreUserRequest) {
    return this.userService.checkUser(request);
  }

  @GrpcMethod('UserGrpcService', 'StoreUser')
  storeUser(request: StoreUserRequest) {
    return this.userService.storeUser(request);
  }
}
