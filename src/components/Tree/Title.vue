<template>
  <div
    style="font-size: 16px; background: #d7d7d7; color: #005aab"
    class="mb-2 text-center"
  >
    <strong class="text-uppercase" v-if="!inject">
      {{ $t("major") }} : {{ title?.toUpperCase() }}</strong
    >
    <strong class="text-uppercase" v-if="inject">
      {{ inject }} : {{ title?.toUpperCase() }}</strong
    >
    <b-dropdown
      class="title-dropdown"
      size="lg"
      variant="link"
      toggle-class="text-decoration-none"
    >
      <template v-for="(item, key) in titleOptionModify">
        <b-dropdown-item
          class="text-uppercase"
          @click="changeTitle(item)"
          :key="key"
          href="#"
          >{{ item.label }}
        </b-dropdown-item>
      </template>
    </b-dropdown>
    <hr class="m-0" />
  </div>
</template>

<script>
export default {
  props: ["titleOption", "title", "inject"],
  computed: {
    titleOptionModify() {
      if (this.titleOption) {
        return titleOption;
      }
      return [{ label: `${this.inject} ${this.title}` }];
    },
  },
  data() {
    return {};
  },
  methods: {
    changeTitle(obj) {
      this.currentTitle = obj.label;
    },
  },
};
</script>

<style>
.title-dropdown button {
  font-size: 20px;
  padding: 0;
}
</style>
