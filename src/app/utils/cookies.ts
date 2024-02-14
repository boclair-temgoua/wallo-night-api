import { config } from '../config/index';

/*************** Setting user cookie *************************/
export const validation_code_verification_cookie_setting = {
  maxAge: Number(config.cookie_access.firstStepExpire),
  httpOnly: true,
};

export const validation_login_cookie_setting = {
  maxAge: Number(config.cookie_access.accessExpire),
  httpOnly: false,
  secure: true,
  // domain: '',
  sameSite: 'None',
};

export const expire_cookie_setting = {
  httpOnly: true,
  secure: true,
  // domain: '',
  // sameSite: '',
};
