import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { User } from '../../users/entities/users.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transaction!: Transaction[];

  @ManyToOne(() => User, (user) => user.category, { nullable: true })
  @JoinColumn()
  user!: User;
}
