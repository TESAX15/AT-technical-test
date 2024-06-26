import { Pages } from '../../interfaces/pagination/pages';

export interface ResponseContentDTO<T> {
  statusCode: 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500;
  statusMessage:
    | 'OK'
    | 'Created'
    | 'Bad Request'
    | 'Unauthorized'
    | 'Forbidden'
    | 'Not Found'
    | 'Conflict'
    | 'Internal Server Error';
  isErrorMessage: boolean;
  message: string;
  data?: T;
  paginationPages?: Pages;
}
