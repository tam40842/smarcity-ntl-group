<template>
  <b-modal
    id="modal-find-advance"
    :title="$t('modal-find.title')"
    size="lg"
    cancel-variant="outline-danger"
    :ok-title="$t('menu.search')"
    :cancel-title="$t('modal-find.reset')"
    @ok="search"
    @cancel="resetSearch"
    @hidden="hiddenModal"
  >
    <template v-for="(field, i) in dataSearch">
      <b-row :key="i" class="justify-content-between align-items-center mb-1">
        <template
          v-if="
            field.Name.toUpperCase() === 'ISACTIVE' ||
            field.Name.toUpperCase() === 'ISATTACHFILE' ||
            field.Name.toUpperCase() === 'ISLOCK'
          "
        >
          <b-col lg="6">
            <b-row class="align-items-center">
              <b-col lg="6">
                <strong>{{ field.Label }}</strong>
              </b-col>
              <b-col lg="6" class="pr-0">
                <div
                  style="width: 100%; white-space: nowrap"
                  class="text-right"
                >
                  <span style="color: #145388">
                    <b>
                      {{
                        field.OperatorDescription ||
                        $t("modal.choose-type-search")
                      }}
                    </b>
                  </span>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="6">
            <div>{{ $t("modal-find.value1") }}</div>
            <b-form-select
              v-model="field.Param1"
              :options="field.SearchOption"
            />
          </b-col>
        </template>
        <template v-else>
          <b-col lg="6">
            <b-row class="align-items-center">
              <b-col lg="6">
                <strong>{{ field.Label }}</strong>
              </b-col>
              <b-col lg="6" class="pr-0">
                <div
                  style="width: 100%; white-space: nowrap"
                  class="text-right"
                >
                  <span style="color: #145388">
                    <b>
                      {{
                        field.OperatorDescription ||
                        $t("modal.choose-type-search")
                      }}
                    </b>
                  </span>
                  <b-dropdown
                    class="title-dropdown ml-1"
                    variant="link"
                    toggle-class="text-decoration-none"
                  >
                    <b-dropdown-item
                      v-for="(option, index2) in field.SearchOption"
                      :key="index2"
                      @click="changeTypeSearch(option, field.Name)"
                    >
                      {{ option.text }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col
            v-if="field.Type.toUpperCase() == 'DATE'"
            lg="6"
            class="d-flex"
          >
            <div class="w-100">
              <div>{{ $t("modal-find.value1") }}</div>
              <datepicker
                v-model="field.Param1"
                :language="locale"
                :format="datePickerFormat"
                :bootstrap-styling="true"
                :placeholder="$t('modal.day-select')"
                @input="formatDateToServer(field.Param1, field)"
              />
            </div>
            <div v-if="field.Operator === 'between'" class="w-100 ml-2">
              <div>{{ $t("modal-find.value2") }}</div>
              <datepicker
                v-model="field.Param2"
                :language="locale"
                :placeholder="$t('modal.day-select')"
                :format="datePickerFormat"
                :bootstrap-styling="true"
                @input="formatDateToServer(field.Param2, field)"
              />
            </div>
          </b-col>
          <b-col
            v-else-if="field.Type.toUpperCase() == 'MONEY'"
            lg="6"
            class="d-flex"
          >
            <div class="w-100">
              <div>{{ $t("modal-find.value1") }}</div>
              <b-form-input
                v-model="field.Param1"
                :formatter="currencyFormatSearch"
              />
            </div>
            <div v-if="field.Operator === 'between'" class="w-100 ml-2">
              <div>{{ $t("modal-find.value2") }}</div>
              <b-form-input
                v-model="field.Param2"
                :formatter="currencyFormatSearch"
              />
            </div>
          </b-col>
          <b-col v-else lg="6" class="d-flex">
            <div class="w-100">
              <div>{{ $t("modal-find.value1") }}</div>
              <b-form-input v-model="field.Param1" />
            </div>
            <div v-if="field.Operator === 'between'" class="w-100 ml-2">
              <div>{{ $t("modal-find.value2") }}</div>
              <b-form-input v-model="field.Param2" />
            </div>
          </b-col>
        </template>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
import moment from "moment";
import datepickerMixin from "@/views/app/category/npl/mixin/datepickerMixin";

export default {
  mixins: [datepickerMixin],
  props: [
    "show",
    "methodsSearch",
    "dataSearch",
    "formatCurrency",
    "formatDecimal",
  ],
  watch: {
    show(newVal) {
      if (newVal) {
        this.$bvModal.show("modal-find-advance");
      } else {
        this.$bvModal.hide("modal-find-advance");
      }
    },
  },
  methods: {
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
      let value = val.toString();
      if (!value) {
        return 0;
      }
      let newNumb;
      if (this.formatCurrency.toUpperCase() == "VN") {
        newNumb = value.replace(/\./g, "");
        newNumb = newNumb.replace(/,/g, ".");
      } else if (this.formatCurrency.toUpperCase() == "EN") {
        newNumb = value.replace(/,/g, "");
      }
      return newNumb;
    },
    currencyFormatSearch(value) {
      console.log(value);
      // if (!value && value != 0) {
      //   // this[form][field].value = "";
      //   return "";
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
    changeTypeSearch(option, name) {
      const obj = this.dataSearch.find((item) => item.Name === name);
      obj.Operator = option.value;
      obj.OperatorDescription = option.text;
    },
    hiddenModal() {
      this.$emit("hidden");
    },
    search() {
      this.$emit("search", this.dataSearch);
    },
    resetSearch(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.$emit("resetSearch");
    },
    formatDateToServer(value, field) {
      const obj = this.dataSearch.find((item) => item.Name == field.Name);
      if (obj.Param1) {
        obj.Param1 = moment(obj.Param1).format("YYYY-MM-DD");
      }
      if (obj.Param2) {
        obj.Param2 = moment(obj.Param2).format("YYYY-MM-DD");
      }
    },
  },
};
</script>

<style lang="scss">
#modal-find-advance {
  .title-dropdown button {
    font-size: 20px;
    padding: 0;
  }
  .custom-select {
    height: 36px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
  .vdp-datepicker {
    .form-control[readonly] {
      background: none;
    }
  }
}
</style>
