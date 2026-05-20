import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.HOST,
  password: 'admin',
  database: process.env.DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
}
