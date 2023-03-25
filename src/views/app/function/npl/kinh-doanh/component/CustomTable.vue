<template>
  <!-- để id là npl-table-basic-form cho xử lý import excel -->
  <b-table
    id="npl-table-basic-form"
    class="table-npl border-bottom"
    :fields="fieldsTable"
    :items="dataTable"
    bordered
    responsive
    show-empty
    head-variant="light"
    selectable
    :select-mode="'single'"
    :sticky-header="heightTable"
    table-class="table-npl"
    style="margin-top: -1px"
    @row-dblclicked="rowDblclicked"
  >
    <template v-if="fieldsTable.length" slot="top-row" slot-scope="{ fields }">
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
              { text: $t('npl.button.all'), value: ''},
              { text: $t('npl.button.yes'), value: 1},
              { text: $t('npl.button.no'), value: 0},
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
        <div
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
        </div>
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
    <template
      v-for="(field, index) in fieldsTable"
      #[`cell(${field.key})`]="row"
    >
      <template
        v-if="
          field.key.toUpperCase() == 'ODATE' ||
          field.typeCol.toUpperCase() == 'DATE'
        "
      >
        {{ convertDate(row.item[field.key]) }}
      </template>
      <template
        v-else-if="
          field.key.toUpperCase() == 'ISATTACHFILE' ||
          field.key.toUpperCase() == 'ISLOCK'
        "
      >
        <template v-if="row.item[field.key]">
          <div :key="index" class="text-center">
            <span style="color: limegreen">✔</span>
          </div>
        </template>
        <template v-else>
          <div :key="index" class="text-center">
            <span style="color: red">✘</span>
          </div>
        </template>
      </template>
      <template v-else-if="field.key.toUpperCase() === 'ISACTIVE'">
        <div :key="index" class="d-flex justify-content-center">
          <div style="width: 90px">
            <Status
              :color="showTextStatus(row.item.IsActive).color"
              :label="showTextStatus(row.item.IsActive).text"
              :showCircle="false"
            />
          </div>
        </div>
      </template>
      <template v-else-if="field.typeCol.toUpperCase() == 'MONEY'">
        {{ convertCurrency(row.item[field.key]) }}
      </template>
      <template v-else>
        {{ row.item[field.key] }}
      </template>
    </template>
    <template #empty>
      <div class="text-center font-italic text-muted">
        {{ $t("data.non-data") }}
      </div>
    </template>
  </b-table>
</template>

<script>
import moment from "moment";
import { en, vi } from "vuejs-datepicker/dist/locale";
import Status from "@/components/Badges/StatusColor.vue";
// import vSelect from "vue-select"; --> xài vSelect khi mà dataTable không có phần tử sẽ hiển thị lỗi, nên xài select của bootstrap-vue để cái dropdown của select hiện lên tất cả
import "vue-select/dist/vue-select.css";

