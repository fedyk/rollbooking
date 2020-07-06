export enum DEFAULT_ERRORS {
  INTERNAL_ERROR = "internal",
  AUTHENTICATION_ERROR = "authentication",
  NOT_FOUND_ERROR = "not_found",
  ALREADY_EXISTS_ERROR = "already_exists",
}

export class ErrorWithType extends Error {
  type: string | DEFAULT_ERRORS
  status?: number

  constructor(message: string, type: string, status?: number) {
    super(message);

    this.type = type
    this.status = status;
  }
}
