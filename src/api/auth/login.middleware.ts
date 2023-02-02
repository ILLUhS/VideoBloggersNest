import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { loginOrEmail, password } = req.body;
    if (!loginOrEmail || typeof loginOrEmail !== 'string')
      throw new BadRequestException();
    if (loginOrEmail.includes('@')) {
      if (loginOrEmail.search('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$') === -1)
        throw new BadRequestException();
    } else if (
      loginOrEmail.search('^[a-zA-Z0-9_-]*$') === -1 ||
      loginOrEmail.length < 3 ||
      loginOrEmail.length > 10
    )
      throw new BadRequestException();
    if (!password || typeof password !== 'string')
      throw new BadRequestException();
    if (password.length < 6 || password.length > 20)
      throw new BadRequestException();
    return next();
  }
}
