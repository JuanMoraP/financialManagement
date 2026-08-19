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

  @Column({ default: 0 })
  initialAmount!: number;

  @Column({ default: 0 })
  currentAmount!: number;

  @Column({ default: 0 })
  currentIncome!: number;

  @Column({ default: 0 })
  currentSpent!: number;

  @Column({ default: 0 })
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

  @OneToMany(() => Transaction, (transaction) => transaction.financialProfile)
  trnsactionId!: Transaction[];
}
