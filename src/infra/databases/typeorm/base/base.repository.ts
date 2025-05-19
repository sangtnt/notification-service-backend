import { IRepository } from '@/core/base/repositories/base.repository';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { IFindAllOptions } from '@/shared/interfaces/find-all-options';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { BaseEntity } from '@/shared/interfaces/base.entity';

export abstract class AbstractRepository<TEntity extends BaseEntity>
  implements IRepository<TEntity>
{
  protected readonly repository: Repository<TEntity>;
  constructor(repository: Repository<TEntity>) {
    this.repository = repository;
  }

  createInstance(): TEntity {
    return this.repository.create();
  }

  async save(item: TEntity): Promise<string> {
    return (await this.repository.save(item)).id;
  }

  async saveMany(items: TEntity[]): Promise<string[]> {
    return (await this.repository.save(items, { transaction: true })).map((item) => item.id);
  }

  findById(id: string): Promise<TEntity | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<TEntity>);
  }

  findByIds(ids: string[]): Promise<TEntity[] | null> {
    return this.repository.findBy({ id: In(ids) } as FindOptionsWhere<TEntity>);
  }

  findMany(options?: IFindAllOptions<TEntity>): Promise<TEntity[]> {
    return this.repository.find(options);
  }

  findManyAndCount(options?: IFindAllOptions<TEntity>): Promise<[TEntity[], number]> {
    return this.repository.findAndCount(options);
  }

  count(options: IFindAllOptions<TEntity>): Promise<number> {
    return this.repository.count(options);
  }

  async delete(id: string): Promise<void> {
    const existingItem = await this.findById(id);
    if (!existingItem) {
      throw new RpcException({
        error: ErrorCodes.DATA_NOT_FOUND,
        code: GrpcStatus.NOT_FOUND,
      });
    }

    await this.repository.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    const existingItems = await this.findByIds(ids);

    if (existingItems?.length !== ids.length) {
      throw new RpcException({
        error: ErrorCodes.DATA_NOT_FOUND,
        code: GrpcStatus.NOT_FOUND,
      });
    }

    await this.repository.delete(ids);
  }
}
