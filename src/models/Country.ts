import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { Product } from './Product';

@Entity('country')
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ default: false })
    code?: string;

    @Column({ nullable: true })
    name?: string;

    @OneToMany(() => Product, (product) => product.country)
    products: Product[];
}
