import { CostEntity } from './entities/cost.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCostDto } from './dto/createCost.dto';
import { UpdateCostDto } from './dto/updateCost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { WalletLimitService } from '../walletLimit/walletLimit.service';
import { UserEntity } from '../user/entities/user.entity';
import { AllWalletCostsResponseDto } from './dto/allWalletCostsResponse.dto';
import { AllUserCostsResponseType } from './interfaces/allUserCostsResponse.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { WalletStatus } from 'src/wallet/enums/walletStatus.enum';

@Injectable()
export class CostsService {
  constructor(
    @InjectRepository(CostEntity)
    private costRepository: Repository<CostEntity>,
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    @Inject(WalletLimitService)
    private walletLimitService: WalletLimitService,
  ) {}

  async createCost(
    walletId: number,
    createCostDto: CreateCostDto,
  ): Promise<CostEntity> {
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

    if (wallet.status === WalletStatus.CLOSE) {
      throw new HttpException(
        `Wallet ${wallet.wallet_name} is close, you can't add new costs`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const limit = await this.walletLimitService.getWalletLimitByWalletId(
      walletId,
    );

    if (limit) {
      const currentDate = new Date();
      const dayInMilisec = 24 * 60 * 60 * 1000;
      const startDate4CalculateSumMilisec =
        currentDate.getTime() - limit.wallet_duration * dayInMilisec;
      const startDate4CalculateSum = new Date(startDate4CalculateSumMilisec);

      const { sum } = await this.dataSource
        .getRepository(WalletEntity)
        .createQueryBuilder('wallet')
        .leftJoinAndSelect('wallet.costs', 'cost')
        .select('SUM(cost.cost_sum)', 'sum')
        .where('wallet.id = :id AND cost.createdAt >= :after', {
          id: walletId,
          after: startDate4CalculateSum,
        })
        .getRawOne();

      const predictableBalance = Number(sum) + Number(createCostDto.cost_sum);
      const walletLimitInCoins = limit.wallet_limit * 100;

      if (predictableBalance >= walletLimitInCoins) {
        throw new HttpException(
          `Your wallet limit ${limit.wallet_limit} ${limit.wallet.currency} for ${limit.wallet_duration} days`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newCost = this.costRepository.create(createCostDto);

    if (+wallet.total_balance < +newCost.cost_sum) {
      throw new HttpException(
        `Wallet balance cannot be less than 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createCostDto.is_transaction) {
      if (!createCostDto.to_user_id) {
        throw new HttpException(
          `If it's transaction, should specify user`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const toUser = await this.userRepository.findOne({
        where: { id: createCostDto.to_user_id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      if (!toUser) {
        throw new HttpException(
          `User with id: ${createCostDto.to_user_id} doesn't find`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (toUser.id === wallet.owner.id) {
        throw new HttpException(
          `You can't send a request to yourself`,
          HttpStatus.BAD_REQUEST,
        );
      }
      newCost.to_user = toUser;
    }

    newCost.wallet = wallet;
    wallet.total_balance = +wallet.total_balance - +newCost.cost_sum;

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.withRepository(this.walletRepository).save(wallet);
        return await entityManager
          .withRepository(this.costRepository)
          .save(newCost);
      },
    );
  }

  async getAllWalletCosts(
    walletId: number,
    query: PaginationQueryDto,
  ): Promise<AllWalletCostsResponseDto> {
    const wallet = await this.walletRepository.findOneBy({ id: walletId });

    if (!wallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [costs, costs_count] = await this.costRepository.findAndCount({
      where: { wallet: { id: walletId } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...wallet, costs, costs_count };
  }

  async getAllUserCosts(
    userId: number,
    query: PaginationQueryDto,
  ): Promise<AllUserCostsResponseType> {
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

    let costs_count = 0;
    let costs = [];

    if (user.wallets.length <= 0) {
      return { ...user, costs, costs_count };
    }

    const walletsIds = user.wallets.map((wallet) => wallet.id);

    [costs, costs_count] = await this.costRepository.findAndCount({
      where: { wallet: { id: In(walletsIds) } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...user, costs, costs_count };
  }

  async updateCost(
    costId: number,
    updateCostDto: UpdateCostDto,
  ): Promise<CostEntity> {
    const cost = await this.costRepository.findOne({
      where: { id: costId },
      relations: ['wallet'],
    });

    if (!cost) {
      throw new HttpException(
        `Cost with id: ${costId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      cost.wallet.status === WalletStatus.CLOSE &&
      cost.cost_sum !== updateCostDto.cost_sum
    ) {
      throw new HttpException(
        `Wallet ${cost.wallet.wallet_name} is close, you can't change your costs sum`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cost.is_transaction) {
      throw new HttpException(
        `Transactions can't be updated`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCost = this.costRepository.create(updateCostDto);

    if (updateCostDto.cost_sum) {
      const wallet = await this.walletRepository.findOneBy({
        id: cost.wallet.id,
      });
      const totalSumAfterUpdate =
        +wallet.total_balance + +cost.cost_sum - +updateCostDto.cost_sum;
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
            .withRepository(this.costRepository)
            .update({ id: costId }, newCost);
          return await entityManager
            .withRepository(this.costRepository)
            .findOneBy({ id: costId });
        },
      );
    }

    await this.costRepository.update({ id: costId }, newCost);
    return await this.costRepository.findOneBy({ id: costId });
  }

  async removeCost(costId: number): Promise<void> {
    const cost = await this.costRepository.findOne({
      where: { id: costId },
      relations: ['wallet'],
    });

    if (!cost) {
      throw new HttpException(
        `Cost with id: ${costId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (cost.wallet.status === WalletStatus.CLOSE) {
      throw new HttpException(
        `Wallet ${cost.wallet.wallet_name} is close, you can't delete costs`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cost.is_transaction) {
      throw new HttpException(
        `Transactions can't be deleted`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const wallet = await this.walletRepository.findOneBy({
      id: cost.wallet.id,
    });
    wallet.total_balance = +wallet.total_balance + +cost.cost_sum;

    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      await entityManager.withRepository(this.walletRepository).save(wallet);
      await entityManager
        .withRepository(this.costRepository)
        .delete({ id: costId });
    });
  }
}
