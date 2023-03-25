<template>
  <div class="input-select-custom">
    <template v-if="type === 'ID' || type === 'OID'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <b-form-input
          :value="arrData[1] || 'AUTO'"
          :disabled="disabled"
          :class="classInput"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else-if="type === 'DATE'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <datepicker
          v-model="arrData[1]"
          :language="locale"
          :format="datePickerFormat"
          :bootstrap-styling="true"
          :placeholder="$t('modal.day-select')"
          :disabled="disabled"
          @input="formatDateToServer"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else-if="type === 'SELECT'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <v-select
          v-model="arrData[1]"
          :options="options"
          :reduce="(item) => item.value"
          :disabled="disabled"
          @input="changeValue"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else-if="type === 'MONEY'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <b-form-input
          v-model="arrData[1]"
          :disabled="disabled"
          :class="classInput || 'text-right'"
          :formatter="currencyFormatInput"
          @input="changeValue"
          @change="changeValue"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else-if="type === 'NUMBER'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <b-form-input
          v-model="arrData[1]"
          :disabled="disabled"
          :class="classInput || 'text-right'"
          type="number"
          @input="changeValue"
          @change="changeValue"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else-if="type === 'NOTE'">
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <b-form-textarea
          v-model="arrData[1]"
          :disabled="disabled"
          :class="classInput"
          :rows="rows"
          :max-rows="maxRows"
          :style="styleCSS"
          @input="changeValue"
          @change="changeValue"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
    <template v-else>
      <b-form-group
        v-if="arrData"
        :label="arrData[0]"
        :invalid-feedback="$t('form.no-blank')"
        :state="arrData[3]"
      >
        <b-form-input
          v-model="arrData[1]"
          :disabled="disabled"
          :class="classInput"
          @input="changeValue"
        />
      </b-form-group>
      <span v-else> {{ textNoData + "??" }} </span>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import { en, vi } from "vuejs-datepicker/dist/locale";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    "v-select": vSelect,
  },
  props: {
    arrData: {
      type: Array || null,
      default() {
        return null;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    classInput: {
      type: String,
      default: "",
    },
    textNoData: {
      type: String,
      default: "textNoData",
    },
    formatDecimal: {
      type: Number,
      default: 0,
    },
    formatCurrency: {
      type: String,
      default: "",
    },
    rows: {
      type: String,
      default: "2",
    },
    maxRows: {
      type: String,
      default: "6",
    },
    styleCSS: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      locale: this.$t("language") == "vn" ? vi : en,
      datePickerFormat: "dd/MM/yyyy",
    };
  },
  computed: {
    type() {
      if (this.arrData) {
        return this.arrData[2] ? this.arrData[2].toUpperCase() : "";
      }
      return "";
    },
  },
  methods: {
    changeValue() {
      //reset lại state khi có input để nó mất cái dòng cảnh báo đi
      if (this.arrData[3] === false) {
        this.arrData[3] = true;
      }
      this.$emit("change", this.arrData[1]);
    },
    formatDateToServer(value) {
      if (this.arrData[3] === false) {
        this.arrData[3] = true;
      }
      this.arrData[1] = moment(value).format("YYYY-MM-DD");
      this.$emit("change", this.arrData[1]);
    },
    //liên quan đến convert tiền tệ
    convertCurrency(value) {
      if (!value) {
        return 0
      }
      if (this.formatCurrency.toUpperCase() == 'VN') {
        return Number(value).toLocaleString('vi-VN')
      }
      else if (this.formatCurrency.toUpperCase() == 'EN') {
        return Number(value).toLocaleString('en-US')
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
    currencyFormatInput(value) {
      if (this.arrData[3] === false) {
        this.arrData[3] = true;
      }

      if (!value) {
        this.arrData[1] = 0;
        return 0;
      }

      const rgx = /^[0-9\.,]*$/; //dãy số chứa dấu chấm, dấu phẩy
      if (!rgx.test(value)) {
        //thay thế các chỗ không phải là dãy số chứa dấu phẩm dấu chấm thành rỗng
        const newNumb = value.toString().replace(/[^0-9\.,]/g, "");
        this.arrData[1] = newNumb;
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
      this.arrData[1] = newNumb;
      return newNumb;
    },
  },
};
</script>

<style lang="scss">
.input-select-custom {
  .vdp-datepicker {
    .form-control {
      text-align: right;
    }
    .form-control[readonly] {
      background: none;
    }
    .form-control:disabled {
      background: #e9ecef;
    }
  }
  
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .vs__dropdown-menu {
    min-width: 100%;
  }
  .format-v-select {
    .vs__selected-options {
      .vs__selected {
        padding: 5px 0 0 0 !important;
      }
    }
  }
}
</style>
