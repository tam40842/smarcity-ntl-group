<template>
  <div
    style="font-size: 16px; color: #005aab"
    class="mb-2 text-left"
  >
    <strong v-if="isNoModify" class="text-uppercase">
      {{ $t("major") }}: {{ title.toUpperCase() }}
    </strong>
    <strong v-else class="text-uppercase">
      {{ $t("major") }}: {{ $t("standard") }} {{ title.toUpperCase() }}
    </strong>
    <b-dropdown
      class="title-dropdown"
      size="lg"
      variant="link"
      toggle-class="text-decoration-none"
    >
      <template v-for="(item, key) in titleOptionModify">
        <b-dropdown-item
          :key="key"
          href="#"
          class="text-uppercase"
          @click="changeTitle(item)"
        >
          {{ item.label }}
        </b-dropdown-item>
      </template>
    </b-dropdown>
    <hr class="m-0">
  </div>
</template>

<script>
export default {
  props: ["titleOption", "title", "isNoModify"],
  computed: {
    titleOptionModify() {
      if (this.titleOption) {
        return titleOption;
      }
      else if(this.isNoModify) {
        return [{ label: `${this.title}` }];
      }
      return [{ label: `${this.$t("standard")} ${this.title}` }];
    },
  },
  methods: {
    changeTitle(obj) {
      this.currentTitle = obj.label;
    },
  },
};
</script>
