import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  email: string;
  sub: string;
}

interface LoginUser {
  _id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  login(user: LoginUser) {
    const payload = { email: user.email, sub: user._id };
    const accessTokenExpiration =
      this.configService.get<string>('app.jwtAccessTokenExpiration') || '45m';
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
