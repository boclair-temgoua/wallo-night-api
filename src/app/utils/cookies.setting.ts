export type Env = 'local' | 'prod' | 'dev' | 'test';

/** Get the correct cookie settings based on environment */
export const getCookieSettings = (env: string) =>
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
    domain: '.botipo.com',
    sameSite: 'none',
  },
  test: {
    httpOnly: true,
    secure: true,
    domain: '.botipo.com',
    sameSite: 'none',
  },
};
