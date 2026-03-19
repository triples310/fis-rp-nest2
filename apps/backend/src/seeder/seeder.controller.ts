import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeederService } from './seeder.service';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private seederService: SeederService) {}

  /**
   * POST /seeder/seed
   * 初始化所有預設資料（開發/部署時使用）
   */
  @ApiOperation({
    summary: '初始化所有資料',
    description:
      '建立預設的權限、角色、模組和管理員帳號（僅在首次部署或重置時使用）',
  })
  @ApiResponse({ status: 200, description: '初始化成功' })
  @Post('seed')
  async seedAll() {
    await this.seederService.seedAll();
    return {
      message: '資料初始化完成',
      credentials: {
        account: 'admin',
        password: '123456',
      },
    };
  }
}
