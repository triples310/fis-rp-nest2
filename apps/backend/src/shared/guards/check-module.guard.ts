import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleConfigService } from '@core/module-config/module-config.service';

@Injectable()
export class CheckModuleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleConfigService: ModuleConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.get<string>(
      'module',
      context.getHandler(),
    );

    if (!requiredModule) {
      return true; // 沒有設定模組限制，允許通過
    }

    const isEnabled =
      await this.moduleConfigService.isModuleEnabled(requiredModule);

    if (!isEnabled) {
      throw new ForbiddenException(
        `Module "${requiredModule}" is currently disabled`,
      );
    }

    return true;
  }
}
