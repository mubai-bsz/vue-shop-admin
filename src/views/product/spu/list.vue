<template>
  <div>
    <Category />
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuUpdateList v-else :item="item" @showList="showList" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
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
  },
};
</script>
