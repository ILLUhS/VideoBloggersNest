import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { loginOrEmail, password } = req.body;
    let errorLoginEmail = false;
    let errorPass = false;
    if (!loginOrEmail || typeof loginOrEmail !== 'string')
      errorLoginEmail = true;
    if (loginOrEmail.includes('@')) {
      if (loginOrEmail.search('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$') === -1)
        errorLoginEmail = true;
    } else if (
      loginOrEmail.search('^[a-zA-Z0-9_-]*$') === -1 ||
      loginOrEmail.length < 3 ||
      loginOrEmail.length > 10
    )
      errorLoginEmail = true;
    if (
      !password ||
      typeof password !== 'string' ||
      password.length < 6 ||
      password.length > 20
    )
      errorPass = true;

    if (errorLoginEmail && errorPass)
      throw new BadRequestException({
        message: [
          {
            field: 'loginOrEmail',
            message: 'invalid loginOrEmail',
          },
          {
            field: 'password',
            message: 'invalid password',
          },
        ],
      });
    else if (errorLoginEmail)
      throw new BadRequestException({
        message: [
          {
            field: 'loginOrEmail',
            message: 'invalid loginOrEmail',
          },
        ],
      });
    else if (errorPass)
      throw new BadRequestException({
        message: [
          {
            field: 'password',
            message: 'invalid password',
          },
        ],
      });

    return next();
  }
}
