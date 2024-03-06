import axios from 'axios';
import { config } from '../../../app/config/index';
import { IntegrationApiCall, getURLEndpoint } from '../integrations.service';
import { ResponseAccessToken, paypalEndpoints } from './paypal.schemas';

class PayPalIntegration {
  clientId: string;
  clientSecret: string;
  constructor() {
    this.clientId = String(config.implementations.paypal.clientId);
    this.clientSecret = String(config.implementations.paypal.clientSecret);
  }

  private async makeApiCall<T>({
    action,
    body,
    urlParams = {},
    queryParams = {},
  }: IntegrationApiCall): Promise<T> {
    const url = getURLEndpoint({
      endpoint: paypalEndpoints[action].endpoint,
      urlParams: urlParams,
      queryParams: queryParams,
    });

    try {
      const response = await axios.request({
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: paypalEndpoints[action].method,
        url: url,
        data: body,
      });
      return response.data;
    } catch (err: any) {
      return err;
    }
  }

  /** Retrieve access_token */
  public async getAccessToken(): Promise<ResponseAccessToken> {
    return await this.makeApiCall({
      action: 'getAccessToken',
      body: {
        grant_type: 'client_credentials',
      },
    });
  }
}
// copy account with correct type
export default PayPalIntegration;
