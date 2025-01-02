import type { Brand } from '@/core/lang';

export type Id<TBrand extends string> = Brand<string, TBrand>;