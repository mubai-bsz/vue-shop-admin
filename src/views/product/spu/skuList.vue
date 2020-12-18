<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="skuForm">
      <el-form-item label="SPU名称"
        ><span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SPU名称" prop="skuName">
        <el-input placeholder="请输入SPU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          placeholder="请输入SPU价格"
          style="width: 300px"
          v-model="sku.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          placeholder="请输入SPU重量"
          style="width: 300px"
          v-model="sku.weight"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="请选择SPU规格描述"
          v-model="sku.skuDesc"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <el-form-item :label="attr.attrName" style="display: inline-block">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
              <!-- label 是显示的内容，value 是获取的值 -->
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <el-form-item
            style="display: inline-block"
            :label="sale.saleAttrName"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              ></el-option>
              <!-- label 是显示的内容，value 是获取的值 -->
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" reserve-selection width="55">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
                style="width: 150px; display: inline-block"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template v-slot="{ row }">
              <el-button
                v-if="!row.isDefault"
                type="primary"
                size="mini"
                @click="setDefault(row.id)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuList",
  // 从list中传过来的数据
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem, // spu数据
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      }, // sku数据
      attrList: [], // 平台属性数据
      spuSaleAttrList: [], // 销售属性数据
      imageList: [], // 图片列表
      rules: {
        // 表单验证规则
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    // 取消
    cancel() {
      this.$emit("showList");
    },
    // 当填写东西的时候，清空表单校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    // 保存时检测校验,并发送请求，并向服务器中保存数据
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          // console.log("校验成功");
          /*
          向服务器中保存数据需要的数据
            {
              "skuAttrValueList": [
                {
                  "attrId": 0,
                  "valueId": 0
                }
              ],
              "skuDefaultImg": "string",
              "skuSaleAttrValueList": [
                {
                  "saleAttrValueId": 0,
                  "spuId": 0
                }
              ],
            }
          */
          const { category3Id, tmId, id: spuId } = this.spu;
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            // 把在上面传递的2个id在这里切割开
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault === true
          ).imgUrl;
          const result = await this.$API.sku.getSaveSkuInfo({
            ...this.sku,
            category3Id,
            tmId,
            spuId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });
          if (result.code === 200) {
            this.$message.success("保存sku成功~");
            this.$emit("showList");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 自定义校验图片选择
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;
      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片"));
        return;
      }
      if (!skuImageList.some((img) => !img.isDefault)) {
        callback(new Error("请选择默认图片"));
        return;
      }
      callback();
    },
    // 自定义校验销售属性
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请对所有销售属性进行选择"));
        return;
      }
      callback();
    },
    // 自定义校验sku平台属性列表
    skuAttrValueListValidator(rule, value, callback) {
      // 所有的平台属性选择一起校验，如果一个没有选择，使用some方法来进行查看，是否有没有选择的那么就会提示消息
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error("请选择全部平台属性"));
        return;
      }
      callback();
    },
    // 当选择项变化时，触发该函数，然后修改sku中的值
    handleSelectionChange(skuImageList) {
      // console.log(skuImageList);
      this.sku.skuImageList = skuImageList;
    },
    // 设置默认按钮
    // 清除默认
    // 要看选择的是哪一张图片，当前选中图片的下标与遍历元素相等的话，就表明是选中的图片,i是当前选中的图片，当使用下标时，会出现错误，比如选择的图片是imgList中的第三个，但是在skuImgList中可能只有一张图片，这样使用下标的方法就会出错了，所以，可以使用id的方法来解决这个问题
    setDefault(id) {
      this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    // 获取平台属性
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
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
