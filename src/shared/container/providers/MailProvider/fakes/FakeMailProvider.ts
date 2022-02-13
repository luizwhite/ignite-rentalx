import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../IMailProvider';

class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  async sendMail(data: ISendMailDTO): Promise<void> {
    this.messages.push(data);
  }
}

export { FakeMailProvider };
