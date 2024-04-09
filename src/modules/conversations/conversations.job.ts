import { conversationMessageMail } from './mails';

/** Send Job conversation Message */
export const conversationMessageJob = async ({
  email,
  fullName,
  description,
  fkConversationId,
}: {
  email: string;
  fullName: string;
  description: string;
  fkConversationId: string;
}) =>
  await conversationMessageMail({
    email,
    fullName,
    description,
    fkConversationId,
  });
