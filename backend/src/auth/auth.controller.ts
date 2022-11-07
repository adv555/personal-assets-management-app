import { SkipThrottle } from '@nestjs/throttler';
import { forgotPasswordDto } from './dto/forgotPassword';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthRegisterDto } from './dto/register.dto';
import { refreshPasswordDto } from './dto/refreshPassword.dto';
import { verifyCodeDto } from './dto/verifyCode.dto';
import { AuthDtoWithCode } from './dto/authDtoWithCode.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  [x: string]: any;
  constructor(private readonly authService: AuthService) {}

  @SkipThrottle()
  @Post('google/auth')
  async googleTest(
    @Body('token') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authGoogle(token, req, res);
  }

  @ApiOperation({ summary: 'Login new User' })
  @ApiResponse({ status: 201, type: UserEntity })
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @SkipThrottle()
  @ApiOperation({ summary: 'Verify code User' })
  @ApiResponse({ status: 201, type: UserEntity })
  @Post('login/verify')
  async loginAuthWithCode(
    @Body() dto: AuthDtoWithCode,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAuthWithCode(dto, res);
  }

  @SkipThrottle()
  @ApiOperation({
    summary: 'Create new User',
  })
  @ApiResponse({ status: 201, type: UserEntity })
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @SkipThrottle()
  @Get(':link')
  @Redirect(process.env.FRONTEND_URL)
  async activatedLink(@Param('link') link: string) {
    return this.authService.activate(link);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user['id'];

    return this.authService.logout(user, res);
  }

  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokenRefresh } = req.cookies;
    const user = req.user['id'];

    return this.authService.refreshToken(user, tokenRefresh, res);
  }

  @SkipThrottle()
  @Post('forgotPassword')
  async forgotPassword(@Body() dto: forgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @SkipThrottle()
  @Post('generateCodeForAuth')
  async sendCodeForAuth(@Body() dto: forgotPasswordDto) {
    return this.authService.generateCodeForAuth(dto);
  }

  @SkipThrottle()
  @HttpCode(200)
  @Post('verifyCode')
  async verifyCode(@Body() dto: verifyCodeDto) {
    return this.authService.verifyCode(dto);
  }

  @SkipThrottle()
  @HttpCode(200)
  @Post('verifyCodeForAuth')
  async verifyCodeForAuth(@Body() dto: verifyCodeDto) {
    return this.authService.verifyCodeAuth(dto);
  }

  @SkipThrottle()
  @HttpCode(202)
  @Patch('refreshPassword')
  async changePasswod(@Body() dto: refreshPasswordDto) {
    return this.authService.refreshPassword(dto);
  }
}
