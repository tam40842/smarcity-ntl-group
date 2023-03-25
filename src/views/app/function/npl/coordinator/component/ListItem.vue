<template>
  <div class="main">
    <b-table
      id="basic-table-npl"
      class="basic-table-npl"
      bordered
      responsive
      show-empty
      head-variant="light"
      selectable
      :fields="fields"
      :items="items"
      :select-mode="'single'"
      :current-page="disablePagination == false ? currentPage : null"
      :per-page="disablePagination == false ? perPage : null"
      @row-dblclicked="emitDbClick"
      @row-clicked="emitClick"
    >
      <template slot="top-row" slot-scope>
        <td v-for="field in fields" :key="field.ID">
          <b-form-input placeholder="Nhập tìm.." style="height: 24px" />
        </td>
      </template>
      <template v-for="(field, index) in fields" #[`cell(${field.key})`]="row">
        <template v-if="field.typeCol.toUpperCase() == 'DATE'">
          <span :key="index" style="color: #858585">
            {{ convertDate(row.item[`${field.key}`]) }}
          </span>
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'DATETIME'">
          <span :key="index" style="color: #858585">
            {{ convertDateTime(row.item[`${field.key}`]) }}
          </span>
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'STATUSCOLOR'">
          <StatusColor
            :key="index"
            :color="row.item[`${field.key}Color`]"
            :label="row.item[`${field.key}`]"
            :showCircle="false"
          />
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'BIT'">
          <StatusColor
            v-if="row.item[`${field.key}`] == 1"
            :key="index"
            :color="'#dc3545'"
            :label="`Đã khóa`"
            :showCircle="false"
          />
          <StatusColor
            v-else
            :key="index"
            :color="'#2a93d5'"
            :label="`Chưa khóa`"
            :showCircle="false"
          />
        </template>
        <template v-else>
          <div :key="index">
            {{ row.item[`${field.key}`] }}
          </div>
        </template>
      </template>
      <template #empty>
        <div class="font-italic text-muted">
          {{ $t("data.non-data") }}
        </div>
      </template>
    </b-table>
    <b-pagination
      v-if="disablePagination == false"
      v-model="currentPage"
      align="center"
      :total-rows="items.length"
      :per-page="perPage"
    >
      <template #next-text>
        <i class="simple-icon-arrow-right" />
      </template>
      <template #prev-text>
        <i class="simple-icon-arrow-left" />
      </template>
      <template #first-text>
        <i class="simple-icon-control-start" />
      </template>
      <template #last-text>
        <i class="simple-icon-control-end" />
      </template>
    </b-pagination>
  </div>
</template>

<script>
import handling from "@/constants/handling";
import StatusColor from "@/components/Badges/StatusColor.vue";
import { ref, toRef } from "vue";

export default {
  components: {
    StatusColor,
  },
  props: {
    fields: { type: Array, default: null },
    items: { type: Array, default: null },
    disablePagination: { type: Boolean, default: false },
  },

  setup(props, { emit }) {
    const currentPage = ref(1);
    const perPage = ref(10);
    const emitClick = (item, index) => {
      emit("returnClick", item, index);
    };
    const emitDbClick = (item, index) => {
      emit("returnDbClick", item, index);
    };
    return {
      currentPage,
      perPage,
      emitClick,
      emitDbClick,
    };
  },
  methods: {
    convertDate(string) {
      return handling.convertDate(string);
    },
    convertDateTime(string) {
      return handling.convertDateTime(string);
    },
  },
};
</script>

<style lang="scss">
.basic-table-npl .table th {
  white-space: nowrap;
}
</style>