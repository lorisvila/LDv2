export type API_ErrorReason =
  'API_INTERN_ERROR' |
  'BAD_REQUEST' |
  'REQUEST_VALUES_MISSING' |
  'EXPIRED_TOKEN' |
  'INVALID_TOKEN' |
  'BAD_CREDENTIALS' |
  'INVALID_TOKEN' |
  'TABLE_NOT_FOUND' |
  'USER_ROLE_INSUFFICIENT' |
  'USER_ALREADY_EXISTS' |
  'ENTRY_ALREADY_EXISTS' |
  'DATABASE_ERROR'

export class API_Error extends Error {
  name: API_ErrorReason;
  message: string;
  code: number;
  cause: any;

  constructor(name: API_ErrorReason, message: string, args?: {code?: number, cause?: any}) {
    super();
    this.name = name;
    this.message = message;
    this.cause = args?.cause;
    this.code = args?.code ? args.code : 500; // By default it is a error 500
  }
}
