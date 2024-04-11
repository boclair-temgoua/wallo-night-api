import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Conversation } from '../../models';
import {
  CreateConversationOptions,
  GetConversationsSelections,
  GetOneConversationSelections,
  UpdateConversationOptions,
  UpdateConversationSelections,
} from './conversations.type';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private driver: Repository<Conversation>,
  ) {}

  async findAll(selections: GetConversationsSelections): Promise<any> {
    const { search, pagination, organizationToId, organizationFromId } =
      selections;

    let query = this.driver
      .createQueryBuilder('conversation')
      .select('conversation.id', 'id')
      .addSelect('conversation.fkConversationId', 'fkConversationId')
      .addSelect('conversation.createdAt', 'createdAt')
      .addSelect('conversation.updatedAt', 'updatedAt')
      .addSelect('conversation.readAt', 'readAt')
      .addSelect('conversation.type', 'type')
      .addSelect('conversation.blockedAt', 'blockedAt')
      .addSelect('conversation.sendEmail', 'sendEmail')
      .addSelect('conversation.organizationToId', 'organizationToId')
      .addSelect('conversation.organizationFromId', 'organizationFromId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'username', "user"."username",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'id', "com"."id",
        'model', "com"."model",
        'createdAt', "com"."createdAt"::timestamptz,
        'description', "com"."description",
        'organizationId', "com"."organizationId",
        'fkConversationId', "com"."fkConversationId"
        )
        FROM "comment" "com"
        WHERE "com"."fkConversationId" = "conversation"."fkConversationId"
        AND "com"."deletedAt" IS NULL
        AND "com"."model" IN ('MESSAGE')
        ORDER BY "com"."createdAt" DESC
        LIMIT 1
        ) AS "lastMessage"`,
      )
      .where('conversation.deletedAt IS NULL')
      .leftJoin('conversation.organizationTo', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (organizationToId) {
      query = query.andWhere(
        'conversation.organizationToId = :organizationToId',
        {
          organizationToId,
        },
      );
    }

    if (organizationFromId) {
      query = query.andWhere(
        'conversation.organizationFromId = :organizationFromId',
        {
          organizationFromId,
        },
      );
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(
            `profile.lastName ::text ILIKE :search 
              OR profile.firstName ::text ILIKE :search`,
            {
              search: `%${search}%`,
            },
          ).orWhere('user.email ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, conversations] = await useCatch(
      query
        .orderBy('conversation.conversationUpdatedAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: conversations,
    });
  }

  async findAllBy(options: { fkConversationId: string }): Promise<any> {
    const { fkConversationId } = options;

    let query = this.driver
      .createQueryBuilder('conversation')
      .where('conversation.deletedAt IS NULL');

    if (fkConversationId) {
      query = query.andWhere(
        'conversation.fkConversationId = :fkConversationId',
        {
          fkConversationId,
        },
      );
    }

    return await query.getMany();
  }

  async findOneBy(
    selections: GetOneConversationSelections,
  ): Promise<Conversation> {
    const { fkConversationId, organizationFromId, organizationToId } =
      selections;
    let query = this.driver
      .createQueryBuilder('conversation')
      .select('conversation.id', 'id')
      .addSelect('conversation.fkConversationId', 'fkConversationId')
      .addSelect('conversation.createdAt', 'createdAt')
      .addSelect('conversation.updatedAt', 'updatedAt')
      .addSelect('conversation.readAt', 'readAt')
      .addSelect('conversation.type', 'type')
      .addSelect('conversation.blockedAt', 'blockedAt')
      .addSelect('conversation.organizationToId', 'organizationToId')
      .addSelect('conversation.organizationFromId', 'organizationFromId')
      .addSelect('conversation.sendEmail', 'sendEmail')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'username', "user"."username",
              'organizationId', "organization"."id",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .where('conversation.deletedAt IS NULL')
      .leftJoin('conversation.organizationTo', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (fkConversationId) {
      query = query.andWhere(
        'conversation.fkConversationId = :fkConversationId',
        { fkConversationId },
      );
    }

    if (organizationToId) {
      query = query.andWhere(
        'conversation.organizationToId = :organizationToId',
        { organizationToId },
      );
    }

    if (organizationFromId) {
      query = query.andWhere(
        'conversation.organizationFromId = :organizationFromId',
        { organizationFromId },
      );
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('conversation not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Conversation to the database. */
  async createOne(options: CreateConversationOptions): Promise<Conversation> {
    const {
      fkConversationId,
      readAt,
      type,
      blockedAt,
      sendEmail,
      organizationToId,
      organizationFromId,
      conversationUpdatedAt,
    } = options;

    const conversation = new Conversation();
    conversation.fkConversationId = fkConversationId;
    conversation.readAt = readAt;
    conversation.type = type;
    conversation.blockedAt = blockedAt;
    conversation.sendEmail = sendEmail;
    conversation.organizationToId = organizationToId;
    conversation.organizationFromId = organizationFromId;
    conversation.conversationUpdatedAt = conversationUpdatedAt;

    const query = this.driver.save(conversation);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Conversation to the database. */
  async updateOne(
    selections: UpdateConversationSelections,
    options: UpdateConversationOptions,
  ): Promise<Conversation> {
    const { conversationId } = selections;
    const { readAt, blockedAt, deletedAt, conversationUpdatedAt } = options;

    let findQuery = this.driver.createQueryBuilder('conversation');

    if (conversationId) {
      findQuery = findQuery.where('conversation.id = :id', {
        id: conversationId,
      });
    }

    const [errorFind, conversation] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    conversation.readAt = readAt;
    conversation.blockedAt = blockedAt;
    conversation.deletedAt = deletedAt;
    conversation.conversationUpdatedAt = conversationUpdatedAt;

    const query = this.driver.save(conversation);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