export default {
  components: {
    Status,
    // "v-select": vSelect,
  },
  props: {
    dataTable: {
      type: Array,
      default() {
        return [];
      },
    },
    fieldsTable: {
      type: Array,
      default() {
        return [];
      },
    },
    formatCurrency: {
      type: String,
      default: "",
    },
    formatDecimal: {
      type: Number,
      default: 0,
    },
    heightTable: {
      type: String,
      default: "",
    },
    isClearFilter: {
      type: Boolean,
      default: false,
    },
    statusOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      locale: this.$t("language") == "vn" ? vi : en,
      datePickerFormat: "dd/MM/yyyy",
      //filter danh sách đang hiển thị, còn cái search kia là cho toàn bộ danh sách ở database
      filterValues: null,
    };
  },
  watch: {
    isClearFilter(newVal) {
      if (newVal) {
        this.filterValues = null;
      }
    },
  },
  // mounted() {
  //   let rootStyle = getComputedStyle(document.body);
  //   console.log(rootStyle);
  //   const foregroundColor = rootStyle.getPropertyValue("--foreground-color").trim()
  //   console.log(foregroundColor);
  //   const element = document.getElementsByClassName('b-table-top-row')
  //   console.log(element);
  //   // if(element && element[0]) {
  //   //   element[0].style =
  //   // }
  // },
  methods: {
    showTextStatus(value) {
      const obj = this.statusOptions.find(item => item.value === value)
      return obj || {text: '', color: ''}
    },
    //liên quan đến convert tiền tệ
    convertCurrency(value) {
      if (!value) {
        return 0;
      }
      if (this.formatCurrency.toUpperCase() == "VN") {
        return Number(value).toLocaleString("vi-VN");
      } else if (this.formatCurrency.toUpperCase() == "EN") {
        return Number(value).toLocaleString("en-US");
      }
    },
    revertCurrency(val) {
      // console.log(val);
      let value = val.toString();
      // console.log(value);
      if (!value) {
        return "";
      }
      let newNumb;
      if (this.formatCurrency.toUpperCase() == "VN") {
        newNumb = value.replace(/\./g, "");
        newNumb = newNumb.replace(/,/g, ".");
      } else if (this.formatCurrency.toUpperCase() == "EN") {
        newNumb = value.replace(/,/g, "");
      }
      // console.log(newNumb);
      return newNumb;
    },
    currencyFormatFilter(value, field, form) {
      // console.log(value);
      // if (!value && value != 0) {
      // this[form][field].value = "";
      // return "";
      // }

      const rgx = /^[0-9\.,]*$/; //dãy số chứa dấu chấm, dấu phẩy
      if (!rgx.test(value)) {
        //thay thế các chỗ không phải là dãy số chứa dấu phẩm dấu chấm thành rỗng
        const newNumb = value.toString().replace(/[^0-9\.,]/g, "");
        // this[form][field][1] = newNumb;
        return newNumb;
      }
      let newNumb = this.revertCurrency(value);
      newNumb = Number(newNumb).toFixed(this.formatDecimal);
      newNumb = this.convertCurrency(newNumb);

      //kiểm tra có dấu chấm hoặc dấu phẩy cuối cùng ko
      const lastSeparator = value.toString()[value.toString().length - 1];
      if (lastSeparator === "." || lastSeparator === ",") {
        newNumb = newNumb + lastSeparator;
      }
      // this[form][field].value = newNumb;
      return newNumb;
    },
    convertDate(string) {
      if (string) {
        return moment(string).format("DD/MM/YYYY");
      }
      return string;
    },
    rowDblclicked(row) {
      this.$emit("rowDblclicked", row);
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
      clearTimeout(this.timeoutEmitFilter)
      this.timeoutEmitFilter = setTimeout(() => {
        this.$emit("onFilter", this.filterValues);
      }, 300)
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
.table-npl {
  .frame-filter {
    position: relative;
    .btn-delete-filter {
      width: 16px;
      height: 16px;
      position: absolute;
      z-index: 5;
      top: -5px;
      right: -5px;
      cursor: pointer;

      svg {
        transition: 0.3;
        &:hover {
          opacity: 0.9;
        }
        path {
          fill: #3a3a3a;
        }
      }
    }

    .vdp-datepicker {
      .vdp-datepicker__calendar {
        position: fixed;
      }
    }

    .vs__dropdown-menu {
      min-width: 100%;
    }
    .vs__selected-options {
      height: 34px;
      .vs__selected {
        padding: 5px 0 0 0 !important;
      }
    }
    .vs__search {
      display: none;
    }
    .custom-select {
      // height: 24px !important;
      &:focus {
        box-shadow: none;
      }
    }
  }

  .b-table-top-row {
    position: sticky;
    background: white;
    // background: $foreground-color;
    top: 43px;
    z-index: 2;
  }

  td,th {
    vertical-align: middle;
  }
  th {
    white-space: nowrap;
  }
}
</style>
