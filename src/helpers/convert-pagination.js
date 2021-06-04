const convertPagination = (pagination) => {
  return {
    defaultCurrent: 1,
    defaultPageSize: 30,
    current: pagination.pageNumber,
    total: pagination.totalRecords,
    pageSize: pagination.pageSize,
    position: 'top'
  }
}

export { convertPagination }
