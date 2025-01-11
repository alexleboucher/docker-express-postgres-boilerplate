import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

import type { IEncryptor } from '@/domain/services/security/encryptor.interface';

type EncryptorConfig = {
  saltRounds: number;
};

@injectable()
export class BcryptEncryptor implements IEncryptor {
  constructor(private readonly config: EncryptorConfig) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}