export const enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
}

export const ErrorCodes = {
  BAD_REQ: {
    code: 'AUTH-BE-BAD_REQ',
    message: 'Bad request',
    logLevel: LogLevel.ERROR,
  },

  DATA_NOT_FOUND: {
    code: 'AUTH-BE-DATA_NOT_FOUND',
    message: 'Data not found',
    logLevel: LogLevel.ERROR,
  },

  DATA_EXISTS: {
    code: 'AUTH-BE-DATA_EXIST',
    message: 'Data already exists',
    logLevel: LogLevel.ERROR,
  },
};
