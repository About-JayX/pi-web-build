import { userApi } from "@/config/axios";

// 市场相关接口
export const MarketAPI = {
  // 代币数据统计
  getTokenData: () => {
    return userApi.post("/web/tokens/market-data");
  },
  // 市场列表
  getMarketList: ({
    page = 1,
    pageSize = 10,
    orderBy = "all",
    search = "",
  }: {
    page?: number;
    pageSize?: number;
    orderBy?: "Deployed" | "Volume_24" | "all";
    search?: string;
    where?: {
      Address?: string;
    };
  }) => {
    return userApi.post(
      "/web/tokens/market-list",
      Object.assign(
        {},
        {
          page,
          pageSize,
          orderBy: orderBy === "all" ? "" : orderBy,
        },
        search && search !== "" && { search }
      )
    );
  },
};

export default MarketAPI;
