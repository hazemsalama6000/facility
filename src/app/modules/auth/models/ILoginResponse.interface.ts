export interface ILoginResponseInterface
{
     token: string ,
     refreshToken?: string ,
     jobId?:string ,
     success?:string,
     errors?:Array<string>,
}