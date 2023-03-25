<template>
  <b-modal
    id="modal-table-vehicle"
    :title="$t('modal.add')"
    body-class="body-modal-add"
    size="xl"
    cancel-variant="outline-danger"
    :ok-title="$t('modal.change')"
    :cancel-title="$t('modal.cancel')"
    @ok="handleOk"
    @hidden="hiddenModal"
  >
    <b-table
      class="table-npl"
      :fields="modifyFields"
      :items="dataTable"
      bordered
      responsive
      show-empty
      head-variant="light"
      selectable
      select-mode="multi"
      sticky-header
      style="margin-top: -1px; max-height: calc(100vh - 300px)"
      :no-border-collapse="true"
      @row-selected="rowSelected"
    >
      <template
        v-if="fieldsTable.length"
        slot="top-row"
        slot-scope="{ fields }"
      >
        <td v-for="(field, index) in fields" :key="index">
          <div
            v-if="
              field.typeCol.toUpperCase() == 'DATE' ||
              field.key.toUpperCase() == 'ODATE'
            "
            class="frame-filter text-dark"
          >
            <div
              v-if="checkIsFilter(field.key)"
              class="btn-delete-filter"
              @click="changeFilterValues(field.key, '', field.typeCol)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                />
              </svg>
            </div>
            <datepicker
              :language="locale"
              :format="datePickerFormat"
              :bootstrap-styling="true"
              :placeholder="$t('modal.day-select')"
              :value="setFilterValues(field.key)"
              @input="
                (value) => changeFilterValues(field.key, value, field.typeCol)
              "
            />
          </div>
          <div
            v-else-if="
              field.key.toUpperCase() == 'ISATTACHFILE' ||
              field.key.toUpperCase() == 'ISLOCK'
            "
            style="min-width: 80px"
            class="frame-filter"
          >
            <div
              v-if="checkIsFilter(field.key)"
              class="btn-delete-filter"
              @click="changeFilterValues(field.key, '', field.typeCol)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                />
              </svg>
            </div>
            <b-form-select
              :options="[
                { text: $t('npl.button.all'), value: '' },
                { text: $t('npl.button.yes'), value: 1 },
                { text: $t('npl.button.no'), value: 0 },
              ]"
              :value="setFilterValues(field.key)"
              @change="
                (value) => changeFilterValues(field.key, value, field.typeCol)
              "
            />
          </div>
          <div
            v-else-if="field.key.toUpperCase() == 'ISACTIVE'"
            style="min-width: 100px"
            class="frame-filter"
          >
            <div
              v-if="checkIsFilter(field.key)"
              class="btn-delete-filter"
              @click="changeFilterValues(field.key, '', field.typeCol)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                />
              </svg>
            </div>
            <b-form-select
              :options="statusOptions"
              :value="setFilterValues(field.key)"
              @change="
                (value) => changeFilterValues(field.key, value, field.typeCol)
              "
            />
          </div>
          <!-- <div
          v-else-if="field.typeCol.toUpperCase() == 'MONEY'"
          style="min-width: 100px"
          class="frame-filter"
        >
          <div
            v-if="checkIsFilter(field.key)"
            class="btn-delete-filter"
            @click="changeFilterValues(field.key, '', field.typeCol)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path
                d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
              />
            </svg>
          </div>
          <b-form-input
            class="text-right"
            :value="setFilterValues(field.key)"
            :formatter="currencyFormatFilter"
            @input="
              (value) => changeFilterValues(field.key, value, field.typeCol)
            "
          />
        </div> -->
          <div v-else class="frame-filter">
            <div
              v-if="checkIsFilter(field.key)"
              class="btn-delete-filter"
              @click="changeFilterValues(field.key, '', field.typeCol)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                />
              </svg>
            </div>
            <b-form-input
              :placeholder="$t('modal.input-text')"
              :value="setFilterValues(field.key)"
              @input="
                (value) => changeFilterValues(field.key, value, field.typeCol)
              "
            />
          </div>
        </td>
      </template>
      <template #cell(IsActive)="row">
        <div class="d-flex justify-content-center">
          <div style="width: 90px">
            <Status
              :color="showTextStatus(row.item.IsActive).color"
              :label="showTextStatus(row.item.IsActive).text"
              :showCircle="false"
            />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="text-center font-italic text-muted">
          {{ $t("data.non-data") }}
        </div>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import Status from "@/components/Badges/StatusColor.vue";

export default {
  components: {
    Status,
  },
  props: ["show", "fieldsTable", "dataTable", "statusOption"],
  data() {
    return {
      vehicleSelected: [],
      filterValues: null,
    };
  },
  computed: {
    modifyFields() {
      if (this.fieldsTable.length > 0) {
        const arr = [...this.fieldsTable];
        const index = arr.findIndex(
          (item) => item.key.toUpperCase() === "ACTION"
        );
        arr.splice(index, 1);
        return [...arr];
      }
      return [];
    },
    statusOptions() {
      return [
        { text: this.$t("npl.button.all"), value: "", color: "black" },
        { text: this.$t("npl.using"), value: 1, color: "green" },
        { text: this.$t("npl.not-use"), value: 0, color: "gray" },
      ]
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$bvModal.show("modal-table-vehicle");
        this.filterValues = null;
      } else {
        this.$bvModal.hide("modal-table-vehicle");
      }
    },
  },
  methods: {
    showTextStatus(value) {
      const obj = this.statusOptions.find((item) => item.value === value);
      return obj || { text: "", color: "" };
    },
    rowSelected(row) {
      this.vehicleSelected = row;
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (this.vehicleSelected.length === 0) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("npl.toast.no-choose-vehicle")
        );
      }
      this.$emit("add", this.vehicleSelected);
    },
    hiddenModal() {
      this.vehicleSelected = [];
      this.$emit("hidden");
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },
    //liên quan đến filter trong cột table
    changeFilterValues(key, value, typeCol = "") {
      this.filterValues = {
        ...this.filterValues,
        [key]: {
          value,
          typeCol,
        },
      };
      clearTimeout(this.timeoutEmitFilter);
      this.timeoutEmitFilter = setTimeout(() => {
        this.$emit("onFilter", this.filterValues);
      }, 300);
    },
    setFilterValues(key) {
      if (this.filterValues && this.filterValues[key]) {
        return this.filterValues[key].value;
      }
      return "";
    },
    checkIsFilter(key) {
      if (this.filterValues) {
        const value = this.filterValues[key]
          ? this.filterValues[key].value
          : "";
        if (value.toString() != "") {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
// .table-npl {
//   .frame-filter {
//     position: relative;
//     .btn-delete-filter {
//       width: 16px;
//       height: 16px;
//       position: absolute;
//       z-index: 5;
//       top: -5px;
//       right: -5px;
//       cursor: pointer;

//       svg {
//         transition: 0.3;
//         &:hover {
//           opacity: 0.9;
//         }
//         path {
//           fill: #3a3a3a;
//         }
//       }
//     }

//     .vdp-datepicker {
//       .vdp-datepicker__calendar {
//         position: fixed;
//       }
//     }

//     .vs__dropdown-menu {
//       min-width: 100%;
//     }
//     .vs__selected-options {
//       height: 34px;
//       .vs__selected {
//         padding: 5px 0 0 0 !important;
//       }
//     }
//     .vs__search {
//       display: none;
//     }
//     .custom-select {
//       // height: 24px !important;
//       &:focus {
//         box-shadow: none;
//       }
//     }
//   }

//   .b-table-top-row {
//     position: sticky;
//     background: white;
//     // top: 43px;
//     z-index: 2;
//   }
// }
</style>
