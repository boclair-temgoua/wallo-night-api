import { config } from '../config/index';

/*************** Setting user cookie *************************/
export const validation_code_verification_cookie_setting = {
  withCredentials: true,
  maxAge: Number(config.cookie_access.firstStepExpire),
  httpOnly: false,
  sameSite: 'none',
  secure: true,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  httpOnly: false,
  sameSite: 'None',
  secure: true,
};

export const expire_cookie_setting = {
  withCredentials: true,
  httpOnly: false,
  sameSite: 'none',
  secure: true,
  // domain: '',
  // sameSite: '',
};
