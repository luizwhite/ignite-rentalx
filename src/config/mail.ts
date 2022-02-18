interface IMailConfig {
  driver: 'ethereal' | 'amazonSES';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

const mailConfig: IMailConfig = {
  driver: (process.env.MAIL_DRIVER as IMailConfig['driver']) || 'ethereal',

  defaults: {
    from: {
      email: 'admin@devluiz.me',
      name: 'Luiz Augusto',
    },
  },
};

export default mailConfig;
