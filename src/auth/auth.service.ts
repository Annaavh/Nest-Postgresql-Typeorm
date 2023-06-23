import { Injectable, ForbiddenException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private userRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(){
    return await this.userRepository.find()
  }

  async signinLocal(dto: AuthDto) {
    const user = await this.findByEmail(dto.email);
    console.log(user, '-- user');
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    console.log(dto.password, ' -- dto.password');
    console.log(passwordMatches, '-- passwordMatches');
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signup(dto: AuthDto) {
    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    delete newUser.password;
    delete newUser.hashedRt;

    return newUser;
  }

  async logout(userId: number) {
    const user = await this.userRepository.update(
      { id: userId, hashedRt: Not(IsNull()) },
      { hashedRt: null },
    );

    console.log(user, '-- user from service query');
    return true;
  }
  async removeUser(userId: number) {
    console.log(userId, '-- USER ID');
    const removedUser = await this.userRepository.delete(userId);
    console.log(removedUser, '-- removed user');
    return true;
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userRepository.findBy({ id: userId });

    const rtMatches = await bcrypt.compare(rt, user[0]['hashedRt']);

    if (!user || !user[0]['hashedRt'] || !rtMatches)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user[0].id, user[0].email);

    await this.updateRtHash(user[0].id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string): Promise<any> {
    const hash = await this.hashData(rt);

    await this.userRepository.update(userId, {
      hashedRt: hash,
    });
  }

  async hashData(data: string): Promise<string> {
    // return bcrypt.hash(data, 10);
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(data, salt);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
