import { config } from '../../../app/config/index';
import { ClientApiMethods } from '../integrations.service';

const POST = 'post';
const GET = 'get';
const DELETE = 'delete';
const PUT = 'put';

const baseUrl = config.implementations.paypal.url;

export const paypalEndpoints: ClientApiMethods = {
  getAccessToken: {
    endpoint: `${baseUrl}/oauth2/token`,
    method: POST,
  },
};

export type ResponseAccessToken = {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
};
