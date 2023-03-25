<template>
  <div class="main">
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 0 ? `primary` : `outline-primary`"
      @click="emitChangeTab(0)"
    >
      <i class="fas fa-truck-container mr-1" />
      <b>Báo cáo sự cố</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 1 ? `primary` : `outline-primary`"
      @click="emitChangeTab(1)"
    >
      <i class="fas fa-paste mr-1" />
      <b>Xin đỏ dầu</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 2 ? `primary` : `outline-primary`"
      @click="emitChangeTab(2)"
    >
      <i class="fas fa-file-invoice-dollar mr-1" />
      <b>Các yêu cầu khác</b>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    activeFocus: { type: Number, required: true, default: 0 },
  },

  setup(_, { emit }) {
    const emitChangeTab = (value) => {
      emit("changeTab", value);
    };
    return {
      emitChangeTab,
    };
  },
};
</script>