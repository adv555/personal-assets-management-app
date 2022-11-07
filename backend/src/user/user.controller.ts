import { SkipThrottle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { User } from '../user/decorators/user.decorator';
import { FilterDto } from './dto/filter.dto';

@ApiTags('User')
@SkipThrottle()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Find user by email or name and return it.' })
  @ApiOkResponse({
    description: 'User has been successfully returned',
    type: UserEntity,
  })
  @ApiQuery({
    name: 'email',
    type: 'string',
    description: 'User email',
  })
  async findByEmailOrName(
    @User('id') id: number,
    @Query() searchQuery: FilterDto,
  ) {
    return await this.userService.findByEmailOrName(searchQuery, id);
  }
  @Get()
  @ApiOperation({ summary: 'Get all users and return an array of them.' })
  @ApiOkResponse({
    description: 'All users have been successfully returned in array',
    type: [
      OmitType(UserEntity, ['password', 'refreshTokenHash', 'activationLink']),
    ],
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.userService.findAll(paginationQuery);
  }

  @Get('/current')
  @ApiOperation({ summary: 'Get current user by token' })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: HttpStatus.UNAUTHORIZED },
        message: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User has been successfully return',
    type: UserEntity,
  })
  async findCurrentUser(@User('id') currentUserId: number) {
    return this.userService.getUserProfile(currentUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id and return it.' })
  @ApiOkResponse({
    description: 'User has been successfully returned',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        email: {
          type: 'string',
          example: 'johndoe@gmail.com',
        },
        firstName: {
          type: 'string',
          example: 'John',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
        },
        phone: {
          type: 'string',
          example: '+380000000000',
        },
        address: {
          type: 'string',
          example: 'Kyiv, Ukraine',
        },
        birthdate: {
          type: 'string',
          example: '2000-01-01',
        },
        avatarPath: {
          type: 'string',
          example:
            'http://res.cloudinary.com/myfinance/image/upload/v1663852314/MyFinance/yx5xzpm6ivnjjarg9cj3.webp',
        },
        wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            sum: {
              type: 'number',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user.' })
  @ApiOkResponse({
    description: 'User with specified id has been successfully updated',
    type: OmitType(UserEntity, [
      'password',
      'refreshTokenHash',
      'activationLink',
    ]),
  })
  async update(@User('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('avatar')
  @ApiOperation({ summary: 'Update current user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar file',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Current User avatar has been successfully updated',
    type: OmitType(UserEntity, [
      'password',
      'refreshTokenHash',
      'activationLink',
    ]),
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @User('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(id, file);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete current user profile by id and password.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'John@123',
        },
      },
    },
  })
  @ApiNoContentResponse()
  async remove(@User('id') id: number, @Body() userData: { password: string }) {
    return this.userService.remove(id, userData);
  }

  @Post('/by-params')
  @ApiOperation({ summary: `get customer user by params` })
  async getCustomerByParams(@Body() params: any): Promise<UserEntity> {
    return this.userService.findCustomerByParams(params);
  }
}
