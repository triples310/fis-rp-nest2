import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeederService {
  constructor(private prisma: PrismaService) {}

  /**
   * 初始化所有預設資料
   */
  async seedAll() {
    console.log('🌱 開始初始化資料...');

    await this.seedPermissions();
    await this.seedRoles();
    await this.seedModules();
    await this.seedAdminUser();

    console.log('✅ 所有資料初始化完成！');
  }

  /**
   * 初始化權限
   */
  async seedPermissions() {
    console.log('📝 初始化權限...');

    const permissions = [
      // 使用者管理
      {
        code: 'user.view',
        name: '查看使用者',
        module: 'user',
        type: 'action',
        description: '查看使用者列表與詳細資料',
      },
      {
        code: 'user.create',
        name: '建立使用者',
        module: 'user',
        type: 'action',
        description: '建立新的使用者帳號',
      },
      {
        code: 'user.edit',
        name: '編輯使用者',
        module: 'user',
        type: 'action',
        description: '編輯使用者資料與角色',
      },
      {
        code: 'user.delete',
        name: '刪除使用者',
        module: 'user',
        type: 'action',
        description: '停用或刪除使用者',
      },

      // 角色管理
      {
        code: 'role.view',
        name: '查看角色',
        module: 'role',
        type: 'action',
        description: '查看角色列表與詳細資料',
      },
      {
        code: 'role.create',
        name: '建立角色',
        module: 'role',
        type: 'action',
        description: '建立新的角色',
      },
      {
        code: 'role.edit',
        name: '編輯角色',
        module: 'role',
        type: 'action',
        description: '編輯角色資料與權限',
      },
      {
        code: 'role.delete',
        name: '刪除角色',
        module: 'role',
        type: 'action',
        description: '刪除角色',
      },

      // 權限管理
      {
        code: 'permission.view',
        name: '查看權限',
        module: 'permission',
        type: 'action',
        description: '查看權限列表',
      },
      {
        code: 'permission.create',
        name: '建立權限',
        module: 'permission',
        type: 'action',
        description: '建立新的權限',
      },
      {
        code: 'permission.edit',
        name: '編輯權限',
        module: 'permission',
        type: 'action',
        description: '編輯權限資料',
      },
      {
        code: 'permission.delete',
        name: '刪除權限',
        module: 'permission',
        type: 'action',
        description: '刪除權限',
      },

      // 模組管理
      {
        code: 'module.view',
        name: '查看模組',
        module: 'module',
        type: 'action',
        description: '查看模組列表與狀態',
      },
      {
        code: 'module.manage',
        name: '管理模組',
        module: 'module',
        type: 'action',
        description: '啟用/停用模組',
      },

      // LIFF
      {
        code: 'liff.stock.view',
        name: 'LIFF 查看庫存',
        module: 'liff',
        type: 'action',
        description: 'LINE LIFF 查看庫存',
      },
      {
        code: 'liff.order.view',
        name: 'LIFF 查看訂單',
        module: 'liff',
        type: 'action',
        description: 'LINE LIFF 查看訂單',
      },

      // 庫存管理（未來擴展）
      {
        code: 'stock.view',
        name: '查看庫存',
        module: 'stock',
        type: 'action',
        description: '查看庫存資料',
      },
      {
        code: 'stock.edit',
        name: '編輯庫存',
        module: 'stock',
        type: 'action',
        description: '編輯庫存資料',
      },

      {
        code: 'stock.create',
        name: '建立商品',
        module: 'stock',
        type: 'action',
        description: '建立新商品',
      },
      {
        code: 'stock.delete',
        name: '刪除商品',
        module: 'stock',
        type: 'action',
        description: '刪除商品',
      },

      // 採購管理（未來擴展）
      {
        code: 'purchase.view',
        name: '查看採購',
        module: 'purchase',
        type: 'action',
        description: '查看採購單',
      },
      {
        code: 'purchase.create',
        name: '建立採購',
        module: 'purchase',
        type: 'action',
        description: '建立採購單',
      },
      {
        code: 'purchase.edit',
        name: '編輯採購',
        module: 'purchase',
        type: 'action',
        description: '編輯採購單',
      },

      // 訂單管理（未來擴展）
      {
        code: 'order.view',
        name: '查看訂單',
        module: 'order',
        type: 'action',
        description: '查看訂單資料',
      },
      {
        code: 'order.create',
        name: '建立訂單',
        module: 'order',
        type: 'action',
        description: '建立新訂單',
      },
      {
        code: 'order.edit',
        name: '編輯訂單',
        module: 'order',
        type: 'action',
        description: '編輯訂單資料',
      },
    ];

    for (const perm of permissions) {
      const existing = await this.prisma.permission.findUnique({
        where: { code: perm.code },
      });

      if (!existing) {
        await this.prisma.permission.create({ data: perm });
        console.log(`  ✓ 建立權限: ${perm.code}`);
      }
    }

    console.log('✅ 權限初始化完成');
  }

  /**
   * 初始化角色
   */
  async seedRoles() {
    console.log('📝 初始化角色...');

    // 1. 建立 admin 角色（所有權限）
    let adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: {
          name: 'admin',
          displayName: '系統管理員',
          description: '擁有所有權限的最高管理員',
          isActive: true,
        },
      });
      console.log('  ✓ 建立角色: admin');

      // 為 admin 分配所有權限
      const allPermissions = await this.prisma.permission.findMany();
      if (allPermissions.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: allPermissions.map((perm) => ({
            roleId: adminRole!.id,
            permissionId: perm.id,
          })),
        });
        console.log(`  ✓ 為 admin 分配 ${allPermissions.length} 個權限`);
      }
    } else if (adminRole) {
      // 確保 admin 已經有所有權限
      const allPermissions = await this.prisma.permission.findMany();
      const existingPermissions = await this.prisma.rolePermission.findMany({
        where: { roleId: adminRole.id },
      });
      const missingPermissions = allPermissions.filter(
        (perm) =>
          !existingPermissions.some((ep) => ep.permissionId === perm.id),
      );
      if (missingPermissions.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: missingPermissions.map((perm) => ({
            roleId: adminRole!.id,
            permissionId: perm.id,
          })),
        });
        console.log(`  ✓ 為 admin 補充 ${missingPermissions.length} 個權限`);
      }
    }

    // 2. 建立 staff 角色（一般員工）
    let staffRole = await this.prisma.role.findUnique({
      where: { name: 'staff' },
    });

    if (!staffRole) {
      staffRole = await this.prisma.role.create({
        data: {
          name: 'staff',
          displayName: '一般員工',
          description: '一般員工，可查看基本資料',
          isActive: true,
        },
      });
      console.log('  ✓ 建立角色: staff');

      // 為 staff 分配基本權限
      const staffPermissions = await this.prisma.permission.findMany({
        where: {
          code: {
            in: [
              'module.view',
              'liff.stock.view',
              'liff.order.view',
              'stock.view',
              'order.view',
            ],
          },
        },
      });
      if (staffPermissions.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: staffPermissions.map((perm) => ({
            roleId: staffRole!.id,
            permissionId: perm.id,
          })),
        });
        console.log(`  ✓ 為 staff 分配 ${staffPermissions.length} 個權限`);
      }
    }

    // 3. 建立 warehouse 角色（倉管）
    let warehouseRole = await this.prisma.role.findUnique({
      where: { name: 'warehouse' },
    });

    if (!warehouseRole) {
      warehouseRole = await this.prisma.role.create({
        data: {
          name: 'warehouse',
          displayName: '倉管人員',
          description: '倉庫管理人員，負責庫存管理',
          isActive: true,
        },
      });
      console.log('  ✓ 建立角色: warehouse');

      // 為 warehouse 分配庫存相關權限
      const warehousePermissions = await this.prisma.permission.findMany({
        where: {
          code: {
            in: ['stock.view', 'stock.edit', 'stock.create', 'stock.delete','module.view'],
          },
        },
      });
      if (warehousePermissions.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: warehousePermissions.map((perm) => ({
            roleId: warehouseRole!.id,
            permissionId: perm.id,
          })),
        });
        console.log(
          `  ✓ 為 warehouse 分配 ${warehousePermissions.length} 個權限`,
        );
      }
    }

    console.log('✅ 角色初始化完成');
  }

  /**
   * 初始化模組
   */
  async seedModules() {
    console.log('📝 初始化模組...');

    const modules = [
      {
        code: 'dashboard',
        name: '儀表板',
        description: '系統總覽與統計',
        sortOrder: 0,
      },
      {
        code: 'stock',
        name: '庫存管理',
        description: '庫存查詢與管理',
        sortOrder: 1,
      },
      {
        code: 'purchase',
        name: '採購管理',
        description: '採購單與供應商管理',
        sortOrder: 2,
      },
      {
        code: 'order',
        name: '訂單管理',
        description: '客戶訂單處理',
        sortOrder: 3,
      },
      {
        code: 'production',
        name: '生產管理',
        description: '生產排程與進度',
        sortOrder: 4,
      },
      {
        code: 'finance',
        name: '財務管理',
        description: '帳務與報表',
        sortOrder: 5,
      },
      {
        code: 'system',
        name: '系統設定',
        description: '帳號、角色、模組管理',
        sortOrder: 6,
      },
    ];

    for (const module of modules) {
      const existing = await this.prisma.moduleConfig.findUnique({
        where: { code: module.code },
      });

      if (!existing) {
        await this.prisma.moduleConfig.create({
          data: {
            ...module,
            enabled: true,
          },
        });
        console.log(`  ✓ 建立模組: ${module.code}`);
      }
    }

    console.log('✅ 模組初始化完成');
  }

  /**
   * 建立預設管理員帳號
   */
  async seedAdminUser() {
    console.log('📝 初始化管理員帳號...');

    const adminAccount = 'admin';
    let adminUser = await this.prisma.user.findUnique({
      where: { account: adminAccount },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);

      adminUser = await this.prisma.user.create({
        data: {
          account: adminAccount,
          email: null,
          password: hashedPassword,
          name: '系統管理員',
          description: '預設管理員帳號',
          isActive: true,
        },
      });
      console.log(`  ✓ 建立管理員: ${adminAccount}`);
      console.log(`  ℹ️  預設密碼: 123456`);
    }

    // 為管理員分配 admin 角色
    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (adminRole) {
      const existingUserRole = await this.prisma.userRole.findFirst({
        where: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      });

      if (!existingUserRole) {
        await this.prisma.userRole.create({
          data: {
            userId: adminUser.id,
            roleId: adminRole.id,
          },
        });
        console.log('  ✓ 為管理員分配 admin 角色');
      }
    }

    console.log('✅ 管理員帳號初始化完成');
  }
}
