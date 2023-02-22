import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StoreUserRequest } from './requests/user.request';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @GrpcMethod('UserGrpcService', 'StoreUser')
  storeUser(request: StoreUserRequest) {
    return this.userService.storeUser(request);
  }
}
