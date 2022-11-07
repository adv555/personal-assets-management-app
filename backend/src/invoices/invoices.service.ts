import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import {
  Between,
  DataSource,
  EntityManager,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoiceItem.entity';
import { InvoiceItemDto } from './dto/invoiceItem.dto';
import { PageOptionsDto } from 'src/pagination/dto/pageOptionsDto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';
import { IFiltersInvoice } from 'src/interfaces/paramsFilterInvoice.interface';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(InvoiceItemEntity)
    private itemRepository: Repository<InvoiceItemEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private dataSource: DataSource,
  ) {}

  private async getUser(user: UserEntity) {
    const currentUser = await this.userRepository
      .findOneOrFail({
        where: user,
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'address',
          'avatarPath',
        ],
      })
      .catch(() => {
        throw new HttpException(
          user.email
            ? `User with email: ${user.email} does not exist`
            : `User with id: ${user.id} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      });
    return currentUser;
  }

  private async getInvoiceByIdForUser(
    whereParams: object,
    relationsParams: object,
  ) {
    const paramsUserSelect = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      address: true,
      avatarPath: true,
    };
    const invoice = await this.invoiceRepository
      .findOneOrFail({
        where: whereParams,
        relations: relationsParams,
        select: { createdBy: paramsUserSelect, billedTo: paramsUserSelect },
      })
      .catch(() => {
        throw new HttpException(
          'Invoice does not found for user',
          HttpStatus.NOT_FOUND,
        );
      });
    return invoice;
  }

  private validateTotalPrice(
    items: InvoiceItemDto[],
    discount: number,
    entryTotalPrice: number,
  ) {
    const subTotal = items.reduce(
      (total, item) => item.price * item.amount + total,
      0,
    );
    const total = Math.round((subTotal * (100 - discount)) / 100);
    if (total !== entryTotalPrice) {
      throw new HttpException(
        'total price is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getParamsForFilters(filters: IFiltersInvoice, userId: number) {
    const params = { displayForUsers: { id: userId } };
    let billedTo = {};
    let createdBy = {};
    if (filters.search) {
      if (parseInt(filters.search)) {
        params['id'] = parseInt(filters.search);
      } else if (filters.search.includes('@')) {
        billedTo['email'] = ILike(filters.search);
        createdBy['email'] = ILike(filters.search);
      } else {
        const firstAndLastNameParams = [
          { firstName: ILike(In(filters.search.split(' '))) },
          { lastName: ILike(In(filters.search.split(' '))) },
        ];
        billedTo = firstAndLastNameParams;
        createdBy = firstAndLastNameParams;
      }
    }
    if (filters.minDate && filters.maxDate) {
      params['invoiceDate'] = Between(
        new Date(filters.minDate),
        new Date(filters.maxDate),
      );
    }
    if (filters.minDate && !filters.maxDate) {
      params['invoiceDate'] = MoreThanOrEqual(new Date(filters.minDate));
    }
    if (filters.maxDate && !filters.minDate) {
      params['invoiceDate'] = LessThanOrEqual(new Date(filters.maxDate));
    }
    if (filters.minPrice && filters.maxPrice) {
      params['total'] = Between(
        parseInt(filters.minPrice),
        parseInt(filters.maxPrice),
      );
    }
    if (filters.minPrice && !filters.maxPrice) {
      params['total'] = MoreThanOrEqual(parseInt(filters.minPrice));
    }
    if (filters.maxPrice && !filters.minPrice) {
      params['total'] = LessThanOrEqual(parseInt(filters.maxPrice));
    }
    if (filters.status) {
      switch (filters.status) {
        case 'paid':
          params['paid'] = true;
          break;
        case 'unpaid':
          params['dueDate'] = LessThanOrEqual(new Date());
          params['paid'] = false;
          break;
        case 'pending':
          params['dueDate'] = MoreThanOrEqual(new Date());
          params['paid'] = false;
          break;
      }
    }
    if (filters.target === 'toUser') {
      return { ...params, createdBy, billedTo: { id: userId } };
    }
    if (filters.target === 'fromUser') {
      return { ...params, createdBy: { id: userId }, billedTo };
    }
    if (Object.keys(createdBy).length > 0 && Object.keys(billedTo).length > 0) {
      return [
        { ...params, createdBy },
        { ...params, billedTo },
      ];
    }
    return { ...params, createdBy, billedTo };
  }

  public async createInvoice(
    invoiceDto: InvoiceDto,
    currentUser: UserEntity,
  ): Promise<InvoiceEntity> {
    const billedTo = await this.getUser(invoiceDto.billedTo);
    this.validateTotalPrice(
      invoiceDto.items,
      invoiceDto.discount,
      invoiceDto.total,
    );
    if (invoiceDto.dueDate < invoiceDto.invoiceDate) {
      throw new HttpException(
        'Due date must be greater than or equal to the Invoice date',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newInvoice = this.invoiceRepository.create({
      ...invoiceDto,
      createdBy: currentUser,
      billedTo: billedTo,
      displayForUsers: [currentUser, billedTo],
    });
    return await this.invoiceRepository.save(newInvoice);
  }

  public async updateInvoice(
    invoiceId: number,
    invoiceDto: UpdateInvoiceDto,
    currentUser: UserEntity,
  ): Promise<InvoiceEntity> {
    const billedTo = await this.getUser(invoiceDto.billedTo);
    this.validateTotalPrice(
      invoiceDto.items,
      invoiceDto.discount,
      invoiceDto.total,
    );
    const oldInvoice = await this.getInvoiceByIdForUser(
      {
        id: invoiceId,
        createdBy: { id: currentUser.id },
        displayForUsers: { id: currentUser.id },
      },
      { billedTo: true },
    );
    if (oldInvoice.paid) {
      throw new HttpException(
        'This invoice has already been paid for and its change is prohibited',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (invoiceDto.dueDate < invoiceDto.invoiceDate) {
      throw new HttpException(
        'Due date must be greater than or equal to the Invoice date',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newInvoice = this.invoiceRepository.create({
      ...invoiceDto,
      id: invoiceId,
      billedTo: billedTo,
      displayForUsers: [currentUser, billedTo],
    });
    const oldItems = await this.itemRepository.find({
      select: { id: true },
      where: { invoice: { id: invoiceId } },
    });
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        if (oldItems) {
          await entityManager
            .withRepository(this.itemRepository)
            .delete(oldItems.map((item) => item.id));
        }
        return await entityManager
          .withRepository(this.invoiceRepository)
          .save(newInvoice);
      },
    );
  }

  public async removeInvoiceForUser(
    invoiceId: number,
    currentUser: UserEntity,
  ): Promise<void> {
    const invoice = await this.getInvoiceByIdForUser(
      { id: invoiceId },
      { displayForUsers: true },
    );
    if (
      !invoice.displayForUsers.map((user) => user.id).includes(currentUser.id)
    ) {
      throw new HttpException(
        `Invoice does not found for user: ${currentUser.email}`,
        HttpStatus.NOT_FOUND,
      );
    }
    invoice.displayForUsers = invoice.displayForUsers.filter(
      (user) => user.id !== currentUser.id,
    );
    await this.invoiceRepository.save(invoice);
  }

  public async getOneById(
    forUpdate: boolean,
    invoiceId: number,
    currentUser: UserEntity,
  ): Promise<InvoiceDto> {
    const params = { id: invoiceId, displayForUsers: { id: currentUser.id } };
    if (forUpdate) {
      params['createdBy'] = { id: currentUser.id };
    }
    return await this.getInvoiceByIdForUser(params, {
      items: true,
      createdBy: true,
      billedTo: true,
    });
  }

  public async getAllInvoicesForUser(
    currentUser: UserEntity,
    filters: IFiltersInvoice,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<InvoiceDto>> {
    const params = this.getParamsForFilters(filters, currentUser.id);
    const listInvoices = await this.invoiceRepository.findAndCount({
      where: params,
      relations: { items: true, createdBy: true, billedTo: true },
      order: { invoiceDate: filters.firstNew ? 'DESC' : 'ASC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount: listInvoices[1],
    });
    const pageDto = new PageDto(listInvoices[0], pageMetaDto);
    return pageDto;
  }
}
