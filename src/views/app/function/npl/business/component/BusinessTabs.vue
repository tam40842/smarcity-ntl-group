<template>
  <div class="main">
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 0 ? `primary` : `outline-primary`"
      @click="emitChangeTab(0)"
    >
      <i class="fas fa-truck-container mr-1" />
      <b>Yêu cầu vận tải</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 1 ? `primary` : `outline-primary`"
      @click="emitChangeTab(1)"
    >
      <i class="fas fa-paste mr-1" />
      <b>Đơn hàng</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 2 ? `primary` : `outline-primary`"
      @click="emitChangeTab(2)"
    >
      <i class="fas fa-file-invoice-dollar mr-1" />
      <b>Duyệt phát sinh</b>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    activeFocus: { type: Number, required: true, default: 0 },
  },
  methods: {
    emitChangeTab(value) {
      this.$emit("changeTab", value);
    },
  },
};
</script>