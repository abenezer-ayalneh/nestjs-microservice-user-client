import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, 'custom/proto/user.proto'),
        url: '0.0.0.0:5002',
        loader: { keepCase: true },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return errors.map((error) => {
          throw new RpcException({
            message: error.constraints
              ? Object.values(error.constraints)[0]
              : null,
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: error.constraints ? Object.values(error.constraints) : null,
          });
        });
      },
    }),
  );

  await app.listen();
}
bootstrap();
