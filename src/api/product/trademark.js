import request from "@/utils/request";
// 公共路径
const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取订单分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  /*
  新增
  */
  addPageList(banner) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      body: {
        banner
      }
    });
  },
  /*
  修改
  */
  updatePageList(banner) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      body: {
        banner
      }
    });
  },
  /*
  删除
  */
  delatePageList(id) {
    return request({
      url: `${api_name}/remove${id}`,
      method: "DELATE"
    });
  }
};
