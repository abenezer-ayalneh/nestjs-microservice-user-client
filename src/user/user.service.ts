import { status as GrpcStatus } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Cirql, create, delRecord, eq, select, time, update } from 'cirql';
import { SuccessMessages } from 'src/custom/maps/success.maps';
import { ValidationMessages } from 'src/custom/maps/validation.maps';
import { Permission } from 'src/custom/models/permission.model';
import { Role } from 'src/custom/models/role.model';
import { User } from 'src/custom/models/user.model';
import {
  AssignPermissionsToRoleRequest,
  AssignPermissionsToUserRequest,
  AssignRolesToUserRequest,
  CheckUserRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  DeletePermissionRequest,
  DeleteRoleRequest,
  DeleteUserRequest,
  UpdatePermissionRequest,
  UpdateUserRequest,
} from 'src/custom/requests/user.request';
import {
  StoreUserRequest,
  UpdateRoleRequest,
} from '../custom/requests/user.request';

@Injectable()
export class UserService {
  private db: Cirql;
  constructor(private config: ConfigService) {
    this.db = new Cirql({
      connection: {
        endpoint: this.config.get<string>('SURREAL_DB_URL'),
        namespace: this.config.get<string>('SURREAL_DB_NAMESPACE'),
        database: this.config.get<string>('SURREAL_DB_DATABASE'),
      },
      credentials: {
        user: this.config.get<string>('SURREAL_DB_USER'),
        pass: this.config.get<string>('SURREAL_DB_PASSWORD'),
      },
    });
  }

  // Access service methods

  // User service methods
  async deleteUser(request: DeleteUserRequest) {
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        const { id } = request;
        await this.db.execute({
          query: update('users')
            .where({ id: id })
            .set('deleted_at', eq(time.now())),
          schema: User,
        });

        return {
          message: SuccessMessages.USER_DELETED_SUCCESSFULLY,
        };
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          message: error.message ?? ValidationMessages.SOMETHING_WENT_WRONG,
          code: GrpcStatus.INTERNAL,
        });
      }
    }
  }

  async updateUser(request: UpdateUserRequest) {
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        const { id, ...requestWithoutId } = request;
        await this.db.execute({
          query: update('users')
            .where({ id: id })
            .setAll({ ...requestWithoutId }),
          schema: User,
        });

        return {
          message: SuccessMessages.USER_UPDATED_SUCCESSFULLY,
        };
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          message: error.message ?? ValidationMessages.SOMETHING_WENT_WRONG,
          code: GrpcStatus.INTERNAL,
        });
      }
    }
  }

  async storeUser(request: StoreUserRequest) {
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ email: request.email }),
        schema: User,
      });

      if (userFromDb.length === 0) {
        await this.db.execute({
          query: create('users').setAll(request),
          schema: User,
        });

        return {
          message: SuccessMessages.USER_CREATED_SUCCESSFULLY,
        };
      } else {
        throw new RpcException({
          message: ValidationMessages.USER_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          message: error.message ?? ValidationMessages.SOMETHING_WENT_WRONG,
          code: GrpcStatus.INTERNAL,
        });
      }
    }
  }

  async checkUser(request: CheckUserRequest) {
    try {
      await this.db.ready();
      const userCheckResult = await this.db.execute({
        query: select().from('users').where({ email: request.email }),
        schema: User,
      });

      if (
        userCheckResult.length > 0 &&
        typeof userCheckResult[0] !== 'undefined'
      ) {
        return {
          id: userCheckResult[0].id,
          email: userCheckResult[0].email,
          name: userCheckResult[0].name,
          password: userCheckResult[0].password,
        };
      } else {
        throw new RpcException({
          message: ValidationMessages.USER_NOT_FOUND,
          code: GrpcStatus.INVALID_ARGUMENT,
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          message: error.message ?? ValidationMessages.SOMETHING_WENT_WRONG,
          code: GrpcStatus.INTERNAL,
        });
      }
    }
  }
}
