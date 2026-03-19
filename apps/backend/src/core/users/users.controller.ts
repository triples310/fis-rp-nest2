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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AssignRolesDto } from './dto';
import { JwtAuthGuard } from '@core/auth/guards';
import { PermissionGuard } from '@shared/guards';
import { RequirePermission } from '@shared/decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * POST /users
   * 建立新使用者（需要 user.create 權限）
   */
  @ApiOperation({
    summary: '建立新員工',
    description: '管理員建立新的員工帳號（需要 user.create 權限）',
  })
  @ApiResponse({ status: 201, description: '建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 409, description: 'Email 已存在' })
  @RequirePermission('user.create')
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  /**
   * GET /users
   * 取得所有使用者（需要 user.view 權限）
   */
  @ApiOperation({
    summary: '取得所有員工',
    description: '查看所有員工列表（需要 user.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得員工列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @RequirePermission('user.view')
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * GET /users/:id
   * 取得單一使用者（需要 user.view 權限）
   */
  @ApiOperation({
    summary: '取得單一員工',
    description: '查看特定員工的詳細資料（需要 user.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得員工資料' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '員工不存在' })
  @RequirePermission('user.view')
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  /**
   * PATCH /users/:id
   * 更新使用者（需要 user.edit 權限）
   */
  @ApiOperation({
    summary: '更新員工資料',
    description: '編輯員工資料（需要 user.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '員工不存在' })
  @RequirePermission('user.edit')
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  /**
   * DELETE /users/:id
   * 停用使用者（需要 user.delete 權限）
   */
  @ApiOperation({
    summary: '停用員工',
    description: '停用員工帳號（軟刪除，需要 user.delete 權限）',
  })
  @ApiResponse({ status: 200, description: '停用成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '員工不存在' })
  @RequirePermission('user.delete')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  /**
   * POST /users/:id/roles
   * 分配角色給使用者（需要 user.edit 權限）
   */
  @ApiOperation({
    summary: '分配角色',
    description: '為員工分配角色（需要 user.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '員工不存在' })
  @RequirePermission('user.edit')
  @Post(':id/roles')
  async assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    return this.usersService.assignRoles(id, dto);
  }

  /**
   * DELETE /users/:userId/roles/:roleId
   * 移除使用者的角色（需要 user.edit 權限）
   */
  @ApiOperation({
    summary: '移除角色',
    description: '移除員工的特定角色（需要 user.edit 權限）',
  })
  @ApiResponse({ status: 200, description: '移除成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '員工不存在' })
  @RequirePermission('user.edit')
  @Delete(':userId/roles/:roleId')
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.usersService.removeRole(userId, roleId);
  }
}
