<template>
  <div class="main mt-1">
    <slot name="customForm" :dataForm="item" />
  </div>
</template>

<script>
export default {
  props: {
    item: { type: Object, default: null },
  },
  setup() {
    return {};
  },
};
</script>