export const env = (key: string, defaultValue: string): string => process.env[key] ?? defaultValue;

export const mandatoryEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  return value;
};

export const integerEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value === undefined ? defaultValue : parseInt(value, 10);
};

export const mandatoryIntegerEnv = (key: string): number => {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  return parseInt(value, 10);
};

export const booleanEnv = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];

  if (value !== undefined && value !== 'true' && value !== 'false') {
    throw new Error(`Variable ${key} must be a boolean`);
  }

  return value === undefined ? defaultValue : value === 'true';
};

export const mandatoryBooleanEnv = (key: string): boolean => {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Variable ${key} not found in environment`);
  }

  if (value !== 'true' && value !== 'false') {
    throw new Error(`Variable ${key} must be a boolean`);
  }

  return value === 'true';
};

export const unionEnv = <T extends string>(key: string, values: T[], defaultValue: T): T => {
  const value = process.env[key];

  if (value !== undefined && !values.includes(value as T)) {
    throw new Error(`Variable ${key} must be one of ${values.join(', ')}`);
  }

  return value === undefined ? defaultValue : value as T;
};