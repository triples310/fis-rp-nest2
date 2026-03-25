import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true; // 沒有設定 permission 限制，允許通過
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    //if (!user || !user.permissions) {
    //  return false;
    //}
    if (!user) {
      return false;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];
      if (roles.includes('admin') || roles.includes('superadmin')) {
        return true;
    }

    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    if (permissions.length === 0) return false;

    // 檢查 user 是否擁有任一所需權限
    return requiredPermissions.some((permission) =>
      permissions.includes(permission),
    );
  }
}
