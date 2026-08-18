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

  @Column({ default: 0 })
  initialAmount!: number;

  @Column({ default: 0 })
  currentAmount!: number;

  @Column({ default: 0 })
  currentIncome!: number;

  @Column({ default: 0 })
  currentSpent!: number;

  @Column({ default: 0 })
  montlySavingsGoal!: number;

  @Column({ default: 0 })
  montlySavingsPercentage!: string;

  @Column({ nullable: true })
  currency!: string;

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
