interface ObjectPagination {
  currentPage: number,
  limitItem: number,
  totalPage?:number,
  skip?:number
}
const paginationHelper = (objectPagination:ObjectPagination, query:Record<string,any>, count:number):ObjectPagination => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page)
  }

  if (query.limit) {
    objectPagination.limitItem = parseInt(query.limit)
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem

  const totalPage = Math.ceil(count / objectPagination.limitItem)//làm tròn lên
  objectPagination.totalPage = totalPage
  return objectPagination
}

export default paginationHelper;