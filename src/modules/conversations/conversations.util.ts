import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dateTimeNowUtc } from '../../app/utils/formate-date';
import { CommentsService } from '../comments/comments.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { conversationMessageJob } from './conversations.job';
import { ConversationsService } from './conversations.service';

@Injectable()
export class ConversationsUtil {
  constructor(
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly conversationsService: ConversationsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async saveOrUpdate(options: {
    email: string;
    fullName: string;
    enableSendEmail: boolean;
    description: string;
    organizationId: string;
    fkConversationId: string;
  }): Promise<any> {
    const {
      email,
      fullName,
      enableSendEmail,
      description,
      organizationId,
      fkConversationId,
    } = options;

    const comment = await this.commentsService.createOne({
      description,
      model: 'MESSAGE',
      fkConversationId: fkConversationId,
      organizationId: organizationId,
    });

    const conversations = await this.conversationsService.findAllBy({
      fkConversationId,
    });

    if (enableSendEmail) {
      await conversationMessageJob({
        fullName: fullName,
        email: email,
        fkConversationId,
        description,
      });
    }

    for (const conversation of conversations) {
      await this.conversationsService.updateOne(
        { conversationId: conversation?.id },
        { conversationUpdatedAt: dateTimeNowUtc() },
      );
    }

    return { comment };
  }

  async findUserAnOrganization(options: {
    organizationId: string;
  }): Promise<any> {
    const { organizationId } = options;

    const organization = await this.organizationsService.findOneBy({
      organizationId,
    });
    if (!organization) {
      throw new HttpException(`This user dons't exist`, HttpStatus.NOT_FOUND);
    }

    const user = await this.usersService.findOneBy({
      userId: organization?.userId,
    });

    return { user, organization };
  }
}
