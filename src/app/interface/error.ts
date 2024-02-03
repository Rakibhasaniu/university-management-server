export type TErrorSource = {
    path: string | number;
    message: string;
  }[]

 export type TReturn = {
    statusCode: number;
    message: string;
    errorSources : TErrorSource;
}