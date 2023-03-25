<template>
  <div class="mt-3 npl-form-fixation">
    <form ref="form" @submit.stop.prevent="emitSubmit" v-if="dataForm">
      <!-- check null dataForm.IsActive[1] -->
      <!-- !disableEdit(false) -->
      <b-row class="align-items-center">
        <b-col lg="2" xl="2">
          <b-form-group :label="dataForm.OID[0]">
            <b-form-input
              class="text-left"
              :value="dataForm.OID ? dataForm.OID[1] : 'AUTO'"
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="2" xl="2">
          <b-form-group :label="dataForm.ODate[0]">
            <b-form-input
              class="text-left"
              :value="dataForm.ODate[1]"
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <div class="text-info">
        <strong
          ><i class="fas fa-car-burst"></i>
          <span style="font-size: 12px">THÔNG TIN SỰ CỐ</span></strong
        >
      </div>
      <b-row class="align-items-center">
        <b-col lg="6" xl="6">
          <b-row>
            <b-col lg="4" xl="4">
              <b-form-group :label="dataForm.LicensePlates[0]">
                <b-form-input
                  class="text-left"
                  :value="dataForm.LicensePlates[1]"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="4">
              <b-form-group :label="dataForm.DriverName[0]">
                <b-form-input
                  class="text-left"
                  :value="dataForm.DriverName[1]"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="4">
              <b-form-group :label="dataForm.DriverPhone[0]">
                <b-form-input
                  type="number"
                  class="text-right"
                  :value="dataForm.DriverPhone[1]"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="8">
              <b-form-group :label="dataForm.IncidentsName[0]">
                <b-form-input
                  class="text-left"
                  :value="dataForm.IncidentsName[1]"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col lg="4" xl="4">
              <b-form-group :label="dataForm.RequestDate[0]">
                <b-form-input
                  class="text-left"
                  :value="dataForm.RequestDate[1]"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="4" xl="4">
          <b-form-group :label="dataForm.Note[0]">
            <b-form-textarea
              id="textarea"
              v-model="dataForm.Note[1]"
              rows="5"
              max-rows="5"
              disabled
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="4" xl="4">
          <div class="text-info">
            <strong
              ><i class="fas fa-location"></i>
              <span style="font-size: 12px">VỊ TRÍ</span></strong
            >
          </div>
        </b-col>
        <b-col lg="2" xl="2">
          <div class="text-info">
            <strong
              ><i class="fas fa-image"></i>
              <span style="font-size: 12px">Hình ảnh</span></strong
            >
          </div>
        </b-col>
        <b-col lg="4" xl="2">
          <div class="text-info">
            <strong
              ><i class="fas fa-user-check"></i>
              <span style="font-size: 12px">Thông tin xét duyệt</span></strong
            >
          </div>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import { en, vi } from "vuejs-datepicker/dist/locale";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ChildTable from "./ChildTable.vue";
import handling from "@/constants/handling";
import systemAPI from "@/api/modules/systemAPI";
import nplAPI from "@/api/modules/nplAPI";

export default {
  components: {
    "v-select": vSelect,
    ChildTable,
  },
  props: {
    dataForm: {
      type: Object,
      default: () => {},
    },
    disableAdd: {
      type: Boolean,
      default: true,
    },
    disableEdit: {
      type: Boolean,
      default: true,
    },
    apiForm: {
      type: String,
      default: "",
    },
    stateForm: {
      type: Object,
      default: () => {},
    },
    typeAction: {
      type: String,
      default: "",
    },
    dataFormOptions: {
      type: Object,
      default: () => {},
    },
    pDataTableChildren: {
      type: Array,
      default: () => [],
    },
    pDataCurrency: {
      type: Object,
      default: () => {},
    },
    pCurrentIndex: {
      type: Number,
      default: 0,
    },
  },
  setup() {},
};
</script>

<style lang="scss">
.npl-form-fixation {
  .vdp-datepicker {
    .form-control[readonly] {
      background: none;
    }
    .form-control[disabled] {
      background: #e9ecef;
    }
  }
}
</style>
