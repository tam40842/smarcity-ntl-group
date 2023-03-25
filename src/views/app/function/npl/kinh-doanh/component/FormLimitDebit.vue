<template>
  <div class="form-detail-function">
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="3" class="adjust-width">
            <b-row>
              <b-col lg="8">
                <template v-if="modifyDataForm.ID">
                  <b-form-group
                    :label="modifyDataForm.ID ? modifyDataForm.ID[0] : 'OID'"
                  >
                    <b-form-input
                      :value="modifyDataForm?.ID[1] || 'AUTO'"
                      disabled
                      class="text-center"
                    />
                  </b-form-group>
                </template>
                <template v-else> ID?? </template>
              </b-col>
              <b-col lg="4">
                <template v-if="modifyDataForm.ODate">
                  <b-form-group
                    :label="modifyDataForm.ODate[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.ODate[3]"
                  >
                    <datepicker
                      v-model="modifyDataForm.ODate[1]"
                      :language="locale"
                      :format="datePickerFormat"
                      :bootstrap-styling="true"
                      :placeholder="$t('modal.day-select')"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="
                        formatDateToServer(
                          modifyDataForm.ODate[1],
                          'ODate',
                          'modifyDataForm'
                        )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else> ODate?? </template>
              </b-col>
              <b-col lg="12">
                <template v-if="modifyDataForm.nPLCustomersID">
                  <b-form-group
                    :label="modifyDataForm.nPLCustomersID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.nPLCustomersID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.nPLCustomersID[1]"
                      :options="dataFormOptions.nPLCustomersID"
                      :reduce="(item) => item.value"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="
                        changeCustomer('nPLCustomersID', 'modifyDataForm')
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else> nPLCustomersID?? </template>
              </b-col>
              <b-col lg="12">
                <b-form-group
                  :label="$t('npl.address')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input v-model="address" disabled />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="$t('npl.phoneNumber')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input
                    v-model="phoneNumber"
                    disabled
                    class="text-right"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="$t('npl.email')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input v-model="email" disabled />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="3" class="adjust-width">
            <b-row>
              <b-col lg="6">
                <template v-if="modifyDataForm.CreditLimit">
                  <b-form-group
                    :label="modifyDataForm.CreditLimit[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.CreditLimit[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.CreditLimit[1]"
                      class="text-right"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      :formatter="
                        (value) =>
                          currencyFormatInput(
                            value,
                            'CreditLimit',
                            'modifyDataForm'
                          )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else>CreditLimit?</template>
              </b-col>
              <b-col lg="6">
                <template v-if="modifyDataForm.TimeToPay">
                  <b-form-group
                    :label="modifyDataForm.TimeToPay[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.TimeToPay[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.TimeToPay[1]"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      type="number"
                      class="text-right"
                      @input="resetStateInput('TimeToPay', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else>TimeToPay?</template>
              </b-col>
              <b-col lg="6">
                <template v-if="modifyDataForm.Deviant">
                  <b-form-group
                    :label="modifyDataForm.Deviant[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.Deviant[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.Deviant[1]"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      type="number"
                      class="text-right"
                      @input="resetStateInput('Deviant', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else>Deviant?</template>
              </b-col>
              <b-col lg="6">
                <template v-if="modifyDataForm.IsLock">
                  <b-form-group
                    v-if="modifyDataForm.IsLock"
                    :label="modifyDataForm.IsLock[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.IsLock[3]"
                  >
                    <div class="d-flex">
                      <b-form-radio
                        v-model="modifyDataForm.IsLock[1]"
                        :value="1"
                        :disabled="
                          currentMode === 'adding' || currentMode === 'editing'
                            ? false
                            : true
                        "
                      >
                        {{ $t("npl.button.yes") }}
                      </b-form-radio>
                      <b-form-radio
                        v-model="modifyDataForm.IsLock[1]"
                        :value="0"
                        class="ml-2"
                        :disabled="
                          currentMode === 'adding' || currentMode === 'editing'
                            ? false
                            : true
                        "
                      >
                        {{ $t("npl.button.no") }}
                      </b-form-radio>
                    </div>
                  </b-form-group>
                </template>
                <template v-else> IsLock? </template>
              </b-col>
              <b-col lg="12">
                <template v-if="modifyDataForm.Note">
                  <b-form-group :label="modifyDataForm.Note[0]">
                    <b-form-textarea
                      v-model="modifyDataForm.Note[1]"
                      rows="2"
                      max-rows="6"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      style="height: 113px"
                    />
                  </b-form-group>
                </template>
                <template v-else> Note?? </template>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="2">
            <div
              v-if="modifyDataForm.IsActive && modifyDataForm.IsActive[1] == 1"
              class="img-lock"
            >
              <img
                src="/assets/img/npl/img-lock.png"
                alt=""
                style="height: 60px"
              >
            </div>
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import formMixin from "@/views/app/function/npl/kinh-doanh/mixin/formMixin";

