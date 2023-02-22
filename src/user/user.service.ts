import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Surreal, { Result } from 'surrealdb.js';
import * as argon from 'argon2';
import { StoreUserRequest } from './requests/user.request';
import { RpcException } from '@nestjs/microservices';

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

      const userCheckResult = await this.db.query<Result<any>>(
        'SELECT * from users where email = $email',
        { email: request.email },
      );

      //   console.log(userCheckResult[0].result.length === 0);

      if (userCheckResult.result.length === 0) {
        const token = await argon.hash(request.password);

        const user = await this.db.create('users', {
          email: request.email,
          accessToken: token,
        });

        console.log(user);
        return user;
      } else {
        throw new RpcException({
          message: 'validation.USER_EXISTS',
          code: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
