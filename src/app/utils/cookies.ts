import { config } from '../config/index';
import { getCookieSettings } from './cookies.setting';
const cookieSettings = getCookieSettings(config.environment);

/*************** Setting user cookie *************************/
export const validation_code_verification_cookie_setting = {
  withCredentials: true,
  maxAge: Number(config.cookie_access.firstStepExpire),
  ...cookieSettings,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  ...cookieSettings,
};

export const expire_cookie_setting = {
  ...cookieSettings,
};
