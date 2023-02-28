import { status as GrpcStatus } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Cirql, create, del, delRecord, eq, select, update } from 'cirql';
import { time } from 'cirql';
import { SuccessMessages } from 'src/custom/maps/success.maps';
import { ValidationMessages } from 'src/custom/maps/validation.maps';
import { Role } from 'src/custom/models/role.model';
import { User } from 'src/custom/models/user.model';
import {
  CheckUserRequest,
  CreateRoleRequest,
  DeleteRoleRequest,
  DeleteUserRequest,
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
  async deleteRole(request: DeleteRoleRequest) {
    // TODO Delete the role here
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ id: request.id }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.ROLE_EXISTS,
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
    // TODO Update the role here
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ name: request.name }),
        schema: Role,
      });

      if (roleFromDb.length === 0) {
        await this.db.execute({
          query: create('roles').setAll({
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
    // TODO Create the role here
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
