export  class Authentication{
    public UserName: string;
    public EmailAddress: string;
    
    constructor(UserName: string, EmailAddress: string){
        this.UserName = UserName;
        this.EmailAddress = EmailAddress;
    }

}