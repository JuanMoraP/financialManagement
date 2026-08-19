import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @CreateDateColumn()
  date!: Date;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: TransactionEnum })
  transactionType!: TransactionEnum; //enum

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @ManyToOne(() => FinancialProfile, (finProfile) => finProfile.trnsactionId)
  @JoinColumn()
  financialProfileId!: FinancialProfile;

  @ManyToOne(() => Category, (category) => category.transaction)
  @JoinColumn()
  categoryId!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
