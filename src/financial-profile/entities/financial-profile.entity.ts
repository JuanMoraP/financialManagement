import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { CurrencyEnum } from '../../common/enum/currency.enum';

@Entity({ name: 'financialProfile' })
export class FinancialProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  initialAmount!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentAmount!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentIncome!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentSpent!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monthlySavingsGoal!: number;

  @Column({ default: CurrencyEnum.USD })
  currency!: CurrencyEnum;

  @Column({ nullable: true })
  preferredBank!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => User, (userId) => userId.financialProfile)
  @JoinColumn()
  userId!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.financialProfileId)
  trnsactionId!: Transaction[];
}
