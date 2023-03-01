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
  // Role methods
  async assignPermissionToRole(request: AssignPermissionsToRoleRequest) {
    // TODO Assign provided permissions for the requested role
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ id: request.id }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        await this.db.execute({
          query: update('roles')
            .where({ id: request.id })
            .set('permissions', request.permissions),
          schema: Role,
        });

        return {
          message: SuccessMessages.PERMISSION_ASSIGNED_SUCCESSFULLY,
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

  async getPermissions() {
    // TODO Fetch all permissions here
    try {
      const permissions = await this.db.execute({
        query: select().from('permissions'),
        schema: Permission,
      });

      console.log(permissions);

      return {
        permissions,
      };
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

  async deletePermission(request: DeletePermissionRequest) {
    try {
      const permissionFromDb = await this.db.execute({
        query: select().from('permissions').where({ id: request.id }),
        schema: Permission,
      });

      if (permissionFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        await this.db.execute({
          query: delRecord(request.id),
          schema: Permission,
        });

        return {
          message: SuccessMessages.PERMISSION_CREATED_SUCCESSFULLY,
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

  async createPermission(request: CreatePermissionRequest) {
    try {
      const permissionFromDb = await this.db.execute({
        query: select().from('permissions').where({ name: request.name }),
        schema: Permission,
      });

      if (permissionFromDb.length === 0) {
        await this.db.execute({
          query: create('permissions').setAll({
            id: request.name,
            ...request,
            created_at: eq(time.now()),
          }),
          schema: Permission,
        });

        return {
          message: SuccessMessages.PERMISSION_CREATED_SUCCESSFULLY,
        };
      } else {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_EXISTS,
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

  async updatePermission(request: UpdatePermissionRequest) {
    try {
      const permissionFromDb = await this.db.execute({
        query: select().from('permissions').where({ id: request.id }),
        schema: Permission,
      });

      if (permissionFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        const { id, ...requestWithoutId } = request;
        await this.db.execute({
          query: update('permissions')
            .where({ id: id })
            .setAll({
              ...requestWithoutId,
              updated_at: eq(time.now()),
            }),
          schema: Permission,
        });

        return {
          message: SuccessMessages.PERMISSION_CREATED_SUCCESSFULLY,
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

  async getRoles() {
    // TODO Fetch all roles here
    try {
      const roles = await this.db.execute({
        query: select().from('roles'),
        schema: Role,
      });

      console.log(roles);

      return {
        roles,
      };
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

  async deleteRole(request: DeleteRoleRequest) {
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ id: request.id }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        await this.db.execute({
          query: delRecord(request.id),
          schema: Role,
        });

        return {
          message: SuccessMessages.ROLE_CREATED_SUCCESSFULLY,
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

  async createRole(request: CreateRoleRequest) {
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ name: request.name }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        await this.db.execute({
          query: create('roles').setAll({
            id: request.name,
            ...request,
            created_at: eq(time.now()),
          }),
          schema: Role,
        });

        return {
          message: SuccessMessages.ROLE_CREATED_SUCCESSFULLY,
        };
      } else {
        throw new RpcException({
          message: ValidationMessages.ROLE_EXISTS,
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

  async updateRole(request: UpdateRoleRequest) {
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ id: request.id }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        const { id, ...requestWithoutId } = request;
        await this.db.execute({
          query: update('roles')
            .where({ id: id })
            .setAll({
              ...requestWithoutId,
              updated_at: eq(time.now()),
            }),
          schema: Role,
        });

        return {
          message: SuccessMessages.ROLE_CREATED_SUCCESSFULLY,
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

  // User service methods
  async deleteUser(request: DeleteUserRequest) {
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        // console.log(request);
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
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        // console.log(request);
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
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
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
