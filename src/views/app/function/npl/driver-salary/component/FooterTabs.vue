<template>
  <div class="main">
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 0 ? `primary` : `outline-primary`"
      @click="emitChangeTab(0)"
    >
      <i class="fas fa-list-alt mr-1" />
      <b>Danh sách</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 1 ? `primary` : `outline-primary`"
      @click="emitChangeTab(1)"
    >
      <i class="fas fa-info-square mr-1" />
      <b>Chứng từ</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 2 ? `primary` : `outline-primary`"
      @click="emitChangeTab(2)"
    >
      <i class="fas fa-history mr-1" />
      <b>Lịch sử thao tác</b>
    </b-button>
    <b-button
      class="mb-1"
      squared
      :variant="activeFocus == 3 ? `primary` : `outline-primary`"
      @click="emitChangeTab(3)"
    >
      <i class="fas fa-file-alt mr-1" />
      <b>File đính kèm</b>
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

<style lang="scss" scoped>
</style>