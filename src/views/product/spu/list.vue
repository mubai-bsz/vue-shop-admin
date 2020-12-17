<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />
    <div v-else>
      <Category :disabled="!isShowList" />
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSpuList="showSpuList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    // 定义一个方法，从spuShowList中获取数据
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    showUpdateList(row) {
      this.isShowList = false;
      // 直接赋值的话，会修改原数据的值，创建一份新的数据
      // this.item = row;
      this.item = { ...row };
    },
    showList(category3Id) {
      this.isShowList = true;
      // 等ShowList组件加载完成，在触发事件
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
