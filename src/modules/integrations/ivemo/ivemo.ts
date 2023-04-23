import { configurations } from '../../../app/configurations/index';
import { getURLEndpoint, IntegrationApiCall } from '../integrations.service';
import { GetOneVoucherRequest, ivemo } from './ivemo.schemas';
import axios from 'axios';

class Ivemo {
  private async makeApiCall<T>({
    action,
    body,
    urlParams = {},
    queryParams = {},
  }: IntegrationApiCall): Promise<any> {
    const url: any = getURLEndpoint({
      endpoint: ivemo[action].endpoint,
      urlParams: urlParams,
      queryParams: queryParams,
    });

    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Basic ${configurations.implementations.ivemo.token}`;
      const { data } = await axios.request({
        method: ivemo[action].method,
        url: url,
        data: body,
      });
      return data;
    } catch (err) {
      return err;
    }
  }

  public async getOneCoupon(payload: GetOneVoucherRequest): Promise<any> {
    const { code } = payload;

    return await this.makeApiCall<GetOneVoucherRequest>({
      action: 'getOneCoupon',
      urlParams: { code },
    });
  }

  public async useOneCoupon(payload: GetOneVoucherRequest): Promise<any> {
    return await this.makeApiCall<GetOneVoucherRequest>({
      action: 'useOneCoupon',
      body: payload,
    });
  }
}

export default Ivemo;
