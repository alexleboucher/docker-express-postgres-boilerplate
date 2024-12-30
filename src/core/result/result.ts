export class Result<T> {
  error?: Error;
  value?: T;

  constructor({ error, value }: { error?: Error; value?: T }) {
    if ((error && value) || (!error && !value)) {
      throw new Error('Invalid Result: Must have either error or value, but not both.');
    }

    this.error = error;
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return this.value !== undefined;
  }

  isFailure(): this is Failure {
    return this.error !== undefined;
  }
}

export class Success<T> extends Result<T> {
  value!: T;
  constructor(value: T) {
    super({ value });
  }
}

export class Failure extends Result<never> {
  error!: Error;
  constructor(error: Error) {
    super({ error });
  }
}