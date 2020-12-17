<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('showUpdateList', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >

      <el-table
        :data="spuList"
        v-loading="loading"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$emit('showSpuList', { ...row, ...category })"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', { ...row, ...category })"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分页器 -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SpuShowList",
  data() {
    category: {
      return {
        // category: {
        //   category1Id: "",
        //   category2Id: "",
        //   category3Id: "",
        // },
        page: 1,
        limit: 3,
        total: 0,
        spuList: [],
        loading: false,
      };
    }
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        if (!category3Id) return;
        this.getPageList(this.page, this.limit);
      },
      immediate: true,
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    // 获取spu分类列表
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      this.loading = true;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });

      if (result.code === 200) {
        this.$message.success("获取SPU分页列表成功~");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },

    // 点击三级分类时发送请求，请求数据,需要page、limit、3id
    // handleCategoryChange(category) {
    //   this.category = category;
    //   this.getPageList(this.page, this.limit);
    // },

    // 当切换三级页面时，下面数据清空
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category3Id = "";
    },
  },
  // mounted() {
  //   this.$bus.$on("change", this.handleCategoryChange);
  //   this.$bus.$on("clearList", this.clearList);
  // },
  // beforeDestroy() {
  //   // 通常情况下：清除绑定的全局事件
  //   this.$bus.$off("change", this.handleCategoryChange);
  //   this.$bus.$off("clearList", this.clearList);
  // },
};
</script>

<style lang="sass">
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 450px
</style>
