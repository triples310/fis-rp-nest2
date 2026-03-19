import { SetMetadata } from '@nestjs/common';

export const CheckModule = (module: string) => SetMetadata('module', module);
