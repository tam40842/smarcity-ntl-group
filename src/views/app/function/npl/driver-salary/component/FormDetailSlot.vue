<template>
  <div class="main mt-1">
    <div class="title pl-2 pt-2">
      <strong v-if="isAdd == false">
        NGHIỆP VỤ :
        <span v-if="prItem" class="text-primary">{{
          prItem.EntryID.toUpperCase() == "AJ_INCREASESALARY"
            ? `ĐIỀU CHỈNH TĂNG LƯƠNG TÀI XẾ`
            : `ĐIỀU CHỈNH GIẢM LƯƠNG TÀI XẾ`
        }}</span>
      </strong>
      <div v-else>
        <strong>NGHIỆP VỤ :
          <span class="text-primary">{{ title.toUpperCase() }}</span>
        </strong>
        <b-dropdown
          class="title-dropdown ml-1 mr-4"
          variant="link"
          toggle-class="text-decoration-none"
        >
          <b-dropdown-item @click="changeTitle('AJ_INCREASESALARY')">
            ĐIỀU CHỈNH TĂNG LƯƠNG TÀI XẾ
          </b-dropdown-item>
          <b-dropdown-item @click="changeTitle('AJ_DECREASESALARY')">
            ĐIỀU CHỈNH GIẢM LƯƠNG TÀI XẾ
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="separator mb-2" />
    <slot name="customForm" :dataForm="item" :typeTitle="typeTitle" />
  </div>
</template>

<script>
export default {
  props: {
    item: { type: Object, default: null },
    prItem: { type: Object, default: null },
    isAdd: { type: Boolean, default: false },
  },
  data() {
    return {
      title: "ĐIỀU CHỈNH TĂNG LƯƠNG TÀI XẾ",
      typeTitle: "AJ_INCREASESALARY",
    };
  },
  methods: {
    changeTitle(key) {
      this.typeTitle = key.toUpperCase();
      if (key.toUpperCase() == "AJ_INCREASESALARY") {
        this.title = "ĐIỀU CHỈNH TĂNG LƯƠNG TÀI XẾ";
      } else {
        this.title = "ĐIỀU CHỈNH GIẢM LƯƠNG TÀI XẾ";
      }
      this.$emit('updateTitle',key.toUpperCase())
    },
  },
};
</script>