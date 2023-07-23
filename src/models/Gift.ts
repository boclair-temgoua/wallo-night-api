import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    Relation,
    OneToMany,
  } from 'typeorm';
  import { User } from './User';
  import { Transaction } from './Transaction';
  import { Currency } from './Currency';
  import { BaseDeleteEntity } from '../app/databases/common';
  import { Organization } from './Organization';
  import { Contributor } from './Contributor';
  
  @Entity('gift')
  export class Gift extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ nullable: true, type: 'timestamptz' })
    expiredAt: Date;
  
    @Column({ nullable: true })
    title: string;
  
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;
  
    @Column({ type: 'bigint' })
    amount: number;
  
    @Column({ type: 'uuid', nullable: true })
    currencyId?: string;
    @ManyToOne(() => Currency, (currency) => currency.gifts, {
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    currency?: Relation<Currency>;
  
    @Column({ type: 'uuid', nullable: true })
    userId?: string;
    @ManyToOne(() => User, (user) => user.gifts, {
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    user?: Relation<User>;
  
    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @ManyToOne(() => Organization, (organization) => organization.donations, {
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    organization?: Relation<Organization>;
  
    @OneToMany(() => Transaction, (transaction) => transaction.gift, {
      onDelete: 'CASCADE',
    })
    transactions?: Transaction[];
  
    @OneToMany(() => Contributor, (contributor) => contributor.gift, {
      onDelete: 'CASCADE',
    })
    contributors?: Contributor[];
  }
  