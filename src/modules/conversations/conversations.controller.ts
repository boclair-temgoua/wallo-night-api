import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateMessageConversationsDto,
  CreateOrUpdateConversationsDto,
  GetMessageConversationsDto,
} from './conversations.dto';

import { generateLongUUID } from '../../app/utils/commons';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { CommentsService } from '../comments/comments.service';
import { ConversationsService } from './conversations.service';
import { ConversationsUtil } from './conversations.util';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly conversationsUtil: ConversationsUtil,
    private readonly conversationsService: ConversationsService,
  ) {}

  /** Get all Conversations */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAllConversations(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const conversations = await this.conversationsService.findAll({
      search,
      pagination,
      organizationFromId: user?.organizationId,
    });

    return reply({ res, results: conversations });
  }

  /** Get all Conversations Messages */
  @Get(`/messages/:fkConversationId`)
  @UseGuards(UserAuthGuard)
  async findAllConversationMessage(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Param() param: GetMessageConversationsDto,
  ) {
    const { user } = req;
    const { fkConversationId } = param;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const findOneConversation = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationToId: user?.organizationId,
    });
    if (!findOneConversation) {
      throw new HttpException(
        `This conversation ${fkConversationId} dons't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const messages = await this.commentsService.findAllMessages({
      search,
      pagination,
      modelIds: ['MESSAGE'],
      fkConversationId: fkConversationId,
    });

    return reply({ res, results: messages });
  }

  /** Create Conversation */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOneConversation(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateConversationsDto,
  ) {
    const { user } = req;
    const fkConversationId = generateLongUUID(30);
    const { organizationToId, enableSendEmail, description } = body;

    const { user: userTo } =
      await this.conversationsUtil.findUserAnOrganization({
        organizationId: organizationToId,
      });

    const findOneConversationTo = await this.conversationsService.findOneBy({
      organizationToId: organizationToId,
      organizationFromId: user.organizationId,
    });

    if (findOneConversationTo) {
      await this.conversationsUtil.saveOrUpdate({
        description,
        enableSendEmail,
        fkConversationId: findOneConversationTo?.fkConversationId,
        organizationId: user?.organizationId,
        email: userTo?.email,
        fullName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
      });

      // Reset readAt
      await this.conversationsService.updateOne(
        { conversationId: findOneConversationTo?.id },
        { readAt: null },
      );
    }
    if (!findOneConversationTo) {
      const conversation = await this.conversationsService.createOne({
        organizationToId: organizationToId,
        fkConversationId: fkConversationId,
        organizationFromId: user.organizationId,
      });

      await this.conversationsService.createOne({
        organizationFromId: organizationToId,
        organizationToId: conversation.organizationFromId,
        fkConversationId: conversation.fkConversationId,
      });

      await this.commentsService.createOne({
        description,
        model: 'MESSAGE',
        fkConversationId: fkConversationId,
        organizationId: user?.organizationId,
      });
    }
    return reply({ res, results: 'Conversation create successfully' });
  }

  @Post(`/messages`)
  @UseGuards(UserAuthGuard)
  async findAllMessages(
    @Res() res,
    @Req() req,
    @Body() body: CreateMessageConversationsDto,
  ) {
    const { user } = req;
    const { description, enableSendEmail, fkConversationId } = body;

    const findOneConversationFrom = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationFromId: user?.organizationId,
    });
    const findOneConversationTo = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationFromId: findOneConversationFrom?.organizationToId,
    });

    const { user: userTo } =
      await this.conversationsUtil.findUserAnOrganization({
        organizationId: findOneConversationFrom?.organizationToId,
      });

    if (findOneConversationFrom && findOneConversationTo) {
      await this.conversationsUtil.saveOrUpdate({
        description,
        enableSendEmail,
        fkConversationId: fkConversationId,
        organizationId: user?.organizationId,
        email: userTo?.email,
        fullName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
      });

      // Reset readAt
      await this.conversationsService.updateOne(
        { conversationId: findOneConversationTo?.id },
        { readAt: null },
      );
    }

    return reply({ res, results: 'Message save successfully' });
  }

  @Get(`/:fkConversationId`)
  @UseGuards(UserAuthGuard)
  async getOneByProfileId(
    @Res() res,
    @Req() req,
    @Param() param: GetMessageConversationsDto,
  ) {
    const { user } = req;
    const { fkConversationId } = param;

    const findOneConversation = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationFromId: user?.organizationId,
    });
    if (!findOneConversation) {
      throw new HttpException(
        `This conversation ${fkConversationId} dons't exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return reply({ res, results: findOneConversation });
  }

  /** Read Conversation */
  @Put(`/:fkConversationId/readAt`)
  @UseGuards(UserAuthGuard)
  async readOneConversation(
    @Res() res,
    @Req() req,
    @Param() param: GetMessageConversationsDto,
  ) {
    const { user } = req;
    const { fkConversationId } = param;
    const findOneConversation = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationFromId: user?.organizationId,
    });
    if (!findOneConversation)
      throw new HttpException(
        `This conversation ${fkConversationId} dons't exist`,
        HttpStatus.NOT_FOUND,
      );

    await this.conversationsService.updateOne(
      { conversationId: findOneConversation?.id },
      { readAt: new Date() },
    );

    return reply({ res, results: { id: fkConversationId } });
  }

  /** Delete Conversation */
  @Delete(`/:fkConversationId`)
  @UseGuards(UserAuthGuard)
  async deleteOneConversation(
    @Res() res,
    @Req() req,
    @Param() param: GetMessageConversationsDto,
  ) {
    const { user } = req;
    const { fkConversationId } = param;
    const findOneConversation = await this.conversationsService.findOneBy({
      fkConversationId,
      organizationFromId: user?.organizationId,
    });
    if (!findOneConversation)
      throw new HttpException(
        `This conversation ${fkConversationId} dons't exist`,
        HttpStatus.NOT_FOUND,
      );

    await this.conversationsService.updateOne(
      { conversationId: findOneConversation?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: { id: fkConversationId } });
  }
}
