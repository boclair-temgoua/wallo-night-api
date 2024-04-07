import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { Organization } from './index';

@Entity('conversation')
export class Conversation extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  fkConversationId: string; // Cette cle est relier au conversatio ouver

  @Column({ type: 'timestamptz', nullable: true, default: 'NOW()' })
  conversationUpdatedAt?: Date;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ type: 'enum', enum: ['PERSONAL', 'MULTIPLE'], default: 'PERSONAL' })
  type?: 'PERSONAL' | 'MULTIPLE';

  @Column({ nullable: true })
  blockedAt?: Date;

  @Column({ type: 'boolean', default: true })
  sendEmail: boolean;

  @Column({ type: 'uuid', nullable: true })
  organizationFromId?: string;
  @ManyToOne(() => Organization, (organization) => organization.conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'organizationFromId', referencedColumnName: 'id' }])
  organizationFrom?: Relation<Organization>;

  @Column({ type: 'uuid', nullable: true })
  organizationToId?: string;
  @ManyToOne(() => Organization, (organization) => organization.conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'organizationToId', referencedColumnName: 'id' }])
  organizationTo?: Relation<Organization>;
}
