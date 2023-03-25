<template>
  <div>
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="4">
            <b-row>
              <b-col lg="6">
                <InputSelect
                  :arrData="modifyDataForm.ID"
                  :disabled="true"
                  classInput="text-center"
                  textNoData="OID"
                />
              </b-col>
              <b-col lg="2" style="min-width: 153px">
                <InputSelect
                  :arrData="modifyDataForm.ODate"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  classInput="text-right"
                  textNoData="ODate"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6" style="min-width: 153px">
                <InputSelect
                  :arrData="modifyDataForm.ReferenceID"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  textNoData="ReferenceID"
                />
              </b-col>
              <b-col lg="6">
                <InputSelect
                  :arrData="modifyDataForm.PaymentTypesID"
                  :options="dataFormOptions.PaymentTypesID"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  textNoData="PaymentTypesID"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <InputSelect
                  :arrData="modifyDataForm.DriverQuantity"
                  :disabled="true"
                  classInput="text-right"
                  textNoData="DriverQuantity"
                />
              </b-col>
              <b-col lg="6">
                <InputSelect
                  :arrData="modifyDataForm.AdvanceMoney"
                  :disabled="true"
                  classInput="text-right"
                  textNoData="AdvanceMoney"
                />
              </b-col>
              <b-col lg="12">
                <InputSelect
                  :arrData="modifyDataForm.Note"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  textNoData="Note"
                />
              </b-col>
              <b-col lg="2">
                <LockStamp
                  :show="
                    modifyDataForm.IsActive && modifyDataForm.IsActive[1] == 1
                  "
                />
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="6">
            <ChildTable
              :title="$t('npl.detail-payment')"
              :items="childTable.AdvanceDriversDetails.items"
              :fields="getFieldsChildTable('AdvanceDriversDetails')"
              :currentMode="currentMode"
              tableName="AdvanceDriversDetails"
              :formatCurrency="formatCurrency"
              :formatDecimal="formatDecimal"
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
      size="lg"
      cancel-variant="outline-danger"
      :ok-title="$t('modal.change')"
      :cancel-title="$t('modal.cancel')"
      @ok="handleModalChildTable"
      @hidden="hiddenModalChildTable"
    >
      <template v-if="formModalAdd">
        <b-row>
          <b-col lg="6">
            <InputSelect
              :arrData="formModalAdd.nPLDriversID"
              :options="getSelectChildTable(dataFormOptions.nPLDriversID, 'AdvanceDriversDetails', 'nPLDriversID')"
              textNoData="nPLDriversID"
              @change="changenPLDriversID"
            />
          </b-col>
          <b-col lg="3">
            <InputSelect
              :arrData="formModalAdd.PhoneNumber"
              :disabled="true"
              textNoData="PhoneNumber"
            />
          </b-col>
          <b-col lg="3">
            <InputSelect
              :arrData="formModalAdd.Amount"
              :formatDecimal="formatDecimal"
              :formatCurrency="formatCurrency"
              textNoData="Amount"
            />
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import formMixin from "@/views/app/function/npl/kinh-doanh/mixin/formMixin";
import InputSelect from "@/views/app/function/npl/thu-ky/component/InputSelect";
import LockStamp from "@/views/app/function/npl/thu-ky/component/LockStamp";

export default {
  components: {
    InputSelect,
    LockStamp,
  },
  mixins: [formMixin],
  data() {
    return {
      childTable: {
        AdvanceDriversDetails: {
          items: [],
          objectKeys: [],
          colTypes: [],
          columnAdd: [],
        },
      },
      notRequiredChildTable: ["Action", "Note", "nPLDriversName"],
    };
  },
  watch: {
    "$i18n.locale"() {
      this.setUp();
    },
    dataForm(newVal) {
      if (newVal) {
        this.modifyDataForm = this.customDataFormToShow(newVal);
      } else {
        this.modifyDataForm = null;
      }
    },
    dataChildTable(newVal) {
      this.childTable.AdvanceDriversDetails.items = [...newVal];
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
      this.childTable.AdvanceDriversDetails.items = arr;
      this.childTable.AdvanceDriversDetails.objectKeys = objectKeys;
    },
    isTakeDataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToServer(this.modifyDataForm);
        if (obj) {
          obj.AdvanceDriversDetails =
            this.childTable.AdvanceDriversDetails.items;
        }
        this.$emit("getDataForm", obj);
      }
    },
    "childTable.AdvanceDriversDetails"() {
      this.changeQuantityAndTotal()
    },
  },
  created() {
    this.setUp();
  },
  methods: {
    setUp() {
      this.getDriver();
      this.getSelect("PaymentTypes", "PaymentTypesName", "PaymentTypesID");
      this.getColTypesChildTable(
        "AdvanceDriversDetails",
        "AdvanceDriversDetails"
      );
      this.getDynamicFormAddChildTable(
        "AdvanceDriversDetails",
        "AdvanceDriversDetails"
      );
    },
    getDriver() {
      nplAPI
        .getDriverListActive()
        .then((val) => {
          const arr = val.status ? val.data : [];
          const newArr = [];
          arr.forEach((item) => {
            newArr.push({
              label: item.nPLDriversName,
              value: item.ID.toString(),
              phoneNumber: item.PhoneNumber,
            });
          });
          this.dataFormOptions = {
            ...this.dataFormOptions,
            nPLDriversID: newArr
          }
        })
        .catch((err) => console.log(err));
    },
    changenPLDriversID(value) {
      if (this.formModalAdd) {
        const obj = this.dataFormOptions.nPLDriversID.find(
          (item) => item.value == value
        );
        this.formModalAdd.PhoneNumber[1] = obj?.phoneNumber || "";
        this.formModalAdd.PhoneNumber = [...this.formModalAdd.PhoneNumber];
      }
    },
    changeQuantityAndTotal() {
      //tính lượng tài xế và tổng tiền tạm ứng
      const arr = this.childTable.AdvanceDriversDetails.items
      this.modifyDataForm.DriverQuantity[1] = arr.length
      this.modifyDataForm.DriverQuantity = [...this.modifyDataForm.DriverQuantity]
      let sum = 0
      arr.forEach(item => {
        sum += Number(item.Amount)
      })
      this.modifyDataForm.AdvanceMoney[1] = this.convertCurrency(sum)
      this.modifyDataForm.AdvanceMoney = [...this.modifyDataForm.AdvanceMoney]
    }
  },
};
</script>
