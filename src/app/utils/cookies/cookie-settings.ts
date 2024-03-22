import { Env, config } from '../../config/index';

export const cookieSettings = (env: string) =>
  env in settingsMap ? settingsMap[(env as Env) ?? 'local'] : settingsMap.local;

const settingsMap: {
  [Key in Env]: {
    httpOnly: false;
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
  test: {
    httpOnly: false,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
  prod: {
    httpOnly: false,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
};
