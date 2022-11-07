import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { User } from '../user/decorators/user.decorator';
import { WidgetEntity } from './entities/widget.entity';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { CreateWidgetDto } from './dto/create-widget.dto';

@ApiTags('widgets')
@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetService: WidgetsService) {}

  @ApiResponse({ status: HttpStatus.OK, type: [WidgetEntity] })
  @Get()
  async getAllUserWidgets(@User('id') userId: number): Promise<WidgetEntity[]> {
    return await this.widgetService.getAllUserWidgets(userId);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [WidgetEntity] })
  @Post()
  async createUserWidget(
    @User('id') userId: number,
    @Body() data: CreateWidgetDto,
  ): Promise<WidgetEntity> {
    const widget = await this.widgetService.getOneUserWidget(userId, data.key);

    if (widget)
      throw new HttpException(
        'User already has a widget with this key',
        HttpStatus.CONFLICT,
      );

    return await this.widgetService.createUserWidget(userId, data);
  }

  @ApiResponse({ status: HttpStatus.OK, type: WidgetEntity })
  @Patch(':widgetKey')
  async updateWidgetState(
    @User('id') userId: number,
    @Param('widgetKey') widgetKey: string,
    @Body() data: UpdateWidgetDto,
  ): Promise<WidgetEntity> {
    const widget = await this.widgetService.getOneUserWidget(userId, widgetKey);

    if (!widget)
      throw new HttpException(
        "Widget with this key doen't exists",
        HttpStatus.NOT_FOUND,
      );

    return await this.widgetService.updateWidgetState(userId, widgetKey, data);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':widgetKey')
  async removeUserWidget(
    @User('id') userId: number,
    @Param('widgetKey') widgetKey: string,
  ): Promise<void> {
    const widget = await this.widgetService.getOneUserWidget(userId, widgetKey);

    if (!widget)
      throw new HttpException(
        "Widget with this key doen't exists",
        HttpStatus.NOT_FOUND,
      );

    return await this.widgetService.removeWidget(userId, widgetKey);
  }
}
