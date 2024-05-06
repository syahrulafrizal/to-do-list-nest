import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../config/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: RegisterDto) {
    try {
      return this.authService.register(body);
    } catch (error) {
      throw new Error('Register Failed');
    }
  }

  @Post('/login')
  login(@Body() body: LoginDto, @Headers() headers) {
    try {
      return this.authService.login(body, headers['user-agent']);
    } catch (error) {
      throw new Error('Login Failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    try {
      return this.authService.profile(req.user);
    } catch (error) {
      throw new Error('Get Profile Failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Request() req) {
    try {
      return this.authService.logout(req.user);
    } catch (error) {
      throw new Error('Logout Failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('sessions')
  sessions(@Request() req) {
    try {
      return this.authService.sessions(req.user);
    } catch (error) {
      throw new Error('Get Sessions Failed');
    }
  }
}
