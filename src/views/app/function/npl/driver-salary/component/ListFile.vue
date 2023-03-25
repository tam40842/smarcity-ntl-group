<template>
  <div class="main">
    <b-table
      id="basic-table-npl"
      class="basic-table-npl"
      bordered
      responsive
      show-empty
      head-variant="light"
      :fields="fields"
      :items="items"
      :selectable="false"
      :select-mode="'single'"
      :current-page="disablePagination == false ? currentPage : null"
      :per-page="disablePagination == false ? perPage : null"
    >
      <template #cell(FileName)="row">
        <div v-for="(name, i) in row.item.FileName.split(',')" :key="i">
          <a
            :href="row.item.LinkFile.split(';')[i]"
            target="_ blank"
            download
            >{{ name }}</a>
        </div>
      </template>
      <template #cell(Actions)="row">
        <div style="cursor: pointer">
          <i
            class="fas fa-trash-alt text-danger mr-1"
            @click="showConfirmDelete(row.item)"
          />
          <i class="fas fa-edit text-warning" @click="emitEdit(row.item)" />
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
import { ref } from "vue";
import useAttachFiles from "../../hooks/useAttachFiles";

export default {
  props: {
    items: { type: Array, default: null },
    disablePagination: { type: Boolean, default: false },
  },
  setup() {
    const {
      deleteAttachFile,
    } = useAttachFiles();
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
          key: "Name",
          label: "Tiêu đề",
        },
        {
          key: "FileName",
          label: "File đính kèm",
        },
        {
          key: "Note",
          label: "Ghi chú",
        },
        {
          key: "Actions",
          label: "Thao tác",
          tdClass: "text-center",
        },
      ],
      deleteAttachFile,
    };
  },
  methods: {
    emitEdit(item) {
      item.OldLinks = item.LinkFile.split(";");
      item.Names = item.FileName.split(",");
      this.$emit("returnEdit", item);
    },
    showConfirmDelete(item) {
      let id = item.ID;
      this.$bvModal
        .msgBoxConfirm(this.$t("form.question") + id + " ?", {
          title: this.$t("form.warning").toUpperCase(),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("form.yes"),
          cancelTitle: this.$t("form.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value === true) {
            let body = {
              ID: id,
            };
            let result = await this.deleteAttachFile(body);
            if (result.status) {
              this.$emit("reLoadData");
              this.$notify("success", "THÀNH CÔNG", result.message);
            } else {
              this.$notify("error", "THẤT BẠI", result.message);
            }
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss">
.basic-table-npl .table th {
  white-space: nowrap;
}
</style>