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

@Entity({ name: 'financialProfile' })
export class FinancialProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  initialAmount!: number;

  @Column()
  currentAmount!: number;

  @Column()
  currentIncome!: number;

  @Column()
  currentSpent!: number;

  @Column()
  montlySavingsGoal!: number;

  @Column()
  montlySavingsPercentage!: string;

  @Column()
  currency!: string;

  @Column()
  preferredBank!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => User, (userId) => userId.financialProfile)
  @JoinColumn()
  userId!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.financialProfile)
  trnsactionId!: Transaction[];
}
