import { config } from '../../config/index';
import { Env, cookieSettings } from './cookie-settings';
const cookieSetting = cookieSettings(config?.environment as Env);

/*************** Setting user cookie *************************/
export const validation_verify_cookie_setting = {
  maxAge: Number(config.cookie_access.verifyExpire),
  ...cookieSetting,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  ...cookieSetting,
};
