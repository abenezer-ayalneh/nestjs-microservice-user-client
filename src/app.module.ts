import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GrpcMetadataResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AccessModule } from './access/access.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AccessModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/custom/i18n/'),
        watch: true,
      },
      resolvers: [GrpcMetadataResolver],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
