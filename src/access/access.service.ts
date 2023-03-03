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
import * as z from 'zod';
import {
  AssignPermissionsToRoleRequest,
  AssignPermissionsToUserRequest,
  AssignRolesToUserRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  DeletePermissionRequest,
  DeleteRoleRequest,
  UpdatePermissionRequest,
  UserHasPermissionsRequest,
  GetUserRolesRequest,
  GetUserPermissionsRequest,
  RevokeRolesFromUserRequest,
  RevokePermissionsFromUserRequest,
  GetUsersViaRolesRequest,
  GetUsersViaPermissionsRequest,
} from 'src/custom/requests/user.request';
import { UpdateRoleRequest } from '../custom/requests/user.request';

@Injectable()
export class AccessService {
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

  // Role methods
  async getUsersViaRoles(request: GetUsersViaRolesRequest) {
    // TODO Fetch all roles here
    try {
      const users = await this.db.execute({
        query: select().from('users').where('roles CONTAINSALL $roles'),
        schema: User,
        params: {
          roles: request.roles,
        },
      });

      return {
        users,
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

  async revokeRolesFromUser(request: RevokeRolesFromUserRequest) {
    // TODO Revoke roles from user here
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      const rolesFromDb = await this.db.execute({
        query: select().from('roles').where('id INSIDE $roles'),
        params: {
          roles: request.roles,
        },
        schema: Role,
      });

      if (rolesFromDb.length !== [...new Set(request.roles)].length) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        console.log(
          (userFromDb[0].roles ?? []).filter(
            (requestRole) => !request.roles.includes(requestRole),
          ),
        );
        await this.db.execute({
          query: update('users')
            .where({ id: request.id })
            .set(
              'roles',
              (userFromDb[0].roles ?? []).filter(
                (requestRole) => !request.roles.includes(requestRole),
              ),
            ),
          schema: User,
        });

        return {
          message: SuccessMessages.ROLE_REVOKED_SUCCESSFULLY,
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

  async assignRolesToUser(request: AssignRolesToUserRequest) {
    // TODO Assign roles to user here
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      const rolesFromDb = await this.db.execute({
        query: select().from('roles').where('id INSIDE $roles'),
        params: {
          roles: request.roles,
        },
        schema: Role,
      });

      if (rolesFromDb.length !== [...new Set(request.roles)].length) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        // console.log({
        //   requestRoles: request.roles,
        //   dbRoles: userFromDb[0].roles,
        //   merged: [...new Set(request.roles.concat(userFromDb[0].roles ?? []))],
        // });
        await this.db.execute({
          query: update('users')
            .where({ id: request.id })
            .set('roles', [
              ...new Set(request.roles.concat(userFromDb[0].roles ?? [])),
            ]), // Concat the new roles with the ones the user already have
          schema: User,
        });

        return {
          message: SuccessMessages.ROLE_ASSIGNED_SUCCESSFULLY,
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

  async assignPermissionToRole(request: AssignPermissionsToRoleRequest) {
    // TODO Assign provided permissions for the requested role
    try {
      const roleFromDb = await this.db.execute({
        query: select().from('roles').where({ id: request.id }),
        schema: Role,
      });

      const permissionsFromDb = await this.db.execute({
        query: select().from('permissions').where('id INSIDE $permissions'),
        params: {
          permissions: request.permissions,
        },
        schema: Permission,
      });

      // Fetch the found permission entries based on the requested permissions array
      // Assumption: If the requested array(unique entries only) length doesn't match with
      // the fetched from db array length, there must be some a permission ID in
      // the requested array that doesn't exist in the DB, so throw an exception
      if (
        permissionsFromDb.length !== [...new Set(request.permissions)].length
      ) {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else if (roleFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.ROLE_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        await this.db.execute({
          query: update('roles')
            .where({ id: request.id })
            .set('permissions', [
              ...new Set(
                request.permissions.concat(roleFromDb[0].permissions ?? []),
              ),
            ]),
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

  async getRoles() {
    // TODO Fetch all roles here
    try {
      const roles = await this.db.execute({
        query: select().from('roles'),
        schema: Role,
      });

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

  async getUserRoles(request: GetUserRolesRequest) {
    // TODO get the user roles here
    try {
      const user = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      const roles = await this.db.execute({
        query: select().from('roles').where('id INSIDE $roleIds'),
        params: {
          roleIds: user[0].roles,
        },
        schema: Role,
      });

      return {
        roles: roles,
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

  // Permission methods
  async getUsersViaPermissions(request: GetUsersViaPermissionsRequest) {
    // TODO Fetch all permissions here
    try {
      const users = await this.db.execute({
        query: select()
          .from('users')
          .where('permissions CONTAINSALL $permissions'),
        schema: User,
        params: {
          permissions: request.permissions,
        },
      });

      return {
        users,
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

  async revokePermissionsFromUser(request: RevokePermissionsFromUserRequest) {
    // TODO Revoke permissions from user here
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      const permissionsFromDb = await this.db.execute({
        query: select().from('permissions').where('id INSIDE $permissions'),
        params: {
          permissions: request.permissions,
        },
        schema: Permission,
      });

      if (
        permissionsFromDb.length !== [...new Set(request.permissions)].length
      ) {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        console.log(
          (userFromDb[0].permissions ?? []).filter(
            (requestPermission) =>
              !request.permissions.includes(requestPermission),
          ),
        );
        await this.db.execute({
          query: update('users')
            .where({ id: request.id })
            .set(
              'permissions',
              userFromDb[0].permissions.filter(
                (dbPermission) => !request.permissions.includes(dbPermission),
              ),
            ),
          schema: User,
        });

        return {
          message: SuccessMessages.PERMISSION_REVOKED_SUCCESSFULLY,
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

  async userHasPermissions(request: UserHasPermissionsRequest) {
    // TODO Check if the user has permissions
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
        const userPermissions = await this.db.execute({
          query: select('roles.permissions', 'permissions')
            .from('users')
            .where({ id: request.id }),
          schema: z.any(),
          // schema: z.object({
          //   permissions: z.array(z.string()),
          //   roles: z.object({ permissions: z.array(z.string()) }),
          // }),
        });

        const mergedPermissions = userPermissions[0]['permissions'].concat(
          userPermissions[0]['roles']['permissions'].flatMap(
            (permission) => permission,
          ),
        );

        const uniqueMergedPermissions = [...new Set(mergedPermissions)];

        for (const permission of request.permissions) {
          if (!uniqueMergedPermissions.includes(permission)) {
            return {
              message: SuccessMessages.FALSE,
            };
          }
        }
        return {
          message: SuccessMessages.TRUE,
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

  async assignPermissionsToUser(request: AssignPermissionsToUserRequest) {
    // TODO Assign permissions to user here
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ id: request.id }),
        schema: User,
      });

      const permissionsFromDb = await this.db.execute({
        query: select().from('permissions').where('id INSIDE $permissions'),
        params: {
          permissions: request.permissions,
        },
        schema: Permission,
      });

      if (
        permissionsFromDb.length !== [...new Set(request.permissions)].length
      ) {
        throw new RpcException({
          message: ValidationMessages.PERMISSION_NOT_FOUND,
          code: GrpcStatus.UNKNOWN,
        });
      } else if (userFromDb.length === 0) {
        throw new RpcException({
          message: ValidationMessages.USER_DOES_NOT_EXISTS,
          code: GrpcStatus.UNKNOWN,
        });
      } else {
        await this.db.execute({
          query: update('users')
            .where({ id: request.id })
            .set('permissions', [
              ...new Set(
                request.permissions.concat(userFromDb[0].permissions ?? []),
              ),
            ]),
          schema: User,
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

  async getUserPermissions(request: GetUserPermissionsRequest) {
    // TODO get the user permissions here
    try {
      const userPermissions = await this.db.execute({
        query: select('roles.permissions', 'permissions')
          .from('users')
          .where({ id: request.id }),
        schema: z.any(),
      });

      const mergedPermissions = userPermissions[0]['permissions'].concat(
        userPermissions[0]['roles']['permissions'].flatMap(
          (permission) => permission,
        ),
      );

      const uniqueMergedPermissions = [...new Set(mergedPermissions)];

      const permissions = await this.db.execute({
        query: select().from('permissions').where('id INSIDE $permissionIds'),
        params: {
          permissionIds: uniqueMergedPermissions,
        },
        schema: Permission,
      });

      console.log(permissions);

      return {
        permissions: permissions,
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
}
