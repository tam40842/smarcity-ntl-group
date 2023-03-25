<template>
  <div class="main mt-1">
    <div class="title pl-2 pt-2">
      <strong>
        NGHIỆP VỤ : <span class="text-primary">YÊU CẦU VẬN TẢI</span>
      </strong>
    </div>
    <div class="separator mb-2" />
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