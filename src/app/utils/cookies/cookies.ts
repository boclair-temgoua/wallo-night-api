import { config } from '../../config/index';
import { cookieSettings } from './cookie-settings';

/*************** Setting user cookie *************************/
export const validation_verify_cookie_setting = {
  maxAge: Number(config.cookie_access.verifyExpire),
  ...cookieSettings,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  ...cookieSettings,
};
