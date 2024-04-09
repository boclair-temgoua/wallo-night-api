import { config } from '../../../app/config';
import { nodeMailServiceAdapter } from '../../integrations/node-mailer-service-adapter';

export const conversationMessageMail = async ({
  email,
  fullName,
  description,
  fkConversationId,
}: {
  email: string;
  fullName: string;
  description: string;
  fkConversationId: string;
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
        class="wrapper"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
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
      >
        <tr>
          <td
            align="center"
            style="
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji', 'Segoe UI Symbol';
              position: relative;
            "
          >
            <table
              class="content"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                  Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                  'Segoe UI Emoji', 'Segoe UI Symbol';
                position: relative;
                -premailer-cellpadding: 0;
                -premailer-cellspacing: 0;
                -premailer-width: 100%;
                margin: 0;
                padding: 0;
                width: 100%;
              "
            >
              <tr>
                <td
                  class="header"
                  style="
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                      'Segoe UI Emoji', 'Segoe UI Symbol';
                    position: relative;
                    padding: 25px 0;
                    text-align: center;
                  "
                ></td>
              </tr>
  
              <!-- Email Body -->
              <tr>
                <td
                  class="body"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                      'Segoe UI Emoji', 'Segoe UI Symbol';
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
                >
                  <table
                    class="inner-body"
                    align="center"
                    width="570"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji', 'Segoe UI Symbol';
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
                  >
                    <!-- Body content -->
                    <tr>
                      <td
                        class="content-cell"
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
                            font-family: Helvetica Neue Roman, Arial, sans-serif,
                              'Open Sans';
                          "
                        >
                         New message from ${fullName}
                        </h2>

                        <div
                        style="
                          box-sizing: border-box;
                          padding-top: 0rem;
                          padding-right: 0rem;
                          padding-bottom: 0rem;
                          padding-left: 0rem;
                          margin-top: 1.5rem;
                          margin-right: 0rem;
                          margin-bottom: 0rem;
                          margin-left: 0rem;
                        "
                      >
                        <span
                          color="gray1"
                          style="
                            color: #241e12;
                            font-family: aktiv-grotesk, sans-serif;
                            margin: 0;
                            text-align: left;
                            font-weight: 400;
                            font-size: 1rem;
                            line-height: 1.5;
                          "
                          ><div>
                            <p>
                            ${description}
                            </p>
                          </div></span
                        >
                      </div>

                        
                        <table
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          align="center"
                          width="100%"
                          style="
                            box-sizing: border-box;
                            border-spacing: 0;
                            border-collapse: collapse;
                            width: 100% !important;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji' !important;
                          "
                        >
                          <tbody>
                            <tr
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              "
                            >
                              <td
                                align="center"
                                style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                  padding: 0;
                                "
                              >
                                <a
                                  href="${config.datasite.urlClient}/messages/${fkConversationId}"
                                  rel="noopener noreferrer"
                                  style="
                                    background-color: #4184f3 !important;
                                    box-sizing: border-box;
                                    color: #fff;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: inherit;
                                    font-weight: 500;
                                    line-height: 1.5;
                                    white-space: nowrap;
                                    vertical-align: middle;
                                    border-radius: 0.5em;
                                    font-family: -apple-system, BlinkMacSystemFont,
                                      'Segoe UI', Helvetica, Arial, sans-serif,
                                      'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                    padding: 0.75em 1.5em;
                                    border: 1px solid #4184f3;
                                  "
                                  target="_blank"
                                  >View message</a
                                >
                              </td>
                            </tr>
                          </tbody>
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
                              'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji',
                              'Segoe UI Symbol';
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
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji',
                                  'Segoe UI Symbol';
                                position: relative;
                              "
                            >
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
              <tr>
                <td
                  style="
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                      'Segoe UI Emoji', 'Segoe UI Symbol';
                    position: relative;
                  "
                >
                  <table
                    class="footer"
                    align="center"
                    width="570"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      -premailer-width: 570px;
                      margin: 0 auto;
                      padding: 0;
                      text-align: center;
                      width: 570px;
                    "
                  >
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
                            href="${config.datasite.urlClient}/terms-condition"
                            data-saferedirecturl="${config.datasite.urlClient}/terms-condition"
                            class="hover-underline"
                            style="
                              --text-opacity: 1;
                              color: #7367f0;
                              color: rgba(115, 103, 240, var(--text-opacity));
                              text-decoration: none;
                            "
                            >Terms of Use</a
                          >
                          and
                          <a
                            href="${config.datasite.urlClient}/privacy-policy"
                            data-saferedirecturl="${config.datasite.urlClient}/privacy-policy"
                            class="hover-underline"
                            style="
                              --text-opacity: 1;
                              color: #7367f0;
                              color: rgba(115, 103, 240, var(--text-opacity));
                              text-decoration: none;
                            "
                            >Privacy Policy</a
                          >.
                        </p>
                        <p
                          style="
                            box-sizing: border-box;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji',
                              'Segoe UI Symbol';
                            position: relative;
                            line-height: 1.5em;
                            margin-top: 0;
                            color: #b0adc5;
                            font-size: 12px;
                            text-align: center;
                          "
                        >
                          © 2024 - ${new Date().getFullYear()} ${
                            config.datasite.name
                          }. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
      `;

  await nodeMailServiceAdapter({
    from: `${config.implementations.resendSMTP.noReplayFrom}`,
    to: [`${email}`],
    subject: `New message from ${fullName}`,
    html: output,
  });
};
