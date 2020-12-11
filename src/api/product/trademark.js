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
  addPageList(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  /*
  修改
  */
  updatePageList(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
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
