import {
  Controller,
  Param,
  Res,
  Query,
  Get,
  ParseUUIDPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  Req,
  Put,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';

import { UsersService } from '../users.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { JwtAuthGuard } from '../middleware';
import {
  RequestPaginationDto,
  addPagination,
  PaginationType,
} from '../../../app/utils/pagination';
import { SearchQueryDto } from '../../../app/utils/search-query';
import { UpdateOneEmailUserDto, UpdateProfileDto } from '../users.dto';

@Controller('users')
export class UsersInternalController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
  ) {}

  /** Get all users */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const users = await this.usersService.findAll({ search, pagination });

    return reply({ res, results: users });
  }

  /** Get one user */
  @Get(`/show/:userId`)
  @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.usersService.findOneInfoBy({ option1: { userId } });

    return reply({ res, results: user });
  }

  @Get(`/profile/show/:profileId`)
  @UseGuards(JwtAuthGuard)
  async getOneByProfileId(
    @Res() res,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const profile = await this.profilesService.findOneBy({
      option1: { profileId },
    });

    return reply({ res, results: profile });
  }

  @Put(`/update/profile`)
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Res() res, @Req() req, @Body() body: UpdateProfileDto) {
    const { user } = req;

    const { firstName, lastName, countryId, image, color, url } = body;

    await this.profilesService.updateOne(
      { option1: { profileId: user?.profileId } },
      { firstName, lastName, countryId, image, color, url },
    );

    return reply({ res, results: 'Profile updated successfully' });
  }

  @Put(`/change-email`)
  @UseGuards(JwtAuthGuard)
  async updateUserEmail(
    @Res() res,
    @Req() req,
    @Body() body: UpdateOneEmailUserDto,
  ) {
    const { user } = req;
    const { email, password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneUser = await this.usersService.findOneBy({
      option2: { email },
    });

    if (findOneUser && findOneUser?.email !== user?.email)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.usersService.updateOne(
      { option1: { userId: user?.id } },
      { email: email },
    );

    return reply({ res, results: 'User updated successfully' });
  }

  @Get(`/change-organization/:organizationId`)
  @UseGuards(JwtAuthGuard)
  async updateUserOrganization(
    @Res() res,
    @Req() req,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;

    await this.usersService.updateOne(
      { option1: { userId: user?.id } },
      { organizationInUtilizationId: organizationId },
    );

    return reply({ res, results: 'User organization updated successfully' });
  }
}
