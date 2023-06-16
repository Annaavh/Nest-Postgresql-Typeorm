import { Body, Post, Controller, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  async signup(@Body() dto: AuthDto) {
    const user = await this.authService.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('User is already registered!');
    }
    return this.authService.signup(dto);
  }
}
