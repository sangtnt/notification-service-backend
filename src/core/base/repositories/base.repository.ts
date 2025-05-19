import { BaseEntity } from '@/shared/interfaces/base.entity';
import { IFindAllOptions } from '@/shared/interfaces/find-all-options';

/**
 * Base repository interface for CRUD operations.
 * This interface defines the basic operations that can be performed on a repository.
 */
export interface IRepository<TEntity extends BaseEntity> {
  /**
   * Creates a new instance of the entity.
   * @returns A new instance of the entity.
   */
  createInstance(): TEntity;

  /**
   * Creates/Update a new instance of the entity.
   * @param item The item to save.
   * @throws Error If the item could not be saved.
   */
  save(item: Partial<TEntity>): Promise<string>;

  /**
   * Creates/Update multiple items in the repository.
   * @param items The items to save.
   * @throws Error If the items could not be saved.
   */
  saveMany(items: Partial<TEntity>[]): Promise<string[]>;

  /**
   * Finds an item by its ID.
   * @param id The ID of the item to find.
   * @returns The found item, or null if not found.
   */
  findById(id: string): Promise<TEntity | null>;

  /**
   * Finds all items in the repository.
   * @returns An array of all items.
   */
  findMany(options?: IFindAllOptions<TEntity>): Promise<TEntity[]>;

  /**
   * Finds all items in the repository.
   * @returns An array of all items.
   */
  findManyAndCount(options?: IFindAllOptions<TEntity>): Promise<[TEntity[], number]>;

  /**
   * Counts the number of items in the repository.
   * @returns The number of items.
   */
  count(options: IFindAllOptions<TEntity>): Promise<number>;

  /**
   * Deletes an item from the repository.
   * @param id The ID of the item to delete.
   * @throws Error If the item could not be deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Deletes multiple items from the repository.
   * @param ids The IDs of the items to delete.
   * @throws Error If the items could not be deleted.
   */
  deleteMany(ids: string[]): Promise<void>;
}
