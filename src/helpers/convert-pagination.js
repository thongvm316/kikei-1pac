const convertPagination = (pagination, position = 'top') => {
  return {
    defaultCurrent: 1,
    defaultPageSize: 30,
    current: pagination.pageNumber,
    total: pagination.totalRecords,
    totalPage: pagination.totalPages,
    pageSize: pagination.pageSize,
    position: position
  }
}

export { convertPagination }
