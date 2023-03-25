<template>
  <div v-if="tabList.length > 0">
    <b-button
      v-for="(item, index) in tabList"
      :key="index"
      class="mb-1 mr-1"
      squared
      :variant="activeFocus === index ? `primary` : `outline-primary`"
      @click="emitChangeTab(index)"
    >
      <i :class="item.icon" />
      <b>{{ item.label }}</b>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    activeFocus: {
      type: Number,
      required: true,
      default: 0,
    },
    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    emitChangeTab(value) {
      this.$emit("changeTab", value);
    },
  },
};
</script>
