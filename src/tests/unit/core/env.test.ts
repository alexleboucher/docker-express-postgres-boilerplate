import {
  env,
  mandatoryEnv,
  integerEnv,
  mandatoryIntegerEnv,
  booleanEnv,
  mandatoryBooleanEnv,
  unionEnv,
} from '@/core/env/env';

describe('Env helpers', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('env', () => {
    const KEY = 'TEST_STRING_ENV';

    test('returns value when defined', () => {
      process.env[KEY] = 'hello';
      expect(env(KEY, 'default')).toBe('hello');
    });

    test('returns default when undefined', () => {
      delete process.env[KEY];
      expect(env(KEY, 'default')).toBe('default');
    });

    test('returns default when empty string', () => {
      process.env[KEY] = '';
      expect(env(KEY, 'default')).toBe('default');
    });
  });

  describe('mandatoryEnv', () => {
    const KEY = 'TEST_MANDATORY_STRING_ENV';

    test('returns value when defined', () => {
      process.env[KEY] = 'present';
      expect(mandatoryEnv(KEY)).toBe('present');
    });

    test('throws when undefined', () => {
      delete process.env[KEY];
      expect(() => mandatoryEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });

    test('throws when empty string', () => {
      process.env[KEY] = '';
      expect(() => mandatoryEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });
  });

  describe('integerEnv', () => {
    const KEY = 'TEST_INT_ENV';

    test('parses integer when defined', () => {
      process.env[KEY] = '42';
      expect(integerEnv(KEY, 5)).toBe(42);
    });

    test('returns default when undefined', () => {
      delete process.env[KEY];
      expect(integerEnv(KEY, 5)).toBe(5);
    });

    test('returns default when empty string', () => {
      process.env[KEY] = '';
      expect(integerEnv(KEY, 5)).toBe(5);
    });

    test('returns NaN when non-numeric string is provided', () => {
      process.env[KEY] = 'abc';
      expect(Number.isNaN(integerEnv(KEY, 5))).toBe(true);
    });
  });

  describe('mandatoryIntegerEnv', () => {
    const KEY = 'TEST_MANDATORY_INT_ENV';

    test('parses integer when defined', () => {
      process.env[KEY] = '10';
      expect(mandatoryIntegerEnv(KEY)).toBe(10);
    });

    test('throws when undefined', () => {
      delete process.env[KEY];
      expect(() => mandatoryIntegerEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });

    test('throws when empty string', () => {
      process.env[KEY] = '';
      expect(() => mandatoryIntegerEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });

    test('returns NaN when non-numeric string is provided', () => {
      process.env[KEY] = 'abc';
      expect(Number.isNaN(mandatoryIntegerEnv(KEY))).toBe(true);
    });
  });

  describe('booleanEnv', () => {
    const KEY = 'TEST_BOOL_ENV';

    test('returns true when value is "true"', () => {
      process.env[KEY] = 'true';
      expect(booleanEnv(KEY, false)).toBe(true);
    });

    test('returns false when value is "false"', () => {
      process.env[KEY] = 'false';
      expect(booleanEnv(KEY, true)).toBe(false);
    });

    test('returns default when undefined', () => {
      delete process.env[KEY];
      expect(booleanEnv(KEY, true)).toBe(true);
    });

    test('returns default when empty string', () => {
      process.env[KEY] = '';
      expect(booleanEnv(KEY, true)).toBe(true);
    });

    test('throws when value is not "true" or "false"', () => {
      process.env[KEY] = 'yes';
      expect(() => booleanEnv(KEY, false)).toThrow(`Variable ${KEY} must be a boolean`);
    });
  });

  describe('mandatoryBooleanEnv', () => {
    const KEY = 'TEST_MANDATORY_BOOL_ENV';

    test('returns true when value is "true"', () => {
      process.env[KEY] = 'true';
      expect(mandatoryBooleanEnv(KEY)).toBe(true);
    });

    test('returns false when value is "false"', () => {
      process.env[KEY] = 'false';
      expect(mandatoryBooleanEnv(KEY)).toBe(false);
    });

    test('throws when undefined', () => {
      delete process.env[KEY];
      expect(() => mandatoryBooleanEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });

    test('throws when empty string', () => {
      process.env[KEY] = '';
      expect(() => mandatoryBooleanEnv(KEY)).toThrow(`Variable ${KEY} not found in environment`);
    });

    test('throws when value is not "true" or "false"', () => {
      process.env[KEY] = 'yes';
      expect(() => mandatoryBooleanEnv(KEY)).toThrow(`Variable ${KEY} must be a boolean`);
    });
  });

  describe('unionEnv', () => {
    const KEY = 'TEST_UNION_ENV';
    const allowed = ['dev', 'prod'];

    test('returns value when it is in allowed values', () => {
      process.env[KEY] = 'prod';
      expect(unionEnv(KEY, allowed, 'dev')).toBe('prod');
    });

    test('returns default when undefined', () => {
      delete process.env[KEY];
      expect(unionEnv(KEY, allowed, 'dev')).toBe('dev');
    });

    test('returns default when empty string', () => {
      process.env[KEY] = '';
      expect(unionEnv(KEY, allowed, 'dev')).toBe('dev');
    });

    test('throws when value not in allowed values', () => {
      process.env[KEY] = 'staging';
      expect(() => unionEnv(KEY, allowed, 'dev')).toThrow(
        `Variable ${KEY} must be one of ${allowed.join(', ')}`,
      );
    });
  });
});


