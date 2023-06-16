import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private userRepository: Repository<Auth>,
  ) {}

  async signup(dto: AuthDto) {
    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
