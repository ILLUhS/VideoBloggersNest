import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../application/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /*async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }*/

  async login(user: any) {
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
    };
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
  async cechCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersService.findUserByField(
      await this.isLoginOrEmail(loginOrEmail),
      loginOrEmail,
    );
    if (!user) return null;
    const passwordHash = await this.generateHash(
      password,
      user.passwordHash.substring(0, 30),
    );
    const confirmed = user.emailIsConfirmed;
    if (!confirmed) return null;
    return user.passwordHash === passwordHash ? user : null;
  }
  async isLoginOrEmail(loginOrEmail: string) {
    return loginOrEmail.includes('@') ? 'email' : 'login';
  }
}
