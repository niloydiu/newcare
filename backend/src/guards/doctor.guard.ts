import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class DoctorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers.dtoken ||
      (request.headers.authorization && request.headers.authorization.split(' ')[1]);

    if (!token) {
      throw new BadRequestException({ success: false, message: 'Access denied, token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      request.docId = decoded.id;
      request.body.docId = decoded.id;
      return true;
    } catch (err) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid token',
        details: err.message,
      });
    }
  }
}
