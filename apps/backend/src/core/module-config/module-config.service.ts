import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateModuleConfigDto } from './dto';

@Injectable()
export class ModuleConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * 取得所有模組配置
   */
  async getAllModules() {
    return this.prisma.moduleConfig.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * 取得單一模組配置
   */
  async getModuleByCode(code: string) {
    return this.prisma.moduleConfig.findUnique({
      where: { code },
    });
  }

  /**
   * 更新模組配置（啟用/停用）
   */
  async updateModule(code: string, dto: UpdateModuleConfigDto) {
    return this.prisma.moduleConfig.update({
      where: { code },
      data: dto,
    });
  }

  /**
   * 檢查模組是否啟用
   */
  async isModuleEnabled(code: string): Promise<boolean> {
    const module = await this.prisma.moduleConfig.findUnique({
      where: { code },
    });
    return module?.enabled ?? false;
  }

  /**
   * 初始化預設模組（如果不存在）
   */
  async initializeDefaultModules() {
    const defaultModules = [
      { code: 'dashboard', name: '儀表板', description: '系統總覽與統計' },
      { code: 'stock', name: '庫存管理', description: '庫存查詢與管理' },
      { code: 'purchase', name: '採購管理', description: '採購單與供應商管理' },
      { code: 'order', name: '訂單管理', description: '客戶訂單處理' },
      { code: 'production', name: '生產管理', description: '生產排程與進度' },
      { code: 'finance', name: '財務管理', description: '帳務與報表' },
      { code: 'system', name: '系統設定', description: '帳號、角色、模組管理' },
    ];

    for (const module of defaultModules) {
      const existing = await this.prisma.moduleConfig.findUnique({
        where: { code: module.code },
      });

      if (!existing) {
        await this.prisma.moduleConfig.create({
          data: {
            ...module,
            enabled: true, // 預設啟用
          },
        });
      }
    }

    return this.getAllModules();
  }
}
