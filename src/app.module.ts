import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { Message } from './message/message.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ncc.cxf2ypuip1zt.eu-west-3.rds.amazonaws.com/',
      port: 5432,
      username: 'postgres',
      password: 'Kt6DcWAhoJCR',
      database: 'makeorg',
      entities: [Message, User],
      synchronize: true,
    }),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
