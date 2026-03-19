import { Module } from '@nestjs/common';
import { LiffService } from './liff.service';
import { LiffController } from './liff.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LiffController],
  providers: [LiffService],
  exports: [LiffService],
})
export class LiffModule {}
