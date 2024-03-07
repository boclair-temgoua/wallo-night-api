import axios from 'axios';
import { config } from '../../app/config/index';

const axiosIntegration = axios.create({
  baseURL: 'https://api-m.sandbox.paypal.com/v1',
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  auth: {
    username: config.implementations.paypal.clientId,
    password: config.implementations.paypal.clientSecret,
  },
});

export const getPayPalAccessToken = async () => {
  const options = {
    baseURL: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: config.implementations.paypal.clientId,
      password: config.implementations.paypal.clientSecret,
    },
    params: {
      grant_type: 'client_credentials',
    },
  };
  //const { status, data } = await axiosIntegration.post('/oauth2/token');
  const { status, data } = await axios(options);
  return data;
};
