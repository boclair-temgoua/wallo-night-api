import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Currency, User } from './index';
@Entity('profile')
export class Profile extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    firstAddress?: string;

    @Column({ nullable: true })
    secondAddress?: string;

    @Column({ nullable: true })
    birthday?: Date;

    @Column({ type: 'uuid', nullable: true })
    countryId?: string;

    @Column({ nullable: true })
    color?: string;

    @Column({ type: 'jsonb', array: false, nullable: true })
    social?: [];

    @Column({ type: 'jsonb', array: false, nullable: true })
    image?: { key: 'aws' | 'provider'; patch: string };

    @Column({ type: 'boolean', default: false })
    enableShop: boolean;

    @Column({ type: 'boolean', default: false })
    enableGallery: boolean;

    @Column({ nullable: true })
    url?: string;

    @OneToOne(() => User, (user) => user.profile, {
        onDelete: 'CASCADE',
    })
    user?: User;

    @Column({ type: 'uuid', nullable: true })
    currencyId?: string;
    @ManyToOne(() => Currency, (currency) => currency.profiles)
    @JoinColumn()
    currency?: Relation<Currency>;
}
