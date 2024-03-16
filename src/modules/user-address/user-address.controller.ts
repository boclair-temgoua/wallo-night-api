import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';
import { CreateOrUpdateUserAddressDto } from './user-address.dto';

import { UserAddressService } from './user-address.service';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  /** Get one userAddress */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async getOneByUUID(@Res() res, @Req() req) {
    const { user } = req;
    const userAddress = await this.userAddressService.findOneBy({
      organizationId: user.organizationId,
    });

    return reply({ res, results: userAddress });
  }

  /** Create UserAddress */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateUserAddressDto,
  ) {
    const { user } = req;
    const {
      firstName,
      lastName,
      city,
      cap,
      country,
      phone,
      region,
      street1,
      street2,
    } = body;

    const userAddress = await this.userAddressService.createOne({
      firstName,
      lastName,
      city,
      cap,
      country,
      phone,
      region,
      street1,
      street2,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: userAddress });
  }

  /** Update faq */
  @Put(`/:userAddressId`)
  @UseGuards(UserAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateUserAddressDto,
    @Param('userAddressId', ParseUUIDPipe) userAddressId: string,
  ) {
    const {
      firstName,
      lastName,
      city,
      cap,
      country,
      phone,
      region,
      street1,
      street2,
    } = body;

    const findOneUserAddress = await this.userAddressService.findOneBy({
      userAddressId,
    });
    if (!findOneUserAddress)
      throw new HttpException(
        `This faq ${userAddressId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const userAddress = await this.userAddressService.updateOne(
      { userAddressId: findOneUserAddress?.id },
      {
        firstName,
        lastName,
        city,
        cap,
        country,
        phone,
        region,
        street1,
        street2,
        isUpdated: true,
      },
    );

    return reply({ res, results: userAddress });
  }

  /** Delete userAddress */
  @Delete(`/:userAddressId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('userAddressId', ParseUUIDPipe) userAddressId: string,
  ) {
    const { user } = req;
    const findOneUserAddress = await this.userAddressService.findOneBy({
      userAddressId,
      userId: user.id,
      organizationId: user.organizationId,
    });
    if (!findOneUserAddress)
      throw new HttpException(
        `This userAddress ${userAddressId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const userAddress = await this.userAddressService.updateOne(
      { userAddressId: findOneUserAddress?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: userAddress });
  }
}
