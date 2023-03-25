<template>
  <div class="h-100">
    <router-view />
    <color-switcher />
  </div>
</template>

<script>
import ColorSwitcher from "./components/Common/ColorSwitcher";
import { getDirection } from "./utils";

export default {
  components: {
    "color-switcher": ColorSwitcher,
  },
  provide() {
    return {
      $tuToast: this.$notify,
    };
  },
  data() {
    return {
      bgColorFormInput: "#e9ecef",
      bgColorVselect: "#e9ecef",
      bgLight: "#f8f9fa ",
    };
  },
  beforeMount() {
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.dir = "rtl";
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.dir = "ltr";
      document.body.classList.remove("rtl");
    }
    this.customStyleFormInput();
  },
  methods: {
    customStyleFormInput() {
      const typeTheme = localStorage
        .getItem("theme_selected_color")
        .split(".")[0];
      if (typeTheme == "dark") {
        this.bgColorFormInput = "#323232";
        this.bgColorVselect = "#323232";
        this.bgLight = "#242424";
      }
    },
  },
};
</script>

<style>
.form-control:disabled,
.b-form-btn-label-control.form-control[aria-disabled="true"] {
  background: v-bind(bgColorFormInput);
}
.vs--disabled .vs__search {
  background: v-bind(bgColorVselect) !important;
}
.bg-light {
  background: v-bind(bgLight) !important;
}
</style>