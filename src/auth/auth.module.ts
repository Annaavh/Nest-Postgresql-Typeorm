import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
