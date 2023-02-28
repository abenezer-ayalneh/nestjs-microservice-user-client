import { status as GrpcStatus } from '@grpc/grpc-js';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Cirql, create, select, update } from 'cirql';
import { ValidationMessages } from 'src/custom/maps/validation.maps';
import { User } from 'src/custom/models/user.model';
import { StoreUserRequest } from '../custom/requests/user.request';
import * as argon from 'argon2';
import { SuccessMessages } from 'src/custom/maps/success.maps';

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

  async storeUser(request: StoreUserRequest) {
    try {
      const userFromDb = await this.db.execute({
        query: select().from('users').where({ email: request.email }),
        schema: User,
      });

      if (userFromDb.length === 0) {
        await this.db.execute({
          query: create('users').setAll({ email: request.email }),
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

  async checkUser(request: StoreUserRequest) {
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
      throw new RpcException({
        message: error.message ?? ValidationMessages.SOMETHING_WENT_WRONG,
        code: GrpcStatus.INTERNAL,
      });
    }
  }
}
