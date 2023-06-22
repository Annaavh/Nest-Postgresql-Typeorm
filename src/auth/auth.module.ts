import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy,RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
