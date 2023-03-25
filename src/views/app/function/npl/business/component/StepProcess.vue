<template>
  <div class="main-vue-step">
    <VueStep
      class="custom-vue-step"
      :now-step="nowStep"
      :step-list="stepList"
      :style-type="'style1'"
      :direction="'vertical'"
      :active-color="'#145388'"
    />
  </div>
</template>

<script>
import VueStep from "@/components/Steps/VueStep.vue";

export default {
  components: {
    VueStep,
  },
  props: {
    stepList: { type: Array, default: [] },
  },
  data() {
    return {
      nowStep: 0,
    //   stepList: [
    //     {
    //       label: "Yêu cầu kiểm tra",
    //       name: "Trần Văn A",
    //       datetime: "12:12 13/02/2023",
    //     },
    //   ],
    };
  },
};
</script>

<style>
.main-vue-step {
  height: 100%;
}
.custom-vue-step {
  height: 100%;
}
</style>