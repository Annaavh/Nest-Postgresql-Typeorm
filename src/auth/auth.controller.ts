import {
  Body,
  UseGuards,
  Post,
  Controller,
  ConflictException,
  Delete,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-userId.decorator';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from '../common/guards/at.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user';
import { RtGuard } from 'src/common/guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return users.map(({ id, email }) => ({ id, email }));
  }

  @Post('local/signup')
  async signup(@Body() dto: AuthDto) {
    const user = await this.authService.findByEmail(dto.email);
    console.log(user, ' --- user from signup');
    if (user) {
      throw new ConflictException('User is already registered!');
    }
    return this.authService.signup(dto);
  }

  @Post('local/signin')
  async signinLocal(@Body() dto: AuthDto) {
    return this.authService.signinLocal(dto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(AtGuard)
  @Post('logout')
  logout(
    // @Req() req: Request
    @GetCurrentUserId() userId: number,
  ): Promise<boolean> {
    // const request = req.switchToHttp().getRequest();
    // console.log(req.user);
    return this.authService.logout(userId);
  }

  @UseGuards(AtGuard)
  @Delete('remove')
  delete(@GetCurrentUserId() userId: number) {
    return this.authService.removeUser(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
