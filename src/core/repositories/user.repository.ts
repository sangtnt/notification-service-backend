import { IRepository } from '../base/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository extends IRepository<UserEntity> {
  /**
   * Check if the provided emails and phones are available.
   * @param emails - An array of email addresses to check.
   * @param phones - An array of phone numbers to check.
   * @returns A promise that resolves to a boolean indicating whether the emails and phones are available.
   */
  checkAvailableEmailsAndPhones(emails: string[], phones: string[]): Promise<boolean>;
}
