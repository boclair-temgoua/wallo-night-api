import * as geoip from 'geoip-lite';
import { murmurhash2_x86_32, murmurhash3_x64_128 } from 'number-generator';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export * from './formate-date';

export interface KeyAsString {
  [key: string]: string;
}

export const colorsArrays = ['indigo', 'red'];
export const colorsArraysTransaction = [
  'indigo',
  'red',
  'blue',
  'orange',
  'yellow',
  'green',
];
export type Color = 'indigo' | 'red';

export const capitalizeName = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const capitalizeFirstLetter = (
  firstItem: string,
  secondItem: string,
) => {
  return (
    capitalizeName(firstItem).charAt(0) + capitalizeName(secondItem).charAt(0)
  ).toUpperCase();
};

export const capitalizeOneFirstLetter = (firstItem: string) => {
  return capitalizeName(firstItem).charAt(0).toUpperCase();
};

export const checkIfNumberOrEmpty = (property: number) => {
  return !isNaN(property) && Number(property) > 0;
};

export const generateUUID = () => {
  return uuidv4();
};

export const generateCouponCode = (length: number) => {
  let result = '';
  const generator = murmurhash3_x64_128(`${generateUUID}`);
  const characters =
    `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${generator}`.toUpperCase();
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateLongUUID = (length: number) => {
  let result = '';
  const generator = murmurhash3_x64_128(`${generateUUID}`);
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${generator}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateNumber = (length: number) => {
  let result = '';

  const generator = murmurhash2_x86_32(`${generateUUID}`);
  const characters = `0123456789${generator}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isNotUndefined = (input: string): boolean =>
  String(input) !== String(undefined) && input.trim() !== '';

export const Slug = (input: string): string =>
  slugify(input, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });

export const isEmpty = (strValue: string) => {
  const strValueString = String(strValue);
  return (
    strValueString.trim() === '' ||
    strValueString.trim().length === 0 ||
    !strValueString
  );
};

export const getIpRequest = (req) => {
  let ipAddress = req.headers['x-real-ip'] as string;
  const forwardedFor = req.headers['x-forwarded-for'] as string;
  if (!ipAddress && forwardedFor) {
    ipAddress = forwardedFor?.split(',').at(0) ?? 'Unknown';
  }
  return ipAddress ?? req.socket?.remoteAddres;
};

export const geoIpRequest = (ip: string) => {
  return geoip.lookup(ip);
};
