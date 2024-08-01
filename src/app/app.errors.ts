export class AppError extends Error {

  override name: AppErrorReason;
  override message: string;

  constructor(name: AppErrorReason, message?: string) {
    super();
    this.name = name;
    this.message = message ? message : '';
  }

}
export type AppErrorReason = 'NO_DATA_FROM_API'
