import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { Campaign } from '../../models';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateCampaignOptions,
  GetCampaignsSelections,
  GetOneCampaignSelections,
  UpdateCampaignOptions,
  UpdateCampaignSelections,
} from './campaigns.type';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private driver: Repository<Campaign>,
  ) {}

  async findAll(
    selections: GetCampaignsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('campaign')
      .select('campaign.id', 'id')
      .addSelect('Campaign.title', 'title')
      .addSelect('Campaign.image', 'image')
      .addSelect('Campaign.userId', 'userId')
      .addSelect('Campaign.isActive', 'isActive')
      .addSelect('Campaign.createdAt', 'createdAt')
      .addSelect('Campaign.expiredAt', 'expiredAt')
      .addSelect('Campaign.description', 'description')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "profile"."id",
        'userId', "user"."id",
        'fullName', "profile"."fullName",
        'image', "profile"."image",
        'color', "profile"."color",
        'countryId', "profile"."countryId",
        'url', "profile"."url"
    ) AS "profile"`,
      )
      .where('campaign.deletedAt IS NULL')
      .leftJoin('Campaign.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (userId) {
      query = query.andWhere('Campaign.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere('Campaign.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Campaigns] = await useCatch(
      query
        .orderBy('Campaign.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Campaigns,
    });
  }

  async findOneBy(selections: GetOneCampaignSelections): Promise<Campaign> {
    const { campaignId } = selections;
    let query = this.driver
      .createQueryBuilder('campaign')
      .select('campaign.id', 'id')
      .addSelect('campaign.title', 'title')
      .addSelect('campaign.userId', 'userId')
      .addSelect('campaign.isActive', 'isActive')
      .addSelect('campaign.createdAt', 'createdAt')
      .addSelect('campaign.expiredAt', 'expiredAt')
      .addSelect('campaign.description', 'description')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'fullName', "profile"."fullName",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url"
      ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'amount', CAST(SUM("contr"."amountConvert") / 100 AS BIGINT),
          'total', CAST(COUNT(DISTINCT contr) AS BIGINT)
          )
          FROM "contribution" "contr"
          WHERE "contr"."campaignId" = "campaign"."id"
          AND "contr"."deletedAt" IS NULL
          GROUP BY "contr"."campaignId", "campaign"."id"
          ) AS "contribution"`,
      )
      .where('campaign.deletedAt IS NULL')
      .andWhere('campaign.expiredAt >= now()')
      .leftJoin('campaign.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (campaignId) {
      query = query.andWhere('campaign.id = :id', { id: campaignId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('campaign not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Campaign to the database. */
  async createOne(options: CreateCampaignOptions): Promise<Campaign> {
    const { title, expiredAt, description, userId, image } = options;

    const campaign = new Campaign();
    campaign.title = title;
    campaign.userId = userId;
    campaign.image = image;
    campaign.expiredAt = expiredAt;
    campaign.description = description;

    const query = this.driver.save(campaign);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
  /** Update one Campaign to the database. */
  async updateOne(
    selections: UpdateCampaignSelections,
    options: UpdateCampaignOptions,
  ): Promise<Campaign> {
    const { campaignId } = selections;
    const { title, image, description, isActive, expiredAt, deletedAt } =
      options;

    let findQuery = this.driver.createQueryBuilder('campaign');

    if (campaignId) {
      findQuery = findQuery.where('campaign.id = :id', {
        id: campaignId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.image = image;
    findItem.isActive = isActive;
    findItem.expiredAt = expiredAt;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
