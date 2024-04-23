import { orderEventMail, orderProductMail } from './mails';

/** Send Job Order product */
export const orderProductJob = async ({
    email,
    token,
}: {
    email: string;
    token: string;
}) => await orderProductMail({ email, token });

/** Send Job Order event */
export const orderEventJob = async ({
    email,
    token,
}: {
    email: string;
    token: string;
}) => await orderEventMail({ email, token });
