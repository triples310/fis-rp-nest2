import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 建立新權限
   */
  async createPermission(dto: CreatePermissionDto) {
    // 檢查 code 是否已存在
    const existing = await this.prisma.permission.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Permission code already exists');
    }

    return this.prisma.permission.create({
      data: dto,
    });
  }

  /**
   * 取得所有權限
   */
  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  }

  /**
   * 取得單一權限
   */
  async getPermissionById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  /**
   * 更新權限
   */
  async updatePermission(id: string, dto: UpdatePermissionDto) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // 如果要更新 code，檢查是否與其他權限衝突
    if (dto.code && dto.code !== permission.code) {
      const existing = await this.prisma.permission.findUnique({
        where: { code: dto.code },
      });
      if (existing) {
        throw new ConflictException('Permission code already exists');
      }
    }

    return this.prisma.permission.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * 刪除權限
   */
  async deletePermission(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // 先刪除所有關聯的 RolePermission
    await this.prisma.rolePermission.deleteMany({
      where: { permissionId: id },
    });

    // 再刪除權限
    return this.prisma.permission.delete({
      where: { id },
    });
  }

  /**
   * 依模組取得權限
   */
  async getPermissionsByModule(module: string) {
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: { code: 'asc' },
    });
  }
}
