import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LineStrategy, StrategyOptions } from 'passport-line';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LineAuthStrategy extends PassportStrategy(LineStrategy, 'line') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      channelID: configService.get<string>('LINE_CHANNEL_ID') || '',
      channelSecret: configService.get<string>('LINE_CHANNEL_SECRET') || '',
      callbackURL: configService.get<string>('LINE_CALLBACK_URL') || '',
      scope: 'profile openid email', // LINE 要求的格式是空格分隔的字串
    } as any); // 暫時使用 any 避免型別問題
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id: lineUserId, displayName, pictureUrl, email } = profile;

    // 查詢是否已有綁定此 LINE 的用戶
    let user = await this.prisma.user.findUnique({
      where: { lineUserId },
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

    // 如果沒有，建立新用戶（或要求綁定現有帳號）
    if (!user) {
      // 這裡有兩種做法：
      // 1. 自動建立新用戶（適合開放註冊）
      // 2. 回傳錯誤，要求先在後台綁定（適合 ERP 系統）

      // 目前採用做法 1：自動建立（之後可以改成做法 2）
      // LINE 登入用戶使用 lineUserId 作為 account
      user = await this.prisma.user.create({
        data: {
          account: `line_${lineUserId}`, // 使用 LINE ID 作為 account
          lineUserId,
          name: displayName,
          email: email || null,
          password: null, // LINE 登入不需要密碼
          isActive: true,
        },
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

    // 整理 roles 和 permissions（加上 null check）
    const roles = user?.roles.map((ur) => ur.role.name) || [];
    const permissions =
      user?.roles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code),
      ) || [];

    const result = {
      id: user.id,
      email: user.email,
      name: user.name,
      lineUserId: user.lineUserId,
      roles,
      permissions: [...new Set(permissions)],
    };

    done(null, result);
  }
}
