import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { JwtAuthGuard } from '@core/auth/guards';
import { PermissionGuard } from '@shared/guards';
import { RequirePermission } from '@shared/decorators';

@ApiTags('Permissions')
@ApiBearerAuth('JWT-auth')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  /**
   * POST /permissions
   * 建立新權限（需要 permission.create 權限）
   */
  @ApiOperation({
    summary: '建立新權限',
    description: '建立系統權限（需要 permission.create 權限）',
  })
  @ApiResponse({ status: 201, description: '建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 409, description: '權限代碼已存在' })
  @RequirePermission('permission.create')
  @Post()
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.createPermission(dto);
  }

  /**
   * GET /permissions
   * 取得所有權限（需要 permission.view 權限）
   */
  @ApiOperation({
    summary: '取得所有權限',
    description: '查看所有系統權限（需要 permission.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得權限列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @RequirePermission('permission.view')
  @Get()
  async getAllPermissions(@Query('module') module?: string) {
    if (module) {
      return this.permissionsService.getPermissionsByModule(module);
    }
    return this.permissionsService.getAllPermissions();
  }

  /**
   * GET /permissions/:id
   * 取得單一權限（需要 permission.view 權限）
   */
  @ApiOperation({
    summary: '取得單一權限',
    description: '查看特定權限的詳細資料（需要 permission.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得權限資料' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '權限不存在' })
  @RequirePermission('permission.view')
  @Get(':id')
  async getPermission(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  /**
   * PATCH /permissions/:id
   * 更新權限（需要 permission.edit 權限）
   */
  @ApiOperation({
    summary: '更新權限',
    description: '編輯權限資料（需要 permission.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '權限不存在' })
  @ApiResponse({ status: 409, description: '權限代碼已存在' })
  @RequirePermission('permission.edit')
  @Patch(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updatePermission(id, dto);
  }

  /**
   * DELETE /permissions/:id
   * 刪除權限（需要 permission.delete 權限）
   */
  @ApiOperation({
    summary: '刪除權限',
    description: '刪除系統權限（需要 permission.delete 權限）',
  })
  @ApiResponse({ status: 200, description: '刪除成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '權限不存在' })
  @RequirePermission('permission.delete')
  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