export default {
  mixins: [formMixin],
  data() {
    return {
      notRequired: [
        "ID",
        "OID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "IsActive",
      ],
      notRequiredChildTable: [
        "GoodsTypeName",
        "DeviantAllowance",
        "DeviantMonthAllowance",
        "Action",
        "Note",
      ],
      childTable: {
        ShippingAndCreditnPLDetailList: {
          items: [],
          objectKeys: [],
          colTypes: [],
          columnAdd: [],
        },
      },
      address: "",
      phoneNumber: "",
      email: "",
    };
  },
  computed: {
    totalCostsIncurred() {
      //Tổng chi phí phát sinh
      let sum = 0;
      const arr = this.childTable.ShippingAndCreditnPLDetailList.items;
      if (arr.length > 0) {
        arr.forEach((item) => {
          sum += Number(item.Amount);
        });
      }
      return this.convertCurrency(sum);
    },
  },
  watch: {
    "$i18n.locale"() {
      this.setUp();
    },
    dataForm(newVal) {
      if (newVal) {
        this.modifyDataForm = this.customDataFormToShow(newVal);
        if (this.modifyDataForm.nPLCustomersID) {
          this.changeCustomer("nPLCustomersID", "modifyDataForm");
        }
      } else {
        this.dataFormRoute = null;
        this.modifyDataForm = null;
      }
    },
    isTakeDataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToServer(this.modifyDataForm);
        this.$emit("getDataForm", obj);
      }
    },
  },
  created() {
    this.setUp();
  },
  methods: {
    setUp() {
      this.getCustomer();
    },
    getRoute() {
      nplAPI
        .getRoutesActive()
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              newArr.push({
                label: item.RoutesName,
                value: item.ID.toString(),
                code: item.Code,
              });
            });
          }
          this.dataFormOptions = {
            ...this.dataFormOptions,
            RouteID: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
    getCustomer() {
      nplAPI
        .getCustomerListActive()
        // .getCustomerList()
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              newArr.push({
                label: item.nPLCustomersName,
                value: item.ID.toString(),
                address: item.nPLCustomersAddress,
                phoneNumber: item.PhoneNumber,
                email: item.Email,
              });
            });
          }
          this.dataFormOptions = {
            ...this.dataFormOptions,
            nPLCustomersID: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
    changeCustomer(field1, form) {
      this.resetStateInput(field1, form);
      const value = this[form][field1][1];
      // console.log(this.dataFormOptions[field1]);
      const obj = this.dataFormOptions[field1].find(
        (item) => item.value == value
      );
      // console.log(obj);
      this.address = obj?.address || "";
      this.phoneNumber = obj?.phoneNumber || "";
      this.email = obj?.email || "";
    },
    changeVAT(field1, field2, field3, form) {
      this.resetStateInput(field1, form);
      this.resetStateInput(field2, form);
      const numbBeforeVAT = Number(this.revertCurrency(this[form][field1][1]));
      const vat = Number(this[form][field2][1]) / 100;
      const numVAT = numbBeforeVAT * vat;
      const numbAfterVAT = numbBeforeVAT + numVAT;
      this[form][field3][1] = this.convertCurrency(numbAfterVAT);
    },
  },
};
</script>

<style lang="scss">
// .body-modal-add {
//   .custom-select {
//     font-size: 0.8rem;
//     padding: 0.5rem 0.6rem;
//     height: 36px;
//   }
// }
.form-detail-function {
  .adjust-width {
    @media (min-width: 500px) {
      min-width: 430px
    }
  }
} 
</style>
