import { config } from '../../../app/config/index';
import { nodeMailServiceAdapter } from '../../integrations/node-mailer-service-adapter';
// import { NodeMailServiceAdapter } from '../../integrations/aws/node-mailer-service-adapter';

export const orderCommissionMail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const output = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
  </head>

  <body
    style="
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      position: relative;
      -webkit-text-size-adjust: none;
      background-color: #ffffff;
      color: #718096;
      height: 100%;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      width: 100% !important;
    "
  >
    <style>
      @media only screen and (max-width: 600px) {
        .inner-body {
          width: 100% !important;
        }

        .footer {
          width: 100% !important;
        }
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
        }
      }
    </style>
    <table
      style="
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol';
        position: relative;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        -premailer-width: 100%;
        background-color: #edf2f7;
        margin: 0;
        padding: 0;
        width: 100%;
      "
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      width="100%"
      class="wrapper"
    >
      <tbody>
        <tr>
          <td
            style="
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji', 'Segoe UI Symbol';
              position: relative;
            "
            align="center"
          >
            <table
              style="
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                  Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                  'Segoe UI Emoji', 'Segoe UI Symbol';
                position: relative;
                -premailer-cellpadding: 0;
                -premailer-cellspacing: 0;
                -premailer-width: 100%;
                margin: 0;
                padding: 0;
                width: 100%;
              "
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              width="100%"
              class="content"
            >
              <tbody>
                <tr>
                  <td
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                      padding: 25px 0;
                      text-align: center;
                    "
                    class="header"
                  ></td>
                </tr>

                <tr>
                  <td
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      -premailer-width: 100%;
                      background-color: #edf2f7;
                      border-bottom: 1px solid #edf2f7;
                      border-top: 1px solid #edf2f7;
                      margin: 0;
                      padding: 0;
                      width: 100%;
                    "
                    cellspacing="0"
                    cellpadding="0"
                    width="100%"
                    class="body"
                  >
                    <table
                      style="
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                          'Apple Color Emoji', 'Segoe UI Emoji',
                          'Segoe UI Symbol';
                        position: relative;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        -premailer-width: 570px;
                        background-color: #ffffff;
                        border-color: #e8e5ef;
                        border-radius: 2px;
                        border-width: 1px;
                        box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025),
                          2px 4px 0 rgba(0, 0, 150, 0.015);
                        margin: 0 auto;
                        padding: 0;
                        width: 570px;
                      "
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      width="570"
                      align="center"
                      class="inner-body"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              box-sizing: border-box;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji',
                                'Segoe UI Symbol';
                              position: relative;
                              max-width: 100vw;
                              padding: 32px;
                            "
                            class="content-cell"
                          >
                            <div style="text-align: center">
                              <img
                                alt="UnoPot logo"
                                src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo-symbol.svg"
                                class="CToWUd a6T"
                                data-bit="iit"
                                tabindex="0"
                                width="50px"
                                height="50px"
                              />
                            </div>
                            <h2
                              style="
                                text-align: center;
                                color: #0d0c22;
                                font-family: Helvetica Neue Roman, Arial,
                                  sans-serif, 'Open Sans';
                              "
                            >
                              Overdue balance
                            </h2>
                            <span style="font-size: 16px">
                              type specimen book. It has survived not only five
                              centuries, but also the leap into electronic
                              typesetting, remaining essentially unchanged. It
                              was popularised in the 1960s with the release of
                              Letraset sheets containing Lorem Ipsum passages,
                              and more recent </span
                            ><br /><br />
                            <span style="font-size: 20px">
                              <strong> Oder detail </strong> </span
                            ><br />

                            <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 10px;
                                padding-top: 10px;
                              "
                            >
                              <tr
                                style="
                                  border-bottom: 1px solid #eee;
                                  font-size: 16px;
                                "
                              >
                                <td>
                                  <span>Usage charges for 2024-10-01</span>
                                </td>
                                <td style="float: right">19.00 $</td>
                              </tr>
                            </table>

                            <!-- <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 10px;
                                padding-top: 10px;
                              "
                            >
                              <tr
                                style="
                                  border-bottom: 1px solid #eee;
                                  font-size: 16px;
                                "
                              >
                                <td>Tax (Taxes)</td>
                                <td style="float: right">-</td>
                              </tr>
                            </table> -->

                            <!-- <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 10px;
                                padding-top: 10px;
                              "
                            >
                              <tr
                                style="
                                  border-bottom: 1px solid #eee;
                                  font-size: 16px;
                                "
                              >
                                <td>Subtotal</td>
                                <td style="float: right">19.00 $</td>
                              </tr>
                            </table> -->
                            <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 10px;
                                padding-top: 10px;
                              "
                            >
                              <tr style="color: #0d0c22">
                                <td>
                                  <span style="font-size: 25px">
                                    <strong> Total </strong>
                                  </span>
                                </td>
                                <td style="float: right">
                                  <span style="font-size: 18px">
                                    <strong> 19.00 $ </strong>
                                  </span>
                                </td>
                              </tr>
                            </table>
                            <br />

                            <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 2px;
                                padding-top: 25px;
                              "
                            >
                              <tr>
                                <td colspan="2">
                                  <a
                                    style="
                                      background: #0069ff;
                                      border-radius: 3px;
                                      border: 1px solid #0069ff;
                                      color: #fff !important;
                                      display: inline-block;
                                      height: 3rem;
                                      line-height: 3rem;
                                      text-align: center;
                                      text-decoration: none;
                                      width: 100%;
                                    "
                                    href="#"
                                    data-saferedirecturl="${config.datasite.urlClient}/reset-password/${token}"
                                    >Go To Payment</a
                                  >
                                </td>
                              </tr>
                            </table>

                            <table
                              class="subcopy"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                border-top: 1px solid #e8e5ef;
                                margin-top: 25px;
                                padding-top: 25px;
                              "
                            >
                              <tr>
                                <td
                                  style="
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Roboto,
                                      Helvetica, Arial, sans-serif,
                                      'Apple Color Emoji', 'Segoe UI Emoji',
                                      'Segoe UI Symbol';
                                    position: relative;
                                  "
                                >
                                  <p
                                    style="
                                      box-sizing: border-box;
                                      font-family: -apple-system,
                                        BlinkMacSystemFont, 'Segoe UI', Roboto,
                                        Helvetica, Arial, sans-serif,
                                        'Apple Color Emoji', 'Segoe UI Emoji',
                                        'Segoe UI Symbol';
                                      position: relative;
                                      line-height: 1.5em;
                                      margin-top: 0;
                                      text-align: left;
                                      font-size: 14px;
                                    "
                                  >
                                    If you’re having trouble clicking the "Go To
                                    Payment" button, copy and paste the URL
                                    below into your web browser:
                                    <span
                                      class="break-all"
                                      style="
                                        box-sizing: border-box;
                                        font-family: -apple-system,
                                          BlinkMacSystemFont, 'Segoe UI', Roboto,
                                          Helvetica, Arial, sans-serif,
                                          'Apple Color Emoji', 'Segoe UI Emoji',
                                          'Segoe UI Symbol';
                                        position: relative;
                                        word-break: break-all;
                                      "
                                    >
                                      <a
                                        data-saferedirecturl="${config.datasite.urlClient}/reset-password/${token}"
                                        href="${config.datasite.urlClient}/account/billing"
                                        style="
                                          box-sizing: border-box;
                                          font-family: -apple-system,
                                            BlinkMacSystemFont, 'Segoe UI',
                                            Roboto, Helvetica, Arial, sans-serif,
                                            'Apple Color Emoji',
                                            'Segoe UI Emoji', 'Segoe UI Symbol';
                                          position: relative;
                                          color: #3869d4;
                                        "
                                      >
                                        ${config.datasite.urlClient}/account/billing
                                      </a></span
                                    >
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                    "
                  >
                    <table
                      style="
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                          'Apple Color Emoji', 'Segoe UI Emoji',
                          'Segoe UI Symbol';
                        position: relative;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        -premailer-width: 570px;
                        margin: 0 auto;
                        padding: 0;
                        text-align: center;
                        width: 570px;
                      "
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      width="570"
                      align="center"
                      class="footer"
                    >
                      <tbody>
                        <tr></tr>
                        <tr>
                          <td
                            style="
                              font-family: Montserrat, -apple-system, 'Segoe UI',
                                sans-serif;
                              font-size: 12px;
                              padding-left: 48px;
                              padding-right: 48px;
                              --text-opacity: 1;
                              color: #eceff1;
                              color: rgba(236, 239, 241, var(--text-opacity));
                              padding: 20px;
                            "
                          >
                            <p
                              style="
                                --text-opacity: 1;
                                color: #263238;
                                color: rgba(38, 50, 56, var(--text-opacity));
                              "
                            >
                              Use of our service and website is subject to our
                              <a
                                style="
                                  --text-opacity: 1;
                                  color: #7367f0;
                                  color: rgba(
                                    115,
                                    103,
                                    240,
                                    var(--text-opacity)
                                  );
                                  text-decoration: none;
                                "
                                class="hover-underline"
                                href="http://localhost:3000/terms-condition"
                                >Terms of Use</a
                              >
                              and
                              <a
                                style="
                                  --text-opacity: 1;
                                  color: #7367f0;
                                  color: rgba(
                                    115,
                                    103,
                                    240,
                                    var(--text-opacity)
                                  );
                                  text-decoration: none;
                                "
                                class="hover-underline"
                                href="http://localhost:3000/privacy-policy"
                                >Privacy Policy</a
                              >.
                            </p>
                            <p
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                line-height: 1.5em;
                                margin-top: 0;
                                color: #b0adc5;
                                font-size: 12px;
                                text-align: center;
                              "
                            >
                              © 2024 - 2024 UnoPot. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
      `;
  // create reusable transporter object using the default SMTP transport
  await nodeMailServiceAdapter({
    from: `${config.implementations.resendSMTP.noReplayFrom}`,
    to: [`${email}`],
    subject: `${config.datasite.name} - Reset password`,
    html: output,
  });
};
