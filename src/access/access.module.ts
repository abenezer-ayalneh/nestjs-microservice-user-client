import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [UserModule],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
