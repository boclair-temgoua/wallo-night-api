import { configurations } from '../../../app/configurations/index';
import { getURLEndpoint, IntegrationApiCall } from '../integrations.service';
import { ipapies } from './ipapi.schemas';
import axios from 'axios';

class Ipapi {
  apiKey: string;
  constructor() {
    this.apiKey = String(configurations.implementations.ipapi.apiKey);
  }

  private async makeApiCall<T>({
    action,
    body,
    urlParams = {},
    queryParams = {},
  }: IntegrationApiCall): Promise<any> {
    const url: any = getURLEndpoint({
      endpoint: ipapies[action].endpoint,
      urlParams: urlParams,
      queryParams: queryParams,
    });

    try {
      const { data } = await axios.request({
        method: ipapies[action].method,
        url: url,
        data: body,
      });
      return data;
    } catch (err) {
      return err;
    }
  }

  public async getOnIpLocation(options: { ipLocation: string }): Promise<any> {
    const { ipLocation } = options;

    return await this.makeApiCall<any>({
      action: 'getOnIpLocation',
      urlParams: { ipLocation },
    });
  }
}

export default Ipapi;
