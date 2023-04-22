import { configurations } from '../../../app/configurations/index';
import {
  ClientApiMethods,
} from '../integrations.service';

const POST = 'post';
const GET = 'get';
const DELETE = 'delete';
const PUT = 'put';

const baseUrl = configurations.implementations.ivemo.link;
export const ivemo: ClientApiMethods = {
  getOneCoupon: {
    endpoint: `${baseUrl}/coupons/show/:code`,
    method: GET,
  },
  useOneCoupon: {
    endpoint: `${baseUrl}/coupons/use`,
    method: PUT,
  },

};


export type GetOneVoucherRequest = {
  code: string;
};
