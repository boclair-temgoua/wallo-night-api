import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateOrganizationOptions,
  GetOneOrganizationSelections,
  UpdateOrganizationOptions,
  UpdateOrganizationSelections,
} from './organizations.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  async findOneBy(
    selections: GetOneOrganizationSelections,
  ): Promise<Organization> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('organization')
      .select('organization.name', 'name')
      .addSelect('organization.id', 'id')
      .addSelect('organization.color', 'color')
      .addSelect('organization.userId', 'userId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."organizationId" = "organization"."id"
      AND "con"."type" IN ('ORGANIZATION'))
      GROUP BY "con"."organizationId", "con"."type", "organization"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
           SELECT jsonb_build_object(
           'company', "uad"."company",
           'city', "uad"."city",
           'phone', "uad"."phone",
           'region', "uad"."region",
           'street1', "uad"."street1",
           'street2', "uad"."street2",
           'country', "co"."name",
           'cap', "uad"."cap"
           )
           FROM "user_address" "uad"
           LEFT JOIN "country" "co" ON "uad"."countryId" = "co"."id"
           WHERE "uad"."organizationId" = "organization"."id"
           AND "uad"."userId" = "organization"."userId"
           AND "uad"."deletedAt" IS NULL
           ) AS "userAddress"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'userId', "user"."id",
              'email', "user"."email",
              'profileId', "user"."profileId",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'color', "profile"."color",
              'image', "profile"."image"
          ) AS "profileOwner"`,
      )
      // .addSelect(
      //   /*sql*/ `(
      //   SELECT jsonb_build_object(
      //   'total', CAST(SUM("amu"."amountUsage") AS DECIMAL),
      //   'currentMonth', DATE_TRUNC('month', "amu"."createdAt")
      //   )
      //   FROM "amount_usage" "amu"
      //   INNER JOIN "amount" "am" ON "amu"."amountId" = "am"."id"
      //   WHERE "amu"."organizationId" = "am"."organizationId"
      //   AND "amu"."userId" = "am"."userId"
      //   AND "organization"."id" = "amu"."organizationId"
      //   AND "organization"."id" = "am"."organizationId"
      //   AND DATE_TRUNC('month', "amu"."createdAt") = DATE_TRUNC('month', NOW())
      //   GROUP BY "amu"."organizationId", "amu"."userId", "am"."userId",
      //   "organization"."id", DATE_TRUNC('month', "amu"."createdAt")
      //   ) AS "billing"`,
      // )
      // .addSelect(
      //   /*sql*/ `(
      //   SELECT jsonb_build_object(
      //   'total', CAST(SUM("amb"."amountBalance") AS DECIMAL)
      //   )
      //   FROM "amount_balance" "amb"
      //   INNER JOIN "amount" "am" ON "amb"."amountId" = "am"."id"
      //   WHERE "amb"."organizationId" = "am"."organizationId"
      //   AND "amb"."userId" = "am"."userId"
      //   AND "organization"."id" = "amb"."organizationId"
      //   AND "organization"."id" = "am"."organizationId"
      //   GROUP BY "amb"."organizationId", "amb"."userId", "am"."userId", "organization"."id"
      //   ) AS "balance"`,
      // )
      .where('organization.deletedAt IS NULL')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (option1) {
      const { organizationId } = option1;
      query = query.andWhere('organization.id = :id', { id: organizationId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Organization to the database. */
  async createOne(options: CreateOrganizationOptions): Promise<Organization> {
    const { userId, name } = options;

    const organization = new Organization();
    organization.userId = userId;
    organization.name = name;
    organization.color = getRandomElement(colorsArrays);

    const query = this.driver.save(organization);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Organization to the database. */
  async updateOne(
    selections: UpdateOrganizationSelections,
    options: UpdateOrganizationOptions,
  ): Promise<Organization> {
    const { option1 } = selections;
    const { userId, name, requiresPayment, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('organization');

    if (option1) {
      const { organizationId } = option1;
      findQuery = findQuery.where('organization.id = :id', {
        id: organizationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.userId = userId;
    findItem.name = name;
    findItem.requiresPayment = requiresPayment;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
