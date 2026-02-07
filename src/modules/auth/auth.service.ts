import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

interface JwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validateUser(email: string, pass: string): User | null {
    const user = this.usersService.findOneByEmail(email);
    if (user && user.password == pass) {
      return user;
    }
    return null;
  }

  login(loginDto: LoginUserDto) {
    const user = this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };

    const accessTokenExpiration =
      this.configService.get<string>('app.jwtAccessTokenExpiration') || '1d';
    const refreshTokenExpiration =
      this.configService.get<string>('app.jwtRefreshTokenExpiration') || '7d';

    const access_token = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiration as any,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiration as any,
    });

    return {
      access_token,
      refresh_token,
      userId: user._id,
      email: user.email,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.usersService.findOneByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user._id };
      const accessTokenExpiration =
        this.configService.get<string>('app.jwtAccessTokenExpiration') || '15m';

      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: accessTokenExpiration as any,
      });

      return {
        access_token,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
