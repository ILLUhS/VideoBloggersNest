import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const getMailConfig = async (): Promise<any> => {
  const transport = process.env.EMAIL_TRANSPORT;
  const mailFromName = process.env.EMAIL_FROM_NAME;
  const mailFromAddress = process.env.EMAIL_LOGIN;

  return {
    transport,
    defaults: {
      from: `"${mailFromName}" <${mailFromAddress}>`,
    },
    template: {
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
};
