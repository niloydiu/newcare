import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;

    if (!token) {
      throw new BadRequestException({ success: false, message: 'Access denied, token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      request.userId = decoded.id;
      // Many controller methods read userId from req.body
      request.body.userId = decoded.id;
      return true;
    } catch (err) {
      throw new BadRequestException({ success: false, message: 'Access denied, invalid token' });
    }
  }
}
