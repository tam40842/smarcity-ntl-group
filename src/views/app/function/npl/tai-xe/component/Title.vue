<template>
  <div
    style="font-size: 16px; background: #d7d7d7; color: #005aab"
    class="mb-2 text-center"
  >
    <strong class="text-uppercase">
      {{ $t("major") }} : {{ title?.toUpperCase() }}</strong
    >
    <b-dropdown
      class="title-dropdown"
      size="lg"
      variant="link"
      toggle-class="text-decoration-none"
    >
      <template v-for="(item, key) in listTitle">
        <b-dropdown-item
          class="text-uppercase"
          @click="$emit('changeTitle', item)"
          :key="key"
          href="#"
          >{{ item?.EntryName }}
        </b-dropdown-item>
      </template>
    </b-dropdown>
    <hr class="m-0" />
  </div>
</template>

<script>
export default {
  props: {
    listTitle: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
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
