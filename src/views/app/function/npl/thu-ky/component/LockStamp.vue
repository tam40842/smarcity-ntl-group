<template>
  <div
    v-if="show"
    :style="styleCSS"
  >
    <img
      src="/assets/img/npl/img-lock.png" 
      alt=""
      style="height: 60px"
    >
  </div>
</template>

<script>
export default {
  props: ['show', 'styleCSS'],
};
</script>
