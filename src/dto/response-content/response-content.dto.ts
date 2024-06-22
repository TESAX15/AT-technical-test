export interface ResponseContentDTO<T> {
  statusCode: 200 | 201 | 400 | 401 | 404 | 409 | 500;
  statusMessage:
    | 'OK'
    | 'Created'
    | 'Bad Request'
    | 'Unauthorized'
    | 'Not Found'
    | 'Conflict'
    | 'Internal Server Error';
  message: string;
  data?: T;
}
