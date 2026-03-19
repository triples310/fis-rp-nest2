import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, AssignRolesDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 建立新使用者（管理員使用）
   */
  async createUser(dto: CreateUserDto) {
    // 檢查 account 是否已存在
    const existingAccount = await this.prisma.user.findUnique({
      where: { account: dto.account },
    });

    if (existingAccount) {
      throw new ConflictException('Account already exists');
    }

    // 檢查 email 是否已存在（如果有提供）
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 建立使用者
    const user = await this.prisma.user.create({
      data: {
        account: dto.account,
        email: dto.email || null,
        password: hashedPassword,
        name: dto.name,
        description: dto.description || null,
        isActive: dto.isActive ?? true,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 取得所有使用者
   */
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(({ password, ...user }) => user);
  }

  /**
   * 取得單一使用者
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 更新使用者
   */
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...dto };

    // 如果有更新密碼，需要加密
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const { password: _, ...result } = updated;
    return result;
  }

  /**
   * 停用/啟用使用者
   */
  async toggleUserStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
    });

    const { password: _, ...result } = updated;
    return result;
  }

  /**
   * 刪除使用者（軟刪除 - 改為停用）
   */
  async deleteUser(id: string) {
    return this.toggleUserStatus(id, false);
  }

  /**
   * 分配角色給使用者
   */
  async assignRoles(userId: string, dto: AssignRolesDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 先刪除所有現有角色
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // 新增新的角色
    await this.prisma.userRole.createMany({
      data: dto.roleIds.map((roleId) => ({
        userId,
        roleId,
      })),
    });

    return this.getUserById(userId);
  }

  /**
   * 移除使用者的角色
   */
  async removeRole(userId: string, roleId: string) {
    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });

    return this.getUserById(userId);
  }
}
