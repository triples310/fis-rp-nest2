import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto';
import { JwtAuthGuard } from '@core/auth/guards';
import { PermissionGuard } from '@shared/guards';
import { RequirePermission } from '@shared/decorators';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  /**
   * POST /roles
   * 建立新角色（需要 role.create 權限）
   */
  @ApiOperation({
    summary: '建立新角色',
    description: '建立系統角色（需要 role.create 權限）',
  })
  @ApiResponse({ status: 201, description: '建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 409, description: '角色名稱已存在' })
  @RequirePermission('role.create')
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  /**
   * GET /roles
   * 取得所有角色（需要 role.view 權限）
   */
  @ApiOperation({
    summary: '取得所有角色',
    description: '查看所有系統角色（需要 role.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得角色列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @RequirePermission('role.view')
  @Get()
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  /**
   * GET /roles/:id
   * 取得單一角色（需要 role.view 權限）
   */
  @ApiOperation({
    summary: '取得單一角色',
    description: '查看特定角色的詳細資料（需要 role.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得角色資料' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @RequirePermission('role.view')
  @Get(':id')
  async getRole(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  /**
   * PATCH /roles/:id
   * 更新角色（需要 role.edit 權限）
   */
  @ApiOperation({
    summary: '更新角色',
    description: '編輯角色資料（需要 role.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 409, description: '角色名稱已存在' })
  @RequirePermission('role.edit')
  @Patch(':id')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  /**
   * DELETE /roles/:id
   * 刪除角色（需要 role.delete 權限）
   */
  @ApiOperation({
    summary: '刪除角色',
    description: '停用角色（軟刪除，需要 role.delete 權限）',
  })
  @ApiResponse({ status: 200, description: '刪除成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @RequirePermission('role.delete')
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  /**
   * POST /roles/:id/permissions
   * 為角色分配權限（需要 role.edit 權限）
   */
  @ApiOperation({
    summary: '分配權限',
    description: '為角色分配權限（需要 role.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @RequirePermission('role.edit')
  @Post(':id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }

  /**
   * DELETE /roles/:roleId/permissions/:permissionId
   * 移除角色的權限（需要 role.edit 權限）
   */
  @ApiOperation({
    summary: '移除權限',
    description: '移除角色的特定權限（需要 role.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '移除成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @RequirePermission('role.edit')
  @Delete(':roleId/permissions/:permissionId')
  async removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermission(roleId, permissionId);
  }
}
