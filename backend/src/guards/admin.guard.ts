import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const atoken = request.headers.atoken;

    if (!atoken) {
      throw new BadRequestException({ success: false, message: 'Access denied, token missing' });
    }

    try {
      const decoded = jwt.verify(atoken, process.env.JWT_SECRET) as string;
      const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
      if (decoded !== expected) {
        throw new BadRequestException({ success: false, message: 'Access denied, invalid token' });
      }
      return true;
    } catch (err) {
      throw new BadRequestException({ success: false, message: 'Access denied, invalid token' });
    }
  }
}
