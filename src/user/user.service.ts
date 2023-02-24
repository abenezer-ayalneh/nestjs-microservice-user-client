import { status as GrpcStatus } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Cirql, select, update } from 'cirql';
import { ValidationMessages } from 'src/custom/maps/validation.maps';
import { User } from 'src/custom/models/user.model';
import { StoreUserRequest } from './requests/user.request';
import * as argon from 'argon2';

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
