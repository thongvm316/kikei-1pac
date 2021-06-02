const convertPagination = (pagination) => {
  return {
    defaultCurrent: 1,
    current: pagination.currentPage,
    total: pagination.total,
    defaultPageSize: 30,
    pageSize: pagination.perPage,
    position: 'top'
  }
}

export { convertPagination }
