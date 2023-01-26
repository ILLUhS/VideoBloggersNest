import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SettingsEnv {
  constructor(@Inject() private configService: ConfigService) {}
  public MONGO_URL = this.configService.get<string>('MONGO_URL');
  public JWT_SECRET = this.configService.get<string>('JWT_SECRET');
  public RefreshJWT_SECRET = this.configService.get<string>('JWT_SECRET');
  public PORT = this.configService.get<string>('PORT') || 3000;
  public EMAIL_PASS = this.configService.get<string>('EMAIL_PASS');
  public EMAIL_LOGIN = this.configService.get<string>('EMAIL_LOGIN');
}
