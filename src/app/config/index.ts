import * as dotenv from 'dotenv';
import { TypeDatabase } from '../databases/orm';
dotenv.config();

export type Env = 'local' | 'prod' | 'dev' | 'test';

export const config = {
  /**
   * Url site
   */
  url: {
    client: process.env.NODE_CLIENT_URL,
    serverUrl: process.env.NODE_SERVER_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    dashboard: process.env.NODE_DASHBOARD_URL,
  },
  /**
   * Node environment
   */
  environment: process.env.NODE_ENV || 'local',
  /**
   * Cookie configuration
   */
  cookieKey: process.env.COOKIE_KEY || '@3%NE8IksyHK4yC5POFurDCAVW@FqxBe',
  cookie_access: {
    jwtUser: process.env.COOKIE_JWT_USER || 'jwt-access-user',
    domain: process.env.COOKIE_DOMAIN || '.unopot.com',
    nameLogin: process.env.COOKIE_NAME_LOGIN || 'x-user',
    accessExpire: process.env.COOKIE_ACCESS_EXPIRE || '10000000000', //32000000000 10000000000
    jwtVerify: process.env.COOKIE_JWT_USER || 'jwt-access-verify',
    namVerify: process.env.COOKIE_NAME_VERIFY || 'x-verify',
    verifyExpire: process.env.COOKIE_VERIFY_EXPIRE || '96400000',
  },
  /**
   * Site
   */
  datasite: {
    amount: {
      minAmount: Number(process.env.MIN_AMOUNT) || 2,
      maxAmount: Number(process.env.MAX_AMOUNT) || 400,
    },
    name: process.env.NODE_NAME,
    url: process.env.NODE_APP_URL,
    pricingBilling: Number(process.env.PRICING_BILLING_VOUCHER),
    urlClient: process.env.NODE_CLIENT_URL,
    email: process.env.MAIL_FROM_ADDRESS,
    daysOneMonth: Number(process.env.DAYS_ONE_MONTH_contributor),
    amountOneMonth: Number(process.env.AMOUNT_ONE_MONTH_contributor),
    emailNoreply: process.env.MAIL_FROM_NO_REPLAY_ADDRESS,
  },
  /**
   * Organization
   */
  organizationAddress: {
    name: 'UnPot',
    company: 'UnPot',
    street1: 'Via della costa 13',
    street2: '',
    city: 'Vigevano',
    zip: '20156',
    country: 'IT',
    phone: '+393425712192',
    email: 'info@birevo.com',
  },
  /**
   * Job
   */
  job: {
    start: process.env.JOB_START ?? 'true',
  },

  /**
   * Api
   */
  api: {
    prefix: '/api',
    version: process.env.API_VERSION,
    headerSecretKey: process.env.HEADER_API_SECRET_KEY,
  },
  /**
   * Server port
   */
  port: process.env.PORT || 5500,
  /**
   * Database
   */
  database: {
    url: process.env.DATABASE_URL,
    postgres: {
      type: 'postgres' as TypeDatabase,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_DB,
      ssl: process.env.POSTGRES_SSL,
      logging: process.env.POSTGRES_LOG,
    },
  },
  /**
   * Show or not console.log
   */
  showLog: true,

  /**
   * External implementations
   */
  implementations: {
    /**
     * Twilio
     */
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      verifySid: process.env.TWILIO_VERIFY_SID,
    },
    /**
     * Stripe
     */
    stripe: {
      privateKey: process.env.STRIPE_PRIVATE_KEY,
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    },
    /**
     * mailSMTP
     */
    mailSMTP: {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    /**
     * Amqp
     */
    amqp: {
      link: process.env.AMQP_LINK,
    },
    /**
     * Ipapi
     */
    ipapi: {
      link: process.env.IPAPI_LINK,
      apiKey: process.env.IPAPI_KEY,
    },
    /**
     * Ip-api
     */
    ip_api: {
      link: process.env.IP_API_LINK,
    },
    /**
     * Sentry
     */
    sentry: process.env.SENTRY_DNS,
    /**
     * Resend smtp
     */
    resendSMTP: {
      apiKey: process.env.RESEND_SMTP_API_KEY,
      noReplayFrom:
        process.env.RESEND_FROM_NO_REPLAY_ADDRESS || 'no-reply@unopot.com',
    },
    /**
     * PayPal
     */
    paypal: {
      url: process.env.PAYPAL_URL,
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    /**
     * Amazon s3
     */
    aws: {
      bucket: process.env.AWS_BUCKET,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_ACCESS_SECRET_KEY,
      refreshToken: process.env.AWS_REFRESH_TOKEN,
      clientId: process.env.AWS_CLIENT_ID,
      clientSecret: process.env.AWS_CLIENT_SECRET,
      region: process.env.AWS_REGION_NAME,
      auth: {
        host: 'https://api.amazon.com',
      },
      sts: {
        host: 'sts.eu-west-1.amazonaws.com',
        service: 'sts',
      },
      cloudfront: {
        url: process.env.AWS_CLOUD_FRONT_URL,
      },
      executeApi: {
        host: 'sellingpartnerapi-eu.amazon.com',
        service: 'execute-api',
      },
    },
    /**
     * Google
     */
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
};
