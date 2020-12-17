<template>
  <el-card>
    <el-form label-width="100px" :model="spu">
      <el-form-item label="SPU名称" prop="skuName"
        ><span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SPU名称" prop="skuName">
        <el-input placeholder="请输入SPU名称" v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          placeholder="请输入SPU价格"
          style="width: 300px"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          placeholder="请输入SPU重量"
          style="width: 300px"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请选择SPU规格描述"> </el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
            <!-- label 是显示的内容，value 是获取的值 -->
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="value.id"
            ></el-option>
            <!-- label 是显示的内容，value 是获取的值 -->
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" prop="isCheck">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
                style="width: 150px"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  // 从list中传过来的数据
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem, // spu数据
      sku: {}, // sku数据
      attrList: [], // 平台属性数据
      spuSaleAttrList: [], // 销售属性数据
      imageList: [], // 图片列表
      rules: {}, // 表单验证规则
    };
  },
  methods: {
    handleSelectionChange() {},
    // 获取平台属性
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取所有平台属性列表成功~");
        // 处理数据
        this.attrList = result.data;
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
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
