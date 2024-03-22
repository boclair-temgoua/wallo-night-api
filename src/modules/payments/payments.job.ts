import {
  orderCommissionMail,
  orderMembershipMail,
  orderProductMail,
} from './mails';

/** Send Job Order product */
export const orderProductJob = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await orderProductMail({ email, token });

/** Send Job Order membership */
export const orderMembershipJob = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await orderMembershipMail({ email, token });

/** Send Job Order commission */
export const orderCommissionJob = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await orderCommissionMail({ email, token });
