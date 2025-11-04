import { config } from 'dotenv';

config();

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined && value !== '';
}

export const env = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  return isDefined(value) ? value : defaultValue;
};

export const mandatoryEnv = (key: string): string => {
  const value = process.env[key];
  if (!isDefined(value)) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  return value;
};

export const integerEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return isDefined(value) ? parseInt(value, 10) : defaultValue;
};

export const mandatoryIntegerEnv = (key: string): number => {
  const value = process.env[key];

  if (!isDefined(value)) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  return parseInt(value, 10);
};

export const booleanEnv = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];

  const isDefinedValue = isDefined(value);

  if (isDefinedValue && value !== 'true' && value !== 'false') {
    throw new Error(`Variable ${key} must be a boolean`);
  }

  return isDefinedValue ? value === 'true' : defaultValue;
};

export const mandatoryBooleanEnv = (key: string): boolean => {
  const value = process.env[key];

  if (!isDefined(value)) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  if (value !== 'true' && value !== 'false') {
    throw new Error(`Variable ${key} must be a boolean`);
  }

  return value === 'true';
};

export const unionEnv = <T extends string>(key: string, values: T[], defaultValue: T): T => {
  const value = process.env[key];

  const isDefinedValue = isDefined(value);

  if (isDefinedValue && !values.includes(value as T)) {
    throw new Error(`Variable ${key} must be one of ${values.join(', ')}`);
  }

  return isDefinedValue ? value as T : defaultValue;
};