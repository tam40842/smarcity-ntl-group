<template>
  <div class="main">
    <b-tabs v-model="currentTabContent" nav-class="d-none">
      <b-tab><TransportRequest /></b-tab>
      <b-tab>Đơn hàng</b-tab>
      <b-tab><ApprovalCost /></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import TransportRequest from "../TransportRequest.vue";
import ApprovalCost from "./ApprovalCost.vue";

export default {
  components: {
    TransportRequest,
    ApprovalCost,
  },
  props: {
    currentTabContent: { type: Number, required: true, default: 0 },
  },
};
</script>
