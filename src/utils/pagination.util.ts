import { Pages } from '../interfaces/pagination/pages';

/**
 * Function to calculate if there are next or previous pages in a pagination
 * @param resultCount, number of total results for the model to be paginated
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns resultPagination, the pagination corresponding to the inputs provided
 */
function calculatePages(resultCount: number, page: number, limit: number): Pages {
  // The start and end indexes are calculated
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultPagination: Pages = {};

  // Verifies if there is a next page
  if (endIndex < resultCount) {
    resultPagination.next = {
      page: page + 1,
      limit: limit
    };
  }

  // Verifies if there is a previous page
  if (startIndex > 0) {
    resultPagination.previous = {
      page: page - 1,
      limit: limit
    };
  }

  return resultPagination;
}

/**
 * Function that validates the pagination parameters given and assigns a default value if they are not a positive number
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns the validated parameters for the pagination
 */
function validatePaginationParams(page: number, limit: number) {
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }
  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  return { page: page, limit: limit, skip: (page - 1) * limit };
}

export const paginationUtil = {
  calculatePages,
  validatePaginationParams
};
