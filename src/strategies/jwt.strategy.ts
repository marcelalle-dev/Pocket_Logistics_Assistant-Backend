import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your_secret_key_change_this_in_production',
    });
  }

  // payload = ce qui a été signé dans auth.service.ts → { id, email, role }
  async validate(payload: { id: number; email: string; role: string }) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
