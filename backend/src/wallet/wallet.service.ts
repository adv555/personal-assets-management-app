import { UserEntity } from './../user/entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/createWallet.dto';
import { WalletEntity } from './entities/wallet.entity';
import { UpdateWalletDto } from './dto/updateWallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewWallet(
    userId: number,
    createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new HttpException(
        `User with id: ${userId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newWallet = this.walletRepository.create(createWalletDto);
    newWallet.owner = currentUser;

    return await this.walletRepository.save(newWallet);
  }

  async getWalletById(id: number): Promise<WalletEntity> {
    return await this.walletRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async getAllUserWallets(userId: number): Promise<WalletEntity[]> {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallets'],
    });

    if (!currentUser) {
      throw new HttpException(
        `User with id: ${userId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    return currentUser.wallets;
  }

  async getOneWallet(currentUserId: number, id: number): Promise<WalletEntity> {
    const wallet = await this.getWalletById(id);

    if (!wallet) {
      throw new HttpException('Wallet does not exist', HttpStatus.NOT_FOUND);
    }

    if (wallet.owner.id !== currentUserId) {
      throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
    }

    return wallet;
  }

  async updateWallet(
    id: number,
    updateWalletDto: UpdateWalletDto,
  ): Promise<WalletEntity> {
    const wallet = await this.getWalletById(id);

    if (!wallet) {
      throw new HttpException('Wallet does not exist', HttpStatus.NOT_FOUND);
    }

    const newWallet = this.walletRepository.create(updateWalletDto);
    await this.walletRepository.update(id, newWallet);
    return await this.walletRepository.findOneBy({ id });
  }

  async removeWallet(currentUserId: number, walletId: number): Promise<void> {
    const wallet = await this.getWalletById(walletId);

    if (!wallet) {
      throw new HttpException('Wallet does not exist', HttpStatus.NOT_FOUND);
    }

    if (wallet.owner.id !== currentUserId) {
      throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
    }

    await this.walletRepository.delete({ id: walletId });
  }
}
