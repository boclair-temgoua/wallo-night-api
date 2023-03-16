import { configurations } from '../../../app/configurations/index';
import {
  ClientApiMethods,
  getURLEndpoint,
  IntegrationApiCall,
} from '../integrations.service';

const POST = 'post';
const GET = 'get';
const DELETE = 'delete';
const PUT = 'put';

const baseUrl = configurations.implementations.ipapi.link;
export const ipapies: ClientApiMethods = {
  getOnIpLocation: {
    endpoint: `${baseUrl}/:ipLocation/json`,
    method: GET,
  },
};
