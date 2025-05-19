export abstract class BaseEntity {
  id: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  version: number;
}
