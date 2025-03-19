export class Result<TValue, TFailure extends { error: Error }> {
  failure?: TFailure;
  value?: TValue;

  constructor({ failure, value }: { failure?: TFailure; value?: TValue }) {
    if ((failure && value) || (!failure && !value)) {
      throw new Error('Invalid Result: Must have either failure or value, but not both.');
    }

    this.failure = failure;
    this.value = value;
  }

  isSuccess(): this is Success<TValue> {
    return this.value !== undefined;
  }

  isFailure(): this is Failure<TFailure> {
    return this.failure !== undefined;
  }
}

export class Success<T> extends Result<T, never> {
  declare value: T;
  constructor(value: T) {
    super({ value });
  }
}

export class Failure<TFailure extends { error: Error }> extends Result<never, TFailure> {
  declare failure: TFailure;
  constructor(failure: TFailure) {
    super({ failure });
  }
}