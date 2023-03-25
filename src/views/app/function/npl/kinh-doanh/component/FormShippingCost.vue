<template>
  <div>
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="7">
            <b-row>
              <b-col lg="4">
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
              <b-col lg="2">
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
              <b-col lg="2">
                <div
                  v-if="
                    modifyDataForm.IsActive && modifyDataForm.IsActive[1] == 1
                  "
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
            <b-row>
              <b-col lg="6">
                <template v-if="modifyDataForm.RouteID">
                  <b-form-group
                    :label="modifyDataForm.RouteID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.RouteID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.RouteID[1]"
                      :options="dataFormOptions.RouteID"
                      :reduce="(item) => item.value"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="resetStateInput('RouteID', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else> RouteID?? </template>
              </b-col>
              <b-col lg="3">
                <template v-if="modifyDataForm.OrderTypeID">
                  <b-form-group
                    :label="modifyDataForm.OrderTypeID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.OrderTypeID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.OrderTypeID[1]"
                      :options="dataFormOptions.OrderTypeID"
                      :reduce="(item) => item.value"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="resetStateInput('OrderTypeID', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else> OrderTypeID?? </template>
              </b-col>
              <b-col lg="3">
                <template v-if="modifyDataForm.GoodsTypeID">
                  <b-form-group
                    :label="modifyDataForm.GoodsTypeID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.GoodsTypeID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.GoodsTypeID[1]"
                      :options="dataFormOptions.GoodsTypeID"
                      :reduce="(item) => item.value"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="resetStateInput('GoodsTypeID', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else> GoodsTypeID?? </template>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
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
              <b-col lg="6">
                <template v-if="modifyDataForm.SpecialRequirementID">
                  <b-form-group
                    :label="modifyDataForm.SpecialRequirementID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.SpecialRequirementID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.SpecialRequirementID[1]"
                      :options="dataFormOptions.SpecialRequirementID"
                      :reduce="(item) => item.value"
                      multiple
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="
                        resetStateInput(
                          'SpecialRequirementID',
                          'modifyDataForm'
                        )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else> SpecialRequirementID?? </template>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <b-form-group
                  :label="$t('npl.address')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input v-model="address" disabled />
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <template v-if="modifyDataForm.nPLUnitsID">
                  <b-form-group
                    :label="modifyDataForm.nPLUnitsID[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.nPLUnitsID[3]"
                  >
                    <v-select
                      v-model="modifyDataForm.nPLUnitsID[1]"
                      :options="dataFormOptions.nPLUnitsID"
                      :reduce="(item) => item.value"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      @input="resetStateInput('nPLUnitsID', 'modifyDataForm')"
                    />
                  </b-form-group>
                </template>
                <template v-else> nPLUnitsID?? </template>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="3">
                <b-form-group
                  :label="$t('npl.phoneNumber')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input v-model="phoneNumber" disabled class="text-right" />
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group
                  :label="$t('npl.email')"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="true"
                >
                  <b-form-input v-model="email" disabled />
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <template v-if="modifyDataForm.NonVATPrices">
                  <b-form-group
                    :label="modifyDataForm.NonVATPrices[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.NonVATPrices[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.NonVATPrices[1]"
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
                            'NonVATPrices',
                            'modifyDataForm'
                          )
                      "
                      @input="
                        changeVAT(
                          'NonVATPrices',
                          'PercentVAT',
                          'VATPrices',
                          'modifyDataForm'
                        )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else>NonVATPrices?</template>
              </b-col>
              <b-col lg="2">
                <template v-if="modifyDataForm.PercentVAT">
                  <b-form-group
                    :label="modifyDataForm.PercentVAT[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.PercentVAT[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.PercentVAT[1]"
                      class="text-right"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      type="number"
                      @input="
                        changeVAT(
                          'NonVATPrices',
                          'PercentVAT',
                          'VATPrices',
                          'modifyDataForm'
                        )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else>PercentVAT?</template>
              </b-col>
              <b-col lg="2">
                <template v-if="modifyDataForm.VATPrices">
                  <b-form-group
                    :label="modifyDataForm.VATPrices[0]"
                    :invalid-feedback="$t('form.no-blank')"
                    :state="modifyDataForm.VATPrices[3]"
                  >
                    <b-form-input
                      v-model="modifyDataForm.VATPrices[1]"
                      class="text-right"
                      disabled
                      :formatter="
                        (value) =>
                          currencyFormatInput(
                            value,
                            'VATPrices',
                            'modifyDataForm'
                          )
                      "
                    />
                  </b-form-group>
                </template>
                <template v-else> VATPrices?? </template>
              </b-col>
            </b-row>
            <b-row>
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
                    />
                  </b-form-group>
                </template>
                <template v-else> Note?? </template>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="4">
            <ChildTable
              :title="$t('npl.info-costs-incurred')"
              :items="childTable.ShippingAndCreditnPLDetailList.items"
              :fields="getFieldsChildTable('ShippingAndCreditnPLDetailList')"
              :currentMode="currentMode"
              tableName="ShippingAndCreditnPLDetailList"
              :formatCurrency="formatCurrency"
              :formatDecimal="formatDecimal"
              :isShowTotal="true"
              :otherValue="totalCostsIncurred"
              @add="addChildTable"
              @edit="editChildTable"
              @remove="removeChildTable"
            />
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
    <b-modal
      id="modal-child-table"
      :title="$t('modal.add')"
      body-class="body-modal-add"
      size="md"
      cancel-variant="outline-danger"
      :ok-title="$t('modal.change')"
      :cancel-title="$t('modal.cancel')"
      @ok="handleModalChildTable"
      @hidden="hiddenModalChildTable"
    >
      <template v-if="formModalAdd">
        <b-row>
          <b-col lg="8">
            <template v-if="formModalAdd.CostIncurredsID">
              <b-form-group
                :label="formModalAdd.CostIncurredsID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="formModalAdd.CostIncurredsID[3]"
              >
                <v-select
                  v-model="formModalAdd.CostIncurredsID[1]"
                  :options="getSelectChildTable(dataFormOptions.CostIncurredsID, tableName, 'CostIncurredsID')"
                  :reduce="(item) => item.value"
                  @input="resetStateInput('CostIncurredsID', 'formModalAdd')"
                />
              </b-form-group>
            </template>
            <template v-else>CostIncurredsID?</template>
          </b-col>
          <b-col lg="4">
            <template v-if="formModalAdd.Amount">
              <b-form-group
                :label="formModalAdd.Amount[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="formModalAdd.Amount[3]"
              >
                <b-form-input
                  v-model="formModalAdd.Amount[1]"
                  class="text-right"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  :formatter="
                    (value) =>
                      currencyFormatInput(value, 'Amount', 'formModalAdd')
                  "
                  @input="resetStateInput('Amount', 'formModalAdd')"
                />
              </b-form-group>
            </template>
            <template v-else>Amount?</template>
          </b-col>
        </b-row>
      </template>
    </b-modal>
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
        if(this.modifyDataForm.nPLCustomersID) {
          this.changeCustomer('nPLCustomersID', 'modifyDataForm')
        }
      } else {
        this.dataFormRoute = null;
        this.modifyDataForm = null;
      }
    },
    dataChildTable(newVal) {
      const arr = [];
      if (newVal && newVal.length > 0) {
        newVal.forEach((item) => {
          arr.push({
            ...item,
            ID: this.randomString(10),
          });
        });
      }
      const objectKeys = arr.length > 0 ? Object.keys(arr[0]) : [];
      this.childTable.ShippingAndCreditnPLDetailList.items = arr;
      this.childTable.ShippingAndCreditnPLDetailList.objectKeys = objectKeys;
    },
    isTakeDataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToServer(this.modifyDataForm);
        if (obj) {
          obj.ShippingAndCreditnPLDetailList =
            this.childTable.ShippingAndCreditnPLDetailList.items;
        }
        this.$emit("getDataForm", obj);
      }
    },
  },
  created() {
    this.setUp();
  },
  methods: {
    setUp() {
      this.getRoute();
      this.getCustomer();
      this.getSelect("OrderTypes", "OrderTypesName", "OrderTypeID");
      this.getSelect("NPLUnits", "NPLUnitsName", "nPLUnitsID");
      this.getSelect("CostIncurreds", "CostIncurredsName", "CostIncurredsID");
      this.getSelect(
        "Specialrequirements",
        "SpecialrequirementsName",
        "SpecialRequirementID"
      );
      this.getSelect("GoodsTypes", "GoodsTypesName", "GoodsTypeID");
      this.getColTypesChildTable(
        "ShippingAndCreditnPLDetail",
        "ShippingAndCreditnPLDetailList"
      );
      this.getDynamicFormAddChildTable(
        "ShippingAndCreditnPLDetail",
        "ShippingAndCreditnPLDetailList"
      );
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
      this.address = obj?.address || '';
      this.phoneNumber = obj?.phoneNumber || '';
      this.email = obj?.email || '';
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
.body-modal-add {
  .custom-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.6rem;
    height: 36px;
  }
}
</style>
