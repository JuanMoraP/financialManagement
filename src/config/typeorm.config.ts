import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Carga el .env manualmente porque NestJS no está corriendo aquí
config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
});
