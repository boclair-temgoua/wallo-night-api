import { Controller } from '@nestjs/common';
import { CheckUserService } from '../users/middleware/check-user.service';
import { UsersService } from '../users/users.service';
import { ContributorsService } from './contributors.service';

@Controller('')
export class ContributorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
  ) {}

  // @Get(`/show/:contributorId`)
  // @UseGuards(UserAuthGuard)
  // async getOneById(
  //   @Res() res,
  //   @Req() req,
  //   @Param('contributorId', ParseUUIDPipe) contributorId: string,
  // ) {
  //   const { user } = req;

  //   const findOneContributor = await this.contributorsService.findOneBy({
  //     contributorId,
  //   });

  //   if (!findOneContributor)
  //     throw new HttpException(
  //       `This contributor dons't exists please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   return reply({ res, results: findOneContributor });
  // }

  // @Put(`/role`)
  // @UseGuards(UserAuthGuard)
  // async updateOneRole(
  //   @Res() res,
  //   @Req() req,
  //   @Body() body: UpdateRoleContributorDto,
  // ) {
  //   const { user } = req;

  //   const { contributorId, role } = body;

  //   await this.contributorsService.canCheckPermissionContributor({
  //     userId: user?.id,
  //   });

  //   const findOneContributor = await this.contributorsService.findOneBy({
  //     contributorId,
  //   });
  //   if (!findOneContributor)
  //     throw new HttpException(
  //       `This contributor dons't exists please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   await this.contributorsService.updateOne({ contributorId }, { role });

  //   return reply({ res, results: 'Contributor updated successfully' });
  // }
}
