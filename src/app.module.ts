import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './auth/auth.module';
@Global()
@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [],
  exports: [DatabaseModule],
})
export class AppModule {}
