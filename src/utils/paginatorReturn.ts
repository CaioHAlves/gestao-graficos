interface IPaginatorReturn<T = any> {
  array: T[],
  page?: number
  limit?: number
}

export const paginatorReturn = <T>({ array, limit = 10, page = 1 }: IPaginatorReturn<T>): T[] => {
  const pageApi = page
  const limitApi = limit
  const nextPage = limitApi * (pageApi - 1)

  return array.slice(nextPage, nextPage + limitApi)
}