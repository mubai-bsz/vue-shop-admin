<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
          <!-- 作用域插槽的使用，其中scope指的是所有的数据
          scope.row.指的是当前行的数据
           -->
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size="limit"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入api接口,这只是其中的一中方法而已，第二种方法是不用引入，直接使用，这是因为在main.js中，已经在Vue的原型上定义了接口了
// import { trademark } from "@/api";
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 0,
    };
  },
  methods: {
    // handleSizeChange(limit) {
    //   this.limit = limit;
    //   this.getPageList(this.page, this.limit);
    // },
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getPageList(this.page, this.limit);
    // },
    async getPageList(page, limit) {
      const result = await this.$API.trademark.getPageList(page, limit);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        // 加载成功之后要更新数据
        this.trademarkList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current; // 当前页码
        this.limit = result.data.size; // 每页显示条数
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 150px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 450px
</style>
