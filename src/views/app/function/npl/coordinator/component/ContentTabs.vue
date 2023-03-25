<template>
  <div class="main">
    <b-tabs v-model="currentTabContent" nav-class="d-none">
      <b-tab><ApprovalReqquest /></b-tab>
      <b-tab>Đơn hàng chờ chia xe</b-tab>
      <b-tab>Giám sát</b-tab>
      <b-tab><ApprovalCost /></b-tab>
      <b-tab>Xe chờ điều độ</b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ApprovalReqquest from "../ApprovalReqquest.vue";
import ApprovalCost from "./ApprovalCost.vue";

export default {
  components: {
    ApprovalReqquest,
    ApprovalCost,
  },
  props: {
    currentTabContent: { type: Number, required: true, default: 0 },
  },
};
</script>
