export interface ResponseContentDTO {
  statusCode: 200 | 201 | 409 | 500;
  statusMessage: 'OK' | 'Created' | 'Conflict' | 'Internal Server Error';
  message: string;
}
