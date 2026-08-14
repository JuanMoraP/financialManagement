import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FinancialProfile } from '../../financial-profile/entities/financial-profile.entity';
import { Category } from '../../categories/entities/categories.entity';
import { TransactionEnum } from '../../common/enum/transaction.enum';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  date!: Date;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: TransactionEnum })
  transactionType!: TransactionEnum; //enum

  @Column()
  amount!: number;

  @Column()
  currentBalance!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => FinancialProfile, (finProfile) => finProfile.trnsactionId)
  @JoinColumn()
  financialProfile!: FinancialProfile;

  @ManyToOne(() => Category, (category) => category.transaction)
  @JoinColumn()
  category!: Category;
}
