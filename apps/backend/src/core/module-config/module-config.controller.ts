import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ModuleConfigService } from './module-config.service';
import { UpdateModuleConfigDto } from './dto';
import { JwtAuthGuard } from '@core/auth/guards';
import { PermissionGuard } from '@shared/guards';
import { RequirePermission } from '@shared/decorators';

@ApiTags('Modules')
@ApiBearerAuth('JWT-auth')
@Controller('modules')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ModuleConfigController {
  constructor(private moduleConfigService: ModuleConfigService) {}

  /**
   * GET /modules
   * 取得所有模組配置
   */
  @ApiOperation({
    summary: '取得所有模組',
    description: '查看系統所有模組的啟用狀態',
  })
  @ApiResponse({ status: 200, description: '成功取得模組列表' })
  @Get()
  async getAllModules() {
    return this.moduleConfigService.getAllModules();
  }

  /**
   * GET /modules/:code
   * 取得單一模組配置
   */
  @ApiOperation({
    summary: '取得單一模組',
    description: '查看特定模組的詳細設定',
  })
  @ApiResponse({ status: 200, description: '成功取得模組設定' })
  @ApiResponse({ status: 404, description: '模組不存在' })
  @Get(':code')
  async getModule(@Param('code') code: string) {
    return this.moduleConfigService.getModuleByCode(code);
  }

  /**
   * PATCH /modules/:code
   * 更新模組配置（需要 module.manage 權限）
   */
  @ApiOperation({
    summary: '更新模組',
    description: '更新模組設定，例如啟用/停用（需要 module.manage 權限）',
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '模組不存在' })
  @RequirePermission('module.manage')
  @Patch(':code')
  async updateModule(
    @Param('code') code: string,
    @Body() dto: UpdateModuleConfigDto,
  ) {
    return this.moduleConfigService.updateModule(code, dto);
  }

  /**
   * POST /modules/initialize
   * 初始化預設模組（僅開發/部署時使用）
   */
  @ApiOperation({
    summary: '初始化預設模組',
    description:
      '建立系統預設的模組設定（dashboard, stock, purchase, order, production, finance, system）',
  })
  @ApiResponse({ status: 200, description: '初始化成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @RequirePermission('module.manage')
  @Post('initialize')
  async initializeModules() {
    return this.moduleConfigService.initializeDefaultModules();
  }
}
