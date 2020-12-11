<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
    <!-- 点击添加按钮弹出对话框 -->
    <el-form
      :model="trademarkForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 输入品牌名 -->
      <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <!-- 上传图片 -->
        <!--
          图片的地址问题：
          前提是允许跨域
          可以直接写死地址，但是当以后上线时，这里的地址很会变动的，所以，最好不要这样写，其次，这样写还有可能会碰到跨域问题
           action="http://182.92.128.115/admin/product/fileUpload"
          不允许跨域的方法：
          通过查找vue.config.js文件可以发现，有解决跨域的方法 /dev-api，基础路径
           action="`/dev-api/admin/product/fileUpload`"
          /dev-api   ----》在request中的 VUE_APP_BASE_API，中已经包含了基础路径
          在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API，所以可以直接使用
        -->
        <el-form-item label="品牌LOGO" prop="tmName">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />

            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-form>
    <!-- 表格展示数据 -->
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
      visible: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 校验规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传品牌logo",
          },
        ],
      },
    };
  },
  methods: {
    // 有更加方便的写法
    // handleSizeChange(limit) {
    //   this.limit = limit;
    //   this.getPageList(this.page, this.limit);
    // },
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getPageList(this.page, this.limit);
    // },
    // 请求品牌分类列表
    async getPageList(page, limit) {
      const result = await this.$API.trademark.getPageList(page, limit);
      // console.log(result);
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
    // 上传成功
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
      console.log(res.data); // 图片地址
    },
    // 上传之前先检测传入的图片
    beforeAvatarUpload(file) {
      // 定义图片格式
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      // 检测图片类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      // 检测文件大小
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 50kb!");
      }
      // 返回值为true，表示可以上传
      // 返回值为false，表示不可以上传
      return isValidType && isLt;
    },
    // 上传图片点击确定时触发
    submitForm(formName) {
      // 先校验表单
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 表单校验通过，发送请求,添加数据
          const result = await this.$API.trademark.addPageList(
            this.trademarkForm
          );
          if (result.code === 200) {
            this.$message.success("品牌添加成功");
            this.visible = false; // 隐藏框
            // 重新发送请求，刷新数据
            this.getPageList(this.page, this.limit);
          }
        } else {
          this.$message.error(result.message);
        }
      });
      visible: false;
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

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  :hover &
    border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
