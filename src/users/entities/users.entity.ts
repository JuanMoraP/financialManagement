import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FinancialProfile } from '../../financial-profile/entities/financial-profile.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  birthdate!: Date;

  @Column()
  country!: string;

  @Column()
  phone!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(
    () => FinancialProfile,
    (financialProfile) => financialProfile.userId,
    { cascade: true },
  )
  financialProfile!: FinancialProfile;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.userId)
  refreshToken!: RefreshToken;
}
