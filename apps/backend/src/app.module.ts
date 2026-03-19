import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from '@core/auth/auth.module';
import { UsersModule } from '@core/users/users.module';
import { RolesModule } from '@core/roles/roles.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { ModuleConfigModule } from '@core/module-config/module-config.module';
import { LiffModule } from '@modules/liff/liff.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 讓 ConfigService 可在全專案使用
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ModuleConfigModule,
    LiffModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
