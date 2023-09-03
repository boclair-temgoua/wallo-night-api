import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPassword } from '../../models/ResetPassword';
import { Repository } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { generateLongUUID } from '../../app/utils/commons';
import {
  CreateResetPasswordOptions,
  GetOneResetPasswordSelections,
  UpdateResetPasswordOptions,
  UpdateResetPasswordSelections,
} from './reset-passwords.type';

@Injectable()
export class ResetPasswordsService {
  constructor(
    @InjectRepository(ResetPassword)
    private driver: Repository<ResetPassword>,
  ) {}

  async findOneBy(
    selections: GetOneResetPasswordSelections,
  ): Promise<ResetPassword> {
    const { token } = selections;
    let query = this.driver
      .createQueryBuilder('resetPw')
      .where('resetPw.deletedAt IS NULL');

    if (token) {
      query = query.andWhere('resetPw.token = :token', { token });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Reset Password not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one ResetPassword to the database. */
  async createOne(options: CreateResetPasswordOptions): Promise<ResetPassword> {
    const { email, accessToken } = options;

    const resetPassword = new ResetPassword();
    resetPassword.email = email;
    resetPassword.accessToken = accessToken;
    resetPassword.token = generateLongUUID(50);

    const query = this.driver.save(resetPassword);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ResetPassword to the database. */
  async updateOne(
    selections: UpdateResetPasswordSelections,
    options: UpdateResetPasswordOptions,
  ): Promise<ResetPassword> {
    const { token } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('resetPassword');

    if (token) {
      findQuery = findQuery.where('resetPassword.token = :token', { token });
    }

    const [errorFind, resetPassword] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    resetPassword.deletedAt = deletedAt;

    const query = this.driver.save(resetPassword);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
