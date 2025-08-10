import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const token = await this.auth.login(body.username, body.password);
    if (!token) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return { accessToken: token };
  }
}
