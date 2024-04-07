import { Injectable } from '@nestjs/common';
import { dateTimeNowUtc } from '../../app/utils/formate-date';
import { CommentsService } from '../comments/comments.service';
import { ConversationsService } from './conversations.service';

@Injectable()
export class ConversationsUtil {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async saveOrUpdate(options: {
    description: string;
    organizationId: string;
    fkConversationId: string;
  }): Promise<any> {
    const { description, organizationId, fkConversationId } = options;

    const comment = await this.commentsService.createOne({
      description,
      model: 'MESSAGE',
      fkConversationId: fkConversationId,
      organizationId: organizationId,
    });

    const conversations = await this.conversationsService.findAllBy({
      fkConversationId,
    });

    for (const conversation of conversations) {
      await this.conversationsService.updateOne(
        { conversationId: conversation?.id },
        { conversationUpdatedAt: dateTimeNowUtc() },
      );
    }

    return { comment };
  }
}
