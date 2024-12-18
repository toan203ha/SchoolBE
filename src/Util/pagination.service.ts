import { PrismaService } from "src/prisma/prisma.service";
import APIFeatures from "./apiFeatures";

export async function getPaginatedData(
  prisma: PrismaService,
  query: any,
  modelName: string,
  includeOptions: any = {},
  extraFilters: any = {},
) {
  const page = parseInt(query.page, 10) || 1;

  // Lấy giá trị limit từ query, không dùng giá trị mặc định
  const limit = parseInt(query.limit, 10) || 10;  
  if (isNaN(limit) || limit <= 0) {
    return {
      success: false,
      message: 'Invalid limit value',
    };
  }

  // Điều kiện lọc
  const whereClause = { ...extraFilters };

  // Tổng số bản ghi
  const itemsCount = await prisma[modelName].count({ where: whereClause });
  const totalPages = Math.ceil(itemsCount / limit);

  // Kiểm tra số trang hợp lệ
  if (page > totalPages) {
    return {
      success: false,
      message: 'Invalid page number',
    };
  }

  // Áp dụng các chức năng lọc, giới hạn và phân trang
  const apiFeatures = new APIFeatures({ where: whereClause }, query)
    .search()
    .filter()
    .limit()  
    .sort()
    .pagination(limit); 

  // Lấy dữ liệu từ Prisma
  const items = await prisma[modelName].findMany({
    ...apiFeatures.query,
    select: includeOptions,
    skip: (page - 1) * limit,
    take: limit, 
  });

  const filteredItemsCount = items.length;

  return {
    success: Boolean(items),
    metadata: {
      itemsCount,
      totalPages,
      currentPage: page,
      resPerPage: limit, // Thông tin trả về phản ánh limit thực tế
      filteredItemsCount,
    },
    data: items ?? 'No data found!',
  };
}
