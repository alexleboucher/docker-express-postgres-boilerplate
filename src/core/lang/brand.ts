declare const __brand: unique symbol;

/**
 * A branded type is a technique used to create distinct types that share the same underlying structure but are treated
 * as incompatible by the type system.
 */
export type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };