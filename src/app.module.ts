import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FinancialProfileModule } from './financial-profile/financial-profile.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesService } from './categories/categories.service';

@Module({
  imports: [
    // Carga el .env y lo deja disponible para toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Configura la conexión a la DB
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        ssl:
          config.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    UsersModule,
    FinancialProfileModule,
    TransactionModule,
    CategoriesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly categoriesService: CategoriesService) {}
  async onApplicationBootstrap() {
    try {
      await this.categoriesService.addCategories();
      this.logger.log('Categorias cargadas con éxito');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error al cargar las categorías', error.stack);
      } else {
        this.logger.error(
          'Error al cargar las categorias (tipo desconocido',
          String(error),
        );
      }
      throw error;
    }
  }
}
