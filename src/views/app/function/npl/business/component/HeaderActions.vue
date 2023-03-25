<template>
  <div class="main">
    <b-button
      squared
      variant="outline-secondary"
      size="xs"
      @click="emitFirstIndex"
    >
      <i class="fas fa-chevron-double-left" />
    </b-button>
    <b-button
      squared
      variant="outline-secondary"
      size="xs"
      @click="emitPreIndex"
    >
      <i class="fas fa-chevron-left" />
    </b-button>
    <b-button squared variant="outline-secondary" size="xs">
      <b>{{ items.length == 0 ? 0 : index + 1 }}/{{ items.length }}</b>
    </b-button>
    <b-button
      squared
      variant="outline-secondary"
      size="xs"
      @click="emitNextIndex"
    >
      <i class="fas fa-chevron-right" />
    </b-button>
    <b-button
      squared
      variant="outline-secondary"
      size="xs"
      @click="emitLastIndex"
    >
      <i class="fas fa-chevron-double-right" />
    </b-button>
    <b-button
      squared
      variant="success"
      size="xs"
      :disabled="isEdit"
      @click="emitChangeActions('ADD')"
    >
      <i class="fas fa-plus" />
      <b>Thêm</b>
    </b-button>
    <b-button
      squared
      variant="warning"
      size="xs"
      :disabled="
        isAdd || (selectedItem && selectedItem.IsActive.value == 1)
          ? true
          : false
      "
      @click="emitChangeActions('EDIT')"
    >
      <i class="fas fa-edit" />
      <b>Sửa</b>
    </b-button>
    <b-button
      squared
      variant="danger"
      size="xs"
      :disabled="
        isAdd || isEdit || (selectedItem && selectedItem.IsActive.value == 1)
          ? true
          : false
      "
      @click="emitChangeActions('DELETE')"
    >
      <i class="fas fa-trash-alt" />
      <b>Xóa</b>
    </b-button>
    <b-button
      squared
      variant="primary"
      size="xs"
      :disabled="isReadonly"
      @click="emitChangeActions('SAVE')"
    >
      <i class="fas fa-save" />
      <b>Lưu</b>
    </b-button>
    <b-button
      squared
      variant="secondary"
      size="xs"
      :disabled="isReadonly == true ? true : false"
      @click="emitChangeActions('CANCEL')"
    >
      <i class="fas fa-undo-alt" />
      <b>Hủy</b>
    </b-button>
    <b-button
      class="tblock"
      squared
      variant="outline-primary"
      size="xs"
      :disabled="
        selectedItem && selectedItem.IsActive.value == 0 ? false : true
      "
      @click="emitChangeActions('BLOCK', selectedItem)"
    >
      <i
        :class="
          selectedItem && selectedItem.IsActive.value == 0
            ? `fas fa-unlock-alt text-success`
            : `fas fa-lock-alt text-danger`
        "
      />
      <b
        v-if="selectedItem && selectedItem.IsActive.value == 0"
        class="text-success"
      >
        Khóa
      </b>
      <b v-else class="text-danger">Đã khóa</b>
    </b-button>
    <b-button
      squared
      variant="outline-primary"
      size="xs"
      @click="emitChangeActions('PRINT')"
    >
      <i class="fas fa-print" />
      <b>In file</b>
    </b-button>
    <b-button
      squared
      variant="outline-primary"
      size="xs"
      @click="emitChangeActions('IMPORT')"
    >
      <i class="fas fa-upload" />
      <b>Đ.kèm file</b>
    </b-button>
    <b-button
      squared
      variant="outline-primary"
      size="xs"
      @click="emitChangeActions('FIND')"
    >
      <i class="fas fa-search" />
      <b>Tìm kiếm</b>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    selectedItem: { type: Object, default: null },
    items: { type: Array, required: true, default: [] },
    index: { type: Number, required: true, default: 0 },
    isAdd: { type: Boolean, required: true, default: true },
    isEdit: { type: Boolean, required: true, default: true },
    isReadonly: { type: Boolean, required: true, default: true },
  },
  setup() {
    return {};
  },
  methods: {
    emitFirstIndex() {
      this.$emit("firstIndex");
    },
    emitPreIndex() {
      this.$emit("preIndex");
    },
    emitNextIndex() {
      this.$emit("nextIndex");
    },
    emitLastIndex() {
      this.$emit("lastIndex");
    },
    emitChangeActions(key, obj) {
      this.$emit("changeActions", key, obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.tblock:hover {
  background: initial;
  // cursor: pointer;
}
</style>
<style>
.btn-warning:hover{
  color: #212529 !important;
}
</style>