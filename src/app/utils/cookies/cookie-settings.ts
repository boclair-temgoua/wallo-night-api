import { config } from '../../config/index';

type Env = 'local' | 'prod' | 'test';
export const cookieSettings = (env: string) =>
  env in settingsMap ? settingsMap[(env as Env) ?? 'prod'] : settingsMap.local;

const settingsMap: {
  [Key in Env]: {
    httpOnly: boolean;
    secure: boolean;
    domain?: string;
    sameSite: 'none' | 'lax';
  };
} = {
  local: {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
  },
  prod: {
    httpOnly: true,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
  test: {
    httpOnly: true,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
};
