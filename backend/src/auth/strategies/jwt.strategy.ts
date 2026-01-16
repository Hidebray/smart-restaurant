import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // IMPORTANT: Use the same secret as in AuthModule
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    // This object will be attached to the request object as req.user
    const { password, ...result } = user;
    return result;
  }
}
