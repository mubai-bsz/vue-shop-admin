<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.id">
          <el-option
            v-for="tm in trademarkList"
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
          <!-- label 是显示的内容，value 是获取的值 -->
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
        >
          <img v-if="false" :src="trademarkForm.logoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>

      <!-- prop="saleAttrId" 是为了表单校验的 -->
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="tm in filterSaleAttrList"
            :label="tm.name"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="attrVal in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="update(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片预览的对话框 -->
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImageUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  /*
       第一步，先接收从list中传过来的数据，然后遍历展示出来
       第二步，调用接口，获取所有品牌的数据
       第三步：处理图片，图片的显示，需要地址要与element插件上的一致，点击放大与删除
       第四步：获取销售属性中的数据，请求发完之后，通过遍历展示即可，但是要注意的是要找好没给东西的位置在哪；
          在这里，选择了销售属性之后，下面有在展示时，销售属性的框哪里显示的应该把选的过滤掉，不计算在内，为了方便点，直接使用计算属性可以避免在数据变化时，在次调用方法

  */
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], // 图片
      previewImageUrl: "", // 图片地址
      visible: false, // 图片对话框显示或隐藏
      saleAttrList: [], // 所有销售属性获取成功
      spuSaleAttrList: [], // 获取spu销售属性列表
    };
  },
  methods: {
    // 过滤掉选中的图片,注意，这里写完之后，在上面的遍历展示那里，不要忘记修改遍历的原型
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // this.spuSaleAttrList.indexOf() // 只适用于数组中是基本类型
        // this.spuSaleAttrList.find() // 适用于数组中是引用类型
        // 使用find方法，找出选中的直接过滤掉,如果id相等，表明已经被选中了，在下面有显示了，这个就过滤掉
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
    // 移除图片,通过过滤id来移除图片
    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },
    // 处理图片预览
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url;
      this.visible = true;
    },
    // 获取品牌列表
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("所有品牌获取成功");
        // 更新数据
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取图片,需要传id值
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("品牌图片获取成功");
        // 更新数据并处理数据，为了把上传的图片给显示出来.只是处理一下数据结构，减少长度，并不改变原数据的值，使用map
        // 原本数据结构 [{imgName: '', imgUrl: ''}]
        // 需要的数据结构： [{imgName: '', imgUrl: ''}]
        this.imageList = result.data.map((img) => {
          return {
            id: img.id, // 这个id不是在这里用的，是在删除图片的时候使用的
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("所有销售属性列表获取成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("品牌图片获取成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getSaleAttrList();
  },
};
</script>

<style>
</style>
