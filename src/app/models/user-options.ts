
export class UserOptions {
  id:string;
  UserName: string;
  EmailAddress: string;
  constructor(id:string, UserName: string, EmailAddress: string) {
    this.id = id;
    this.UserName = UserName;
    this.EmailAddress = EmailAddress;
  }
}