import { verifyCodeDto } from './dto/verifyCode.dto';
import { OAuth2Client } from 'google-auth-library';
import { AuthDto } from './dto/auth.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { Request, Response } from 'express';
import { AuthRegisterDto } from './dto/register.dto';
import { forgotPasswordDto } from './dto/forgotPassword';
import { refreshPasswordDto } from './dto/refreshPassword.dto';
import { AuthDtoWithCode } from './dto/authDtoWithCode.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async authGoogle(token: string, req: Request, res: Response) {
    const verifyUser = await this.verifyGoogleUser(token);

    if (!verifyUser) {
      throw new BadRequestException('No user from google');
    }

    console.log('start');

    const userData = await this.userRepository.findOneBy({
      email: verifyUser['email'],
    });

    if (userData) {
      const tokens = await this.getTokens(userData.id, userData.email);
      await this.updateRt(userData.id, tokens.refresh_token);

      res.cookie('tokenRefresh', tokens.refresh_token, {
        maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
        httpOnly: true,
      });

      return {
        user: userData,
        tokens: tokens,
      };
    }
    if (!userData) {
      const newUser = await this.userRepository.create({
        email: verifyUser.email,
        firstName: verifyUser.firstName,
        lastName: verifyUser.lastName,
        avatarPath: verifyUser.avatarPath,
        password: 'email',
        refreshTokenHash: ' ',
        isVerified: true,
      });

      const userCreate = await this.userRepository.save(newUser);

      const tokens = await this.getTokens(newUser['id'], newUser['email']);
      await this.updateRt(newUser.id, tokens.refresh_token);

      res.cookie('tokenRefresh', tokens.refresh_token, {
        maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
        httpOnly: true,
      });
      return {
        user: userCreate,
        tokens,
      };
    }
  }

  async verifyGoogleUser(token: string) {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    const userDataGoogle = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, picture, given_name, family_name } =
      userDataGoogle.getPayload();

    const user = {
      email: email,
      firstName: given_name,
      lastName: family_name,
      avatarPath: picture,
    };
    return user;
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    if (!user) {
      throw new BadRequestException('User is not found');
    }
  }

  async loginAuthWithCode(dto: AuthDtoWithCode, res: Response) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
        codeForAuth: dto.code,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid Verify Code');
    }
    const userVerify = await this.validateUser(dto);
    if (!userVerify) {
      throw new UnauthorizedException(
        'Your password or email is wrong, try again please',
      );
    }
    const tokens = await this.getTokens(userVerify.id, userVerify.email);

    this.updateRt(userVerify.id, tokens.refresh_token);

    res.cookie('tokenRefresh', tokens.refresh_token, {
      maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
      httpOnly: true,
    });

    return {
      user: user,
      tokens: tokens,
    };
  }

  async register(dto: AuthRegisterDto) {
    const oldUser = await this.userRepository.findOneBy({ email: dto.email });

    if (oldUser) {
      throw new BadRequestException('Email already exists');
    }
    const activationLink = v4();
    const salt = await genSalt(3);
    const newUser = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: await hash(dto.password, salt),
      activationLink: activationLink,
      refreshTokenHash: ' ',
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.mailerService
      .sendMail({
        to: dto.email,

        subject: 'Register',
        template: './authTemplate',
        context: {
          link: `${process.env.ACTIVATE_GMAIL_LINK}${activationLink}`,
          email: dto.email,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });

    const user = await this.userRepository.save(newUser);
    await this.updateRt(newUser.id, tokens.refresh_token);

    return {
      user,
      tokens,
    };
  }

  async logout(userId: number, res: Response) {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.refreshTokenHash = '';
    try {
      await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw new NotFoundException('Error with logout');
    }
    res.clearCookie('tokenRefresh');
    return HttpCode(200);
  }

  async refreshToken(userId: number, rt: string, res: Response) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ForbiddenException('Acces Denied and User');
    }

    const rtMatches = await compare(rt, user.refreshTokenHash);
    if (!rtMatches) {
      throw new ForbiddenException('Refresh Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRt(user.id, tokens.refresh_token);
    res.cookie('tokenRefresh', tokens.refresh_token, {
      httpOnly: true,

      maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
    });

    return {
      user: user,
      tokens: tokens,
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: ['id', 'email', 'password'],
    });
    if (!user)
      throw new NotFoundException(
        'Your password or email is wrong, try again please.',
      );

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Your password or email is wrong, try again please',
      );
    }

    return user;
  }

  async getTokens(userId: number, email: string) {
    const data = {
      id: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(data, {
        expiresIn: process.env.MAX_AGE_ACCESS_TOKEN,
        secret: process.env.JWT_SECRET,
      }),

      this.jwtService.signAsync(data, {
        expiresIn: process.env.MAX_AGE_COOKIE_REFRESH_TOKEN,
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRt(userId: number, rt: string) {
    const salt = await genSalt(3);
    const rtHash = await hash(rt, salt);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.refreshTokenHash = rtHash;

    await this.userRepository.save(user);

    return user.refreshTokenHash;
  }

  async activate(activationLink: string) {
    const user = await this.userRepository.findOneBy({ activationLink });

    if (!user) {
      throw new Error('Link not found');
    }

    user.isVerified = true;

    await this.userRepository.save(user);

    return HttpCode(200);
  }

  returnUser(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarPath: user.avatarPath,
      isVerified: user.isVerified,
    };
  }

  async forgotPassword(dto: forgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const code = await this.generateNewCode(dto);
    user.refreshPasswordCode = String(code);
    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Auth Code',
        template: './authTemplate',
        context: {
          link: process.env.FRONTEND_URL,
          email: code,
        },
      })
      .catch((e) => {
        throw new HttpException(`Error`, HttpStatus.UNPROCESSABLE_ENTITY);
      });

    await this.userRepository.save(user);
  }

  async generateCodeForAuth(dto: forgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const code = await this.generateNewCode(dto);
    user.codeForAuth = String(code);
    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Auth Code',
        template: './authTemplate',
        context: {
          link: process.env.FRONTEND_URL,
          email: code,
        },
      })
      .catch((e) => {
        throw new HttpException(`Error`, HttpStatus.UNPROCESSABLE_ENTITY);
      });

    await this.userRepository.save(user);
  }

  async generateNewCodeForAuth(dto: forgotPasswordDto) {
    setTimeout(async () => {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      user.codeForAuth = Math.random().toFixed(6).slice(2);
      return await this.userRepository.save(user);
    }, 60 * 1000);

    return Math.random().toFixed(6).slice(2);
  }

  async verifyCodeAuth(dto: verifyCodeDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
        codeForAuth: dto.code,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid Verify Code');
    }
  }

  async generateNewCode(dto: forgotPasswordDto) {
    setTimeout(async () => {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      user.refreshPasswordCode = Math.random().toFixed(6).slice(2);
      return await this.userRepository.save(user);
    }, 60 * 1000);

    return Math.random().toFixed(6).slice(2);
  }

  async verifyCode(dto: verifyCodeDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
        refreshPasswordCode: dto.code,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid Verify Code');
    }
  }

  async refreshPassword(dto: refreshPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    const salt = await genSalt(3);
    user.password = await hash(dto.password, salt);

    return await this.userRepository.save(user);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(3);

    return await hash(password, salt);
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
