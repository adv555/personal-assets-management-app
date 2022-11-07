import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CryptoPortfolioEntity } from '../cryptoPortfolio/entities/cryptoPortfolio.entity';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';
import { CryptoEntity } from './entities/crypto.entity';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(CryptoPortfolioEntity)
    private cryptoPortfolioRepository: Repository<CryptoPortfolioEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CryptoEntity)
    private cryptoRepository: Repository<CryptoEntity>,
  ) {}

  async creteNewCryptoItem(createCryptoDto: CreateCryptoDto, email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['cryptoPortfolio'],
    });
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const userPortfolio = await this.cryptoPortfolioRepository.findOne({
      where: { id: user.cryptoPortfolio.id },
      relations: ['cryptoItem'],
    });

    if (!userPortfolio) {
      throw new HttpException(`Portfolio not found`, HttpStatus.NOT_FOUND);
    }

    const cryptoItem = await this.cryptoRepository.findOne({
      where: {
        marker: createCryptoDto.marker,
        ownerWallet: { id: userPortfolio.id },
      },
    });

    if (!cryptoItem) {
      const newCryptoItem = this.cryptoRepository.create({
        marker: createCryptoDto.marker,
        amount: createCryptoDto.amount,
        color: createCryptoDto.color,
        imageUrl: createCryptoDto.imageUrl,
      });
      newCryptoItem.ownerWallet = userPortfolio;
      return await this.cryptoRepository.save(newCryptoItem);
    }

    cryptoItem.amount =
      Number(cryptoItem.amount) + Number(createCryptoDto.amount);

    return await this.cryptoRepository.save(cryptoItem);
  }

  async remove(idItem: number) {
    const item = await this.cryptoRepository.findOne({
      where: { id: idItem },
      relations: ['ownerWallet'],
    });

    if (!item) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }

    await this.cryptoRepository.delete({ id: idItem });
  }
}
