import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Surreal, { Result } from 'surrealdb.js';
import { StoreUserRequest } from './requests/user.request';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import * as argon from 'argon2';
import { ValidationMessages } from 'src/custom/maps/validation.maps';

@Injectable()
export class UserService {
  private db: Surreal;
  constructor(private config: ConfigService) {
    this.db = new Surreal(config.get<string>('SURREAL_DB_URL'));
  }

  async storeUser(request: StoreUserRequest) {
    try {
      await this.db.signin({
        user: this.config.get<string>('SURREAL_DB_USER'),
        pass: this.config.get<string>('SURREAL_DB_PASSWORD'),
      });

      // Select a specific namespace / database
      await this.db.use(
        this.config.get<string>('SURREAL_DB_NAMESPACE'),
        this.config.get<string>('SURREAL_DB_DATABASE'),
      );

      const userCheckResult = await this.db.query<Result>(
        `SELECT * from users where email = $email;`,
        { email: request.email },
      );

      console.log(userCheckResult[0].result);

      if (
        typeof userCheckResult[0] !== 'undefined' &&
        userCheckResult[0].result.length !== 0
      ) {
        const token = await argon.hash(request.password);
        const user = await this.db.update('users', {
          email: request.email,
          accessToken: token,
        });

        return user[0];
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
