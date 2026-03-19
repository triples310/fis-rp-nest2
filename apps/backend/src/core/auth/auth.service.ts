import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 驗證使用者帳密（支援 account 或 email 登入）
   */
  async validateUser(username: string, password: string): Promise<any> {
    // 嘗試用 account 查找
    let user = await this.prisma.user.findUnique({
      where: { account: username },
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

    // 如果找不到，再嘗試用 email 查找
    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: username },
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
    }

    if (!user || !user.password) {
      // user 不存在或密碼為 null（可能是 LINE 登入用戶）
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // 整理 roles 和 permissions
    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.code),
    );

    const { password: _, ...result } = user;
    return {
      ...result,
      roles,
      permissions: [...new Set(permissions)],
    };
  }

  /**
   * 登入（產生 JWT）
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || user.account, // 如果沒有 email 就用 account
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        account: user.account,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }

  /**
   * 取得當前使用者資訊（含 roles & permissions）
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new UnauthorizedException('User not found');
    }

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.code),
    );

    const { password: _, ...result } = user;
    return {
      ...result,
      roles,
      permissions: [...new Set(permissions)],
    };
  }

  /**
   * LINE Login 處理（由 LineStrategy 回調）
   */
  async lineLogin(user: any) {
    // user 已包含 id, email, name, roles, permissions
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
