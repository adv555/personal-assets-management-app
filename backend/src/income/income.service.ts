import { UserEntity } from './../user/entities/user.entity';
import { IncomeEntity } from './entities/income.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/createIncome.dto';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { AllWalletIncomeResponseDto } from './dto/allWalletIncomeResponse.dto';
import { AllUserIncomeResponseType } from './interfaces/allUserIncomeResponse.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(IncomeEntity)
    private incomeRepository: Repository<IncomeEntity>,
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createIncome(
    walletId: number,
    createIncomeDto: CreateIncomeDto,
  ): Promise<IncomeEntity> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['owner'],
    });

    if (!wallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newIncome = this.incomeRepository.create(createIncomeDto);
    newIncome.wallet = wallet;

    if (createIncomeDto.is_transaction) {
      if (!createIncomeDto.from_user_id) {
        throw new HttpException(
          `If it's transaction, should specify user`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const fromUser = await this.userRepository.findOne({
        where: { id: createIncomeDto.from_user_id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (!fromUser) {
        throw new HttpException(
          `User with id: ${createIncomeDto.from_user_id} doesn't find`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (fromUser.id === wallet.owner.id) {
        throw new HttpException(
          `You can't send a request to yourself`,
          HttpStatus.BAD_REQUEST,
        );
      }
      newIncome.from_user = fromUser;
    }

    wallet.total_balance = +wallet.total_balance + +newIncome.income_sum;

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.withRepository(this.walletRepository).save(wallet);
        return await entityManager
          .withRepository(this.incomeRepository)
          .save(newIncome);
      },
    );
  }

  async getAllWalletIncome(
    walletId: number,
    query: PaginationQueryDto,
  ): Promise<AllWalletIncomeResponseDto> {
    const wallet = await this.walletRepository.findOneBy({ id: walletId });

    if (!wallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [income, income_count] = await this.incomeRepository.findAndCount({
      where: { wallet: { id: walletId } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...wallet, income, income_count };
  }

  async getAllUserIncome(
    userId: number,
    query: PaginationQueryDto,
  ): Promise<AllUserIncomeResponseType> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallets'],
    });

    if (!user) {
      throw new HttpException(
        `User with id: ${userId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    let income_count = 0;
    let income = [];

    if (user.wallets.length <= 0) {
      return { ...user, income, income_count };
    }

    const walletsIds = user.wallets.map((wallet) => wallet.id);

    [income, income_count] = await this.incomeRepository.findAndCount({
      where: { wallet: { id: In(walletsIds) } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...user, income, income_count };
  }

  async updateIncome(
    incomeId: number,
    updateIncomeDto: UpdateIncomeDto,
  ): Promise<IncomeEntity> {
    const income = await this.incomeRepository.findOne({
      where: { id: incomeId },
      relations: ['wallet'],
    });

    if (!income) {
      throw new HttpException(
        `Income with id: ${incomeId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (income.is_transaction) {
      throw new HttpException(
        `Transactions can't be updated`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newIncome = this.incomeRepository.create(updateIncomeDto);

    if (updateIncomeDto.income_sum) {
      const wallet = await this.walletRepository.findOneBy({
        id: income.wallet.id,
      });
      const totalSumAfterUpdate =
        +wallet.total_balance -
        +income.income_sum +
        +updateIncomeDto.income_sum;
      if (totalSumAfterUpdate < 0) {
        throw new HttpException(
          `Wallet balance cannot be less than 0`,
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.total_balance = totalSumAfterUpdate;

      return await this.dataSource.transaction(
        async (entityManager: EntityManager) => {
          await entityManager
            .withRepository(this.walletRepository)
            .save(wallet);
          await entityManager
            .withRepository(this.incomeRepository)
            .update({ id: incomeId }, newIncome);
          return await entityManager
            .withRepository(this.incomeRepository)
            .findOneBy({ id: incomeId });
        },
      );
    }

    await this.incomeRepository.update({ id: incomeId }, newIncome);
    return await this.incomeRepository.findOneBy({ id: incomeId });
  }

  async removeIncome(incomeId: number): Promise<void> {
    const income = await this.incomeRepository.findOne({
      where: { id: incomeId },
      relations: ['wallet'],
    });

    if (!income) {
      throw new HttpException(
        `Income with id: ${incomeId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (income.is_transaction) {
      throw new HttpException(
        `Transactions can't be deleted`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const wallet = await this.walletRepository.findOneBy({
      id: income.wallet.id,
    });

    if (+wallet.total_balance < +income.income_sum) {
      throw new HttpException(
        `Wallet balance cannot be less than 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    wallet.total_balance = +wallet.total_balance - +income.income_sum;

    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      await entityManager.withRepository(this.walletRepository).save(wallet);
      await entityManager
        .withRepository(this.incomeRepository)
        .delete({ id: incomeId });
    });
  }
}
