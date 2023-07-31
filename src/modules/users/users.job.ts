import {
  authLoginNotificationMail,
  authPasswordResetMail,
  authUserVerifyIsConfirmMail,
} from './mails';
import { authCodeConfirmationMail } from './mails/auth-code-confirmation-mail';
import { authNewUserCreateMail } from './mails/auth-new-user-create-mail';

export const authRegisterJob = async (options: { channel; queue }) => {
  const { channel, queue } = options;

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing Job message user start ****',
      );
      authUserVerifyIsConfirmMail({ user: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Login */
export const authLoginJob = async (options: { channel; queue }) => {
  const { channel, queue } = options;

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing login Job message user start ****',
      );
      authLoginNotificationMail({ user: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed login Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Reset password */
export const authPasswordResetJob = async (options: { channel; queue }) => {
  const { channel, queue } = options;

  await channel.consume(
    queue,
    async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing reset password Job message user start ****',
      );
      authPasswordResetMail({ resetPassword: data });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed reset password Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Reset password */
export const authCodeConfirmationJob = async (options: { channel; queue }) => {
  const { channel, queue } = options;

  await channel.consume(
    queue,
    async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing send code to user Job message user start ****',
      );
      authCodeConfirmationMail({ user: data });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed send code to user Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Reset password */
export const authNewUserCreateJob = async (options: { channel; queue }) => {
  const { channel, queue } = options;

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing new user create Job message user start ****',
      );
      authNewUserCreateMail({ resetPassword: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed new user create Job message user finish ****',
      );
    },
    { noAck: true },
  );
};
