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
    >
      <template #cell(ActionTypeName)="row">
        <div>
          <StatusColor
            :color="row.item.ActionColor"
            :label="row.item.ActionTypeName"
            :showCircle="false"
          />
        </div>
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
import { ref } from "vue";

export default {
  components: {
    StatusColor,
  },
  props: {
    items: { type: Array, default: null },
    disablePagination: { type: Boolean, default: false },
  },
  setup() {
    const currentPage = ref(1);
    const perPage = ref(10);
    return {
      currentPage,
      perPage,
      fields: [
        {
          key: "CreateDate",
          label: "Thời gian",
          formatter: (value, key, item) => {
            return handling.convertDateTime(value);
          },
        },
        {
          key: "UserFullName",
          label: "Người thực hiện",
        },
        {
          key: "ActionTypeName",
          label: "Thao tác",
        },
        {
          key: "Note",
          label: "Ghi chú",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.basic-table-npl .table th {
  white-space: nowrap;
}
</style>