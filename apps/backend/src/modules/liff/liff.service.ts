import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LiffService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * 驗證 LIFF Access Token，取得 LINE User Profile
   */
  async verifyLiffToken(liffToken: string) {
    try {
      const response = await axios.get('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${liffToken}`,
        },
      });

      const { userId, displayName, pictureUrl } = response.data;

      // 查詢是否已綁定此 LINE 的用戶
      const user = await this.prisma.user.findUnique({
        where: { lineUserId: userId },
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
        return {
          success: false,
          message: '此 LINE 帳號尚未綁定員工帳號',
        };
      }

      const roles = user.roles.map((ur) => ur.role.name);
      const permissions = user.roles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code),
      );

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          lineUserId: user.lineUserId,
          roles,
          permissions: [...new Set(permissions)],
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'LIFF Token 驗證失敗',
      };
    }
  }

  /**
   * LIFF - 查看庫存（示例）
   */
  async getStockForLiff(lineUserId: string) {
    // 驗證用戶權限
    const user = await this.prisma.user.findUnique({
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

    if (!user) {
      throw new Error('用戶不存在');
    }

    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.code),
    );

    if (!permissions.includes('liff.stock.view')) {
      throw new Error('無權限查看庫存');
    }

    // TODO: 實際查詢庫存資料
    // const stocks = await this.prisma.stock.findMany({ ... });

    return {
      message: '庫存資料（示例）',
      data: [
        { sku: 'SKU001', name: '產品A', quantity: 100 },
        { sku: 'SKU002', name: '產品B', quantity: 50 },
      ],
    };
  }

  /**
   * LIFF - 查看訂單（示例）
   */
  async getOrdersForLiff(lineUserId: string) {
    const user = await this.prisma.user.findUnique({
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

    if (!user) {
      throw new Error('用戶不存在');
    }

    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.code),
    );

    if (!permissions.includes('liff.order.view')) {
      throw new Error('無權限查看訂單');
    }

    // TODO: 實際查詢訂單資料
    // const orders = await this.prisma.order.findMany({ ... });

    return {
      message: '訂單資料（示例）',
      data: [
        {
          orderId: 'ORD001',
          customerName: '客戶A',
          total: 10000,
          status: '已出貨',
        },
        {
          orderId: 'ORD002',
          customerName: '客戶B',
          total: 5000,
          status: '處理中',
        },
      ],
    };
  }
}
