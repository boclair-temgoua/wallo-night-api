import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Post,
  Req,
  Body,
  Put,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';
import { CreateOrUpdateUserAddressDto } from './user-address.dto';
import { UserAddressService } from './user-address.service';
import { SearchQueryDto } from '../../app/utils/search-query';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllApplications(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const applications = await this.userAddressService.findAll({
      option1: { userId: user?.organizationInUtilization?.userId },
      search: String(search || ''),
    });

    return reply({ res, results: applications });
  }

  /** Create user-address */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneFaq(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateUserAddressDto,
  ) {
    const { user } = req;
    const { company, city, phone, region, street1, street2, cap, countryId } =
      body;

    await this.userAddressService.createOne({
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
      organizationId: user?.organizationInUtilizationId,
      userId: user?.organizationInUtilization?.userId,
    });

    return reply({ res, results: 'user-address save successfully' });
  }

  /** Create user-address */
  @Put(`/:userAddressId`)
  @UseGuards(JwtAuthGuard)
  async updateOneFaq(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateUserAddressDto,
    @Param('userAddressId', ParseUUIDPipe) userAddressId: string,
  ) {
    const { company, city, phone, region, street1, street2, cap, countryId } =
      body;

    const findOneUserAddress = await this.userAddressService.findOneBy({
      option1: { userAddressId },
    });
    if (!findOneUserAddress)
      throw new HttpException(
        `This user address ${userAddressId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.userAddressService.updateOne(
      { option1: { userAddressId: findOneUserAddress?.id } },
      {
        company,
        city,
        phone,
        region,
        street1,
        street2,
        cap,
        countryId,
      },
    );

    return reply({ res, results: 'user-address update successfully' });
  }
}
