import { UserSchema } from '../entities/user.entity';
import { IUserRepository } from '@/core/repositories/user.repository';
import { AbstractRepository } from '../../base/base.repository';
import { In } from 'typeorm';

export class UserRepository extends AbstractRepository<UserSchema> implements IUserRepository {
  checkAvailableEmailsAndPhones(emails: string[], phones: string[]): Promise<boolean> {
    return this.repository.existsBy([{ email: In(emails) }, { phoneNumber: In(phones) }]);
  }
}
