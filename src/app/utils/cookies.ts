import { Env, config } from '../config/index';

const cookieSettings = (env: string) =>
  env in settingsMap ? settingsMap[(env as Env) ?? 'dev'] : settingsMap.dev;

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
  dev: {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
  },
  prod: {
    httpOnly: false,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
  test: {
    httpOnly: false,
    secure: true,
    domain: config.cookie_access.domain,
    sameSite: 'none',
  },
};

/*************** Setting user cookie *************************/
export const validation_verify_cookie_setting = {
  maxAge: Number(config.cookie_access.verifyExpire),
  ...cookieSettings,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  ...cookieSettings,
};
