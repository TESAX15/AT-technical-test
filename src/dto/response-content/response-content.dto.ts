export interface ResponseContentDTO<T> {
  statusCode: 200 | 201 | 401 | 404 | 409 | 500;
  statusMessage:
    | 'OK'
    | 'Created'
    | 'Unauthorized'
    | 'Not Found'
    | 'Conflict'
    | 'Internal Server Error';
  message: string;
  data?: T;
}
