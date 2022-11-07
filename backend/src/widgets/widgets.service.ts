import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WidgetEntity } from './entities/widget.entity';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { UserService } from '../user/user.service';
import { CreateWidgetDto } from './dto/create-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(WidgetEntity)
    private readonly widgetRepository: Repository<WidgetEntity>,
    private readonly userService: UserService,
  ) {}

  async getAllUserWidgets(userId: number): Promise<WidgetEntity[]> {
    return await this.widgetRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getOneUserWidget(
    userId: number,
    widgetKey: string,
  ): Promise<WidgetEntity | undefined> {
    return await this.widgetRepository.findOne({
      where: { userId, key: widgetKey },
    });
  }

  async createUserWidget(userId: number, data: CreateWidgetDto) {
    const user = await this.userService.findOne(userId);

    const widget = this.widgetRepository.create(data);
    widget.user = user;

    return await this.widgetRepository.save(widget);
  }

  async updateWidgetState(
    userId: number,
    widgetKey: string,
    data: UpdateWidgetDto,
  ): Promise<WidgetEntity> {
    const widget = await this.widgetRepository.findOneOrFail({
      where: { userId, key: widgetKey },
    });

    widget.state = data.state;
    await this.widgetRepository.save(widget);

    return widget;
  }

  async removeWidget(userId: number, widgetKey: string): Promise<void> {
    await this.widgetRepository.delete({
      userId,
      key: widgetKey,
    });
  }
}
