import {
  codeConfirmationMail,
  confirmInvitationMail,
  passwordResetMail,
} from './mails';

/** Send Job Reset password */
export const passwordResetJob = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await passwordResetMail({ email, token });

/** Send Job Reset password */
export const confirmInvitationJod = async ({
  code,
  email,
  token,
  nameOrganization,
  fullNameInviter,
}: {
  code?: string;
  email: string;
  token: string;
  fullNameInviter: string;
  nameOrganization: string;
}) =>
  await confirmInvitationMail({
    email,
    token,
    nameOrganization,
    fullNameInviter,
  });

/** Send Job code confirmation */
export const codeConfirmationJob = async ({
  code,
  email,
}: {
  code: string;
  email: string;
}) => await codeConfirmationMail({ email, code });
