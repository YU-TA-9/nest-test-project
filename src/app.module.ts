import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          // sqlite利用
          type: 'sqlite',
          database: config.get<string>('DATABASE_NAME'),
          entries: [],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // テストしやすいようにmain.tsから分離
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // middleware利用時に記載
}
