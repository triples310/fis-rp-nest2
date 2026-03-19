import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 建立新角色
   */
  async createRole(dto: CreateRoleDto) {
    // 檢查 name 是否已存在
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role name already exists');
    }

    return this.prisma.role.create({
      data: {
        name: dto.name,
        displayName: dto.displayName,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * 取得所有角色
   */
  async getAllRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 取得單一角色
   */
  async getRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  /**
   * 更新角色
   */
  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 如果要更新 name，檢查是否與其他角色衝突
    if (dto.name && dto.name !== role.name) {
      const existing = await this.prisma.role.findUnique({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('Role name already exists');
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: dto,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * 刪除角色（軟刪除 - 改為停用）
   */
  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.prisma.role.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * 為角色分配權限
   */
  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 先刪除所有現有權限
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // 新增新的權限
    await this.prisma.rolePermission.createMany({
      data: dto.permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
    });

    return this.getRoleById(roleId);
  }

  /**
   * 移除角色的權限
   */
  async removePermission(roleId: string, permissionId: string) {
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });

    return this.getRoleById(roleId);
  }
}
