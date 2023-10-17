import axios from 'axios';

const axiosIntegration = axios.create({
  baseURL: `https://cdn.taux.live/api/latest.json`,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'it-it',
    'Content-type': 'application/json',
  },
});

const getValueCurrencyLiveApi = async (): Promise<{
  table: string;
  rates: any;
  lastupdate: string;
}> => {
  const { data } = await axiosIntegration.get(`/`);

  return data;
};
export { getValueCurrencyLiveApi };
