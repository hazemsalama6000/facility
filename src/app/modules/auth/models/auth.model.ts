export class AuthModel {
  token: string;
  userId:string;
  refreshToken: string;
  expiresOn: Date;

  setAuth(auth: AuthModel) {
    this.token = auth.token;
    this.refreshToken = auth.refreshToken;
    this.expiresOn = auth.expiresOn;
    this.userId = auth.userId;
  }
}
