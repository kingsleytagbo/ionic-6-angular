
export class UserOptions {
  id:string;
  username: string;
  emailaddress: string;
  constructor(id:string, username: string, emailaddress: string) {
    this.id = id;
    this.username = username;
    this.emailaddress = emailaddress;
  }
}