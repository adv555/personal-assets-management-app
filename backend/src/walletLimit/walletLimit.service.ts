import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import { Any, Repository } from 'typeorm';
import { CreateWalletLimitDto } from './dto/create-walletLimit.dto';
import { UpdateWalletLimitDto } from './dto/update-walletLimit.dto';
import { WalletLimitEntity } from './entities/walletLimit.entity';

@Injectable()
export class WalletLimitService {
  constructor(
    @InjectRepository(WalletLimitEntity)
    private walletLimitRepository: Repository<WalletLimitEntity>,
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewWalletLimit(
    walletId: number,
    createWalletLimitDto: CreateWalletLimitDto,
  ): Promise<WalletLimitEntity> {
    const currentWallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!currentWallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newWallet = this.walletLimitRepository.create(createWalletLimitDto);
    newWallet.wallet = currentWallet;

    return await this.walletLimitRepository.save(newWallet);
  }

  async updateWalletLimit(
    walletLimitId: number,
    updateWalletLimitDto: UpdateWalletLimitDto,
  ): Promise<WalletLimitEntity> {
    const currentWalletLimit = await this.walletLimitRepository.findOne({
      where: { id: walletLimitId },
    });

    if (!currentWalletLimit) {
      throw new HttpException(
        `Wallet limit with id: ${walletLimitId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.walletLimitRepository.update(
      { id: walletLimitId },
      updateWalletLimitDto,
    );
    return currentWalletLimit;
  }

  async getAllWalletLimits(userId: number): Promise<any> {
    const tmp = await this.walletLimitRepository.find({
      where: { wallet: { owner: { id: userId } } },
      relations: { wallet: true },
      order: {
        id: 'ASC',
      },
      // relations: ['walletLimits'],
    });

    if (!tmp) {
      throw new HttpException(
        `User with id: ${userId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const res = {
      tmp: tmp,
      userId: userId,
    };

    return res;
  }

  async getWalletLimitByWalletId(walletId: number): Promise<any> {
    const walletLimit = await this.walletLimitRepository.findOne({
      where: { wallet: { id: walletId } },
      relations: { wallet: true },
    });

    if (!walletLimit) {
      return null;
    }

    return walletLimit;
  }

  async removeWalletLimit(walletLimitId: number): Promise<any> {
    const walletLimit = await this.walletLimitRepository.findOne({
      where: { id: walletLimitId },
    });

    if (!walletLimit) {
      throw new HttpException(
        `Wallet limit with id: ${walletLimitId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.walletLimitRepository.delete({ id: walletLimitId });
  }
}
