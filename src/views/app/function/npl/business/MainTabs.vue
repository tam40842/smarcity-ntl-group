<template>
  <div id="app-content-full" class="main">
    <div class="header-tabs">
      <BusinessTabs
        :activeFocus="currentTabBusiness"
        @changeTab="changeTabBusiness"
      />
    </div>
    <div class="content-tabs">
      <ContentTabs :currentTabContent="currentTabBusiness" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import BusinessTabs from "./component/BusinessTabs.vue";
import ContentTabs from "./component/ContentTabs.vue";

export default {
  components: {
    BusinessTabs,
    ContentTabs,
  },
  setup() {
    console.log("Đang phát triển!")
    const currentTabBusiness = ref(0);
    return {
      currentTabBusiness,
    };
  },
  methods: {
    changeTabBusiness(result) {
      this.currentTabBusiness = result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/sass/_mixins.scss";

$height_header-tabs: "auto";

.header-tabs {
  height: $height_header-tabs;
}
</style>