import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// save date in zulu senza il GMT e le robe della zona
export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class BaseDeleteEntity extends BaseEntity {
  @Column({ nullable: true })
  deletedAt?: Date;
}
