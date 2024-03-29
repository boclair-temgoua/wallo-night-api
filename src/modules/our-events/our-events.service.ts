import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Slug, generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { OurEvent } from '../../models';
import {
  CreateOurEventsOptions,
  GetOneOurEventsSelections,
  GetOurEventsSelections,
  UpdateOurEventsOptions,
  UpdateOurEventsSelections,
} from './our-events.type';

@Injectable()
export class OurEventsService {
  constructor(
    @InjectRepository(OurEvent)
    private driver: Repository<OurEvent>,
  ) {}

  async findAll(selections: GetOurEventsSelections): Promise<any> {
    const { search, pagination, status, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('event')
      .select('event.id', 'id')
      .addSelect('event.title', 'title')
      .addSelect('event.location', 'location')
      .addSelect('event.address', 'address')
      .addSelect('event.requirement', 'requirement')
      .addSelect('event.slug', 'slug')
      .addSelect('event.dateEvent', 'dateEvent')
      .addSelect('event.urlRedirect', 'urlRedirect')
      .addSelect('event.enableUrlRedirect', 'enableUrlRedirect')
      .addSelect('event.price', 'price')
      .addSelect('event.currency', 'currency')
      .addSelect('event.description', 'description')
      .addSelect('event.messageAfterPayment', 'messageAfterPayment')
      .addSelect('event.status', 'status')
      .addSelect('event.userId', 'userId')
      .addSelect('event.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'username', "user"."username"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'name', "organization"."name",
              'image', "organization"."image"
          ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "event"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('EVENT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "event"."id", "upl"."uploadableId"
          ) AS "uploadsImage"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "event"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('EVENT')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "event"."id", "upl"."uploadableId"
          ) AS "uploadsFile"`,
      )
      .addSelect('event.createdAt', 'createdAt')
      .where('event.deletedAt IS NULL')
      .leftJoin('event.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('event.organization', 'organization');

    if (userId) {
      query = query.andWhere('event.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('event.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (status) {
      query = query.andWhere('event.status = :status', { status });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('event.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('event.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const events = await query
      .orderBy('event.createdAt', pagination?.sort)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany();

    return withPagination({
      pagination,
      rowCount,
      value: events,
    });
  }

  async findOneBy(selections: GetOneOurEventsSelections): Promise<OurEvent> {
    const { eventId, eventSlug, userId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('event')
      .select('event.id', 'id')
      .addSelect('event.title', 'title')
      .addSelect('event.location', 'location')
      .addSelect('event.address', 'address')
      .addSelect('event.requirement', 'requirement')
      .addSelect('event.slug', 'slug')
      .addSelect('event.dateEvent', 'dateEvent')
      .addSelect('event.urlRedirect', 'urlRedirect')
      .addSelect('event.enableUrlRedirect', 'enableUrlRedirect')
      .addSelect('event.price', 'price')
      .addSelect('event.currency', 'currency')
      .addSelect('event.description', 'description')
      .addSelect('event.organizationId', 'organizationId')
      .addSelect('event.messageAfterPayment', 'messageAfterPayment')
      .addSelect('event.status', 'status')
      .addSelect('event.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'fullName', "profile"."fullName",
            'firstName', "profile"."firstName",
            'lastName', "profile"."lastName",
            'image', "profile"."image",
            'color', "profile"."color",
            'userId', "user"."id",
            'username', "user"."username"
        ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'name', "organization"."name",
              'image', "organization"."image"
          ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "event"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('EVENT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "event"."id", "upl"."uploadableId"
          ) AS "uploadsImage"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "event"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('EVENT')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "event"."id", "upl"."uploadableId"
          ) AS "uploadsFile"`,
      )
      .addSelect('event.createdAt', 'createdAt')
      .where('event.deletedAt IS NULL')
      .leftJoin('event.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('event.organization', 'organization');

    if (eventId) {
      query = query.andWhere('event.id = :id', { id: eventId });
    }

    if (userId) {
      query = query.andWhere('event.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('event.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (eventSlug) {
      query = query.andWhere('event.slug = :slug', { slug: eventSlug });
    }

    const events = await query.getRawOne();

    return events;
  }

  /** Create one OurEvents to the database. */
  async createOne(options: CreateOurEventsOptions): Promise<OurEvent> {
    const {
      title,
      location,
      requirement,
      urlMedia,
      urlRedirect,
      enableUrlRedirect,
      price,
      dateEvent,
      expiredAt,
      currency,
      address,
      description,
      organizationId,
      messageAfterPayment,
      status,
      userId,
    } = options;

    const event = new OurEvent();
    event.title = title;
    event.location = location;
    event.address = address;
    event.urlMedia = urlMedia;
    event.requirement = requirement;
    event.urlRedirect = urlRedirect;
    event.organizationId = organizationId;
    event.enableUrlRedirect = enableUrlRedirect;
    event.price = price;
    event.dateEvent = dateEvent;
    event.expiredAt = expiredAt;
    event.currency = currency;
    event.messageAfterPayment = messageAfterPayment;
    event.status = status;
    event.slug = `${Slug(title)}-${generateNumber(4)}`;
    event.description = description;
    event.userId = userId;

    const query = this.driver.save(event);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one OurEvents to the database. */
  async updateOne(
    selections: UpdateOurEventsSelections,
    options: UpdateOurEventsOptions,
  ): Promise<OurEvent> {
    const { eventId } = selections;
    const {
      title,
      location,
      requirement,
      urlMedia,
      urlRedirect,
      enableUrlRedirect,
      price,
      dateEvent,
      expiredAt,
      currency,
      address,
      description,
      messageAfterPayment,
      status,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('event');

    if (eventId) {
      findQuery = findQuery.where('event.id = :id', { id: eventId });
    }

    const [errorFind, event] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    event.title = title;
    event.location = location;
    event.urlMedia = urlMedia;
    event.address = address;
    event.requirement = requirement;
    event.urlRedirect = urlRedirect;
    event.enableUrlRedirect = enableUrlRedirect;
    event.price = price;
    event.dateEvent = dateEvent;
    event.expiredAt = expiredAt;
    event.currency = currency;
    event.messageAfterPayment = messageAfterPayment;
    event.status = status;
    event.description = description;
    event.deletedAt = deletedAt;

    const query = this.driver.save(event);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
