import { ApiProperty } from '@nestjs/swagger';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import {
  Column,
  Entity,
  OneToOne,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';
import { Base } from 'src/common/dto/base.dto';
import { IncomeEntity } from 'src/income/entities/income.entity';
import { CostEntity } from 'src/costs/entities/cost.entity';
import { Message } from 'src/messages/entities/message.entity';
import { WidgetEntity } from 'src/widgets/entities/widget.entity';
import { CryptoPortfolioEntity } from 'src/crypto/cryptoPortfolio/entities/cryptoPortfolio.entity';

@Entity('user')
export class UserEntity extends Base {
  @Index()
  @ApiProperty({ example: 'Doe', description: 'User name' })
  @Column({ type: 'varchar', length: 64 })
  firstName: string;

  @Index()
  @ApiProperty({ example: 'John', description: 'User surname' })
  @Column({ type: 'varchar', length: 64 })
  lastName: string;

  @Index()
  @ApiProperty({ example: 'johndoe@mail.com', description: 'User email' })
  @Column({ type: 'varchar', length: 320, unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: 'Qwerty@12345', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({
    example: '27 Astronomichna street, Kharkiv, Ukraine',
    description: 'User address field',
  })
  @Column({ nullable: true })
  address: string;

  @Index()
  @ApiProperty({
    example: '+380680802212',
    description: 'User phone number',
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: '2000-12-01', description: 'User birthdate' })
  @Column({ nullable: true, type: 'date' })
  birthdate: Date;

  @ApiProperty()
  @Column({ default: '123' })
  refreshTokenHash?: string;

  @ApiProperty()
  @Column({ default: '' })
  activationLink?: string;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    description: 'User avatar',
  })
  @Column({ nullable: true })
  avatarPath: string;

  @ApiProperty()
  @OneToMany(() => WalletEntity, (wallet: WalletEntity) => wallet.owner, {
    onDelete: 'CASCADE',
  })
  wallets: WalletEntity[];

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  hasCryptoWallet: boolean;

  @ApiProperty()
  @OneToMany(() => InvoiceEntity, (invoice) => invoice.id)
  invoice: InvoiceEntity;

  @ApiProperty()
  @OneToMany(
    () => IncomeEntity,
    (income_transaction: IncomeEntity) => income_transaction.from_user,
    {
      onDelete: 'CASCADE',
    },
  )
  income_transactions: IncomeEntity[];

  @ApiProperty()
  @Column({ default: '' })
  refreshPasswordCode?: string;

  @ApiProperty()
  @Column({ default: '' })
  codeForAuth?: string;

  @OneToMany(() => WalletEntity, (wallet) => wallet.userWallet)
  wallet?: WalletEntity[];
  @OneToMany(
    () => CostEntity,
    (costs_transaction: CostEntity) => costs_transaction.to_user,
    {
      onDelete: 'CASCADE',
    },
  )
  costs_transactions: CostEntity[];

  @OneToOne(
    () => CryptoPortfolioEntity,
    (cryptoPortfolio) => cryptoPortfolio.owner,
  )
  cryptoPortfolio: CryptoPortfolioEntity;
  @ApiProperty()
  @ManyToMany(() => InvoiceEntity, (invoice) => invoice.displayForUsers)
  displayInvoices: InvoiceEntity[];

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];

  @OneToMany(() => WidgetEntity, (widget) => widget.user)
  widgets?: WidgetEntity[];
}
