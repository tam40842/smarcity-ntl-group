<template>
  <div>
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="6">
            <div>
              <strong class="text-uppercase text-info">
                <i class="fas fa-file-invoice-dollar" />
                {{ $t("npl.document-info") }}
              </strong>
            </div>
            <b-row>
              <b-col lg="4">
                <InputSelect
                  :arrData="modifyDataForm.ID"
                  :disabled="true"
                  classInput="text-center"
                  textNoData="OID"
                />
              </b-col>
              <b-col lg="3" style="min-width: 153px">
                <InputSelect
                  :arrData="modifyDataForm.ODate"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  textNoData="ODate"
                />
              </b-col>
              <b-col lg="3" style="min-width: 153px">
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
            </b-row>
            <b-row>
              <b-col lg="9">
                <InputSelect
                  :arrData="modifyDataForm.ChargingStationsID"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  classInput="text-center"
                  textNoData="ChargingStationsID"
                  :options="dataFormOptions.ChargingStationsID"
                  @change="
                    changeChargingStationsID(
                      'ChargingStationsID',
                      'Free',
                      'modifyDataForm'
                    )
                  "
                />
              </b-col>
              <b-col lg="3">
                <InputSelect
                  :arrData="modifyDataForm.Free"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  classInput="text-right"
                  textNoData="Free"
                  :formatDecimal="formatDecimal"
                  :formatCurrency="formatCurrency"
                  @change="
                    changeTotal(
                      'Free',
                      'VehicleQuantity',
                      'Total',
                      'modifyDataForm'
                    )
                  "
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="3">
                <InputSelect
                  :arrData="modifyDataForm.FromDate"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  classInput="text-right"
                  textNoData="FromDate"
                />
              </b-col>
              <b-col lg="3">
                <InputSelect
                  :arrData="modifyDataForm.ToDate"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  classInput="text-right"
                  textNoData="ToDate"
                />
              </b-col>
              <b-col lg="3">
                <InputSelect
                  :arrData="modifyDataForm.VehicleQuantity"
                  :disabled="true"
                  classInput="text-right"
                  textNoData="VehicleQuantity"
                />
              </b-col>
              <b-col lg="3">
                <InputSelect
                  :arrData="modifyDataForm.Total"
                  :disabled="true"
                  classInput="text-right"
                  textNoData="Total"
                />
              </b-col>
            </b-row>
            <b-row>
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
              :title="$t('npl.detail-vehicle')"
              :items="childTable.MonthlyTicketsDetails.items"
              :fields="fieldsTableVehicle"
              :currentMode="currentMode"
              tableName="MonthlyTicketsDetails"
              :formatCurrency="formatCurrency"
              :formatDecimal="formatDecimal"
              :isHideEdit="true"
              heightTable="calc(100vh - 250px)"
              @add="showModal = true"
              @remove="removeVehicle"
            />
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
    <ModalTableVehicle
      :show="showModal"
      :fieldsTable="fieldsTableVehicle"
      :dataTable="dataTableModal"
      @hidden="showModal = false"
      @add="addVehicle"
    />
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import handling from "@/constants/handling.js";
import systemAPI from "@/api/modules/systemAPI";
import formMixin from "@/views/app/function/npl/kinh-doanh/mixin/formMixin";
import InputSelect from "@/views/app/function/npl/thu-ky/component/InputSelect";
import LockStamp from "@/views/app/function/npl/thu-ky/component/LockStamp";
import ModalTableVehicle from "@/views/app/function/npl/thu-ky/component/ModalTableVehicle";

export default {
  components: {
    InputSelect,
    LockStamp,
    ModalTableVehicle,
  },
  mixins: [formMixin],
  data() {
    return {
      childTable: {
        MonthlyTicketsDetails: {
          items: [],
          objectKeys: [],
          colTypes: [],
          columnAdd: [],
        },
      },
      dataTableModal: [],
      vehicleListAll: [],
      showModal: false,
    };
  },
  computed: {
    fieldsTableVehicle() {
      const objectKeys = this.childTable.MonthlyTicketsDetails.objectKeys;
      const colTypes = this.childTable.MonthlyTicketsDetails.colTypes;
      if (objectKeys.length > 0 && colTypes.length > 0) {
        let result = this.mergeKeyDynamic(objectKeys, colTypes);
        return [
          ...result,
          {
            key: "Action",
            label: this.$t("npl.action"),
            typeCol: "Action",
            thClass: "text-center",
            tdClass: "text-center",
          },
        ];
      }
      return [];
    },
  },
  watch: {
    "$i18n.locale"() {
      this.getVehicle();
      this.getSelect(
        "ChargingStations",
        "ChargingStationsName",
        "ChargingStationsID"
      );
      this.getColTypesChildTable(
        "MonthlyTicketsDetails",
        "MonthlyTicketsDetails"
      );
    },
    dataForm(newVal) {
      if (newVal) {
        this.modifyDataForm = this.customDataFormToShow(newVal);
      } else {
        this.modifyDataForm = null;
      }
    },
    dataChildTable(newVal) {
      this.childTable.MonthlyTicketsDetails.items = [...newVal];
      this.childTable = { ...this.childTable };
    },
    isTakeDataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToServer(this.modifyDataForm);
        if (obj) {
          obj.MonthlyTicketsDetails =
            this.childTable.MonthlyTicketsDetails.items;
        }
        this.$emit("getDataForm", obj);
      }
    },
    showModal(newVal) {
      if (newVal) {
        const selectedArr = this.childTable.MonthlyTicketsDetails.items;
        this.dataTableModal = this.vehicleListAll.filter((item) => {
          const obj = selectedArr.find(
            (item2) => item2.VehiclesID == item.VehiclesID
          );
          if (!obj) {
            return true;
          } else {
            return false;
          }
        });
      }
    },
    childTable() {
      if (this.modifyDataForm) {
        this.modifyDataForm.VehicleQuantity[1] =
          this.childTable.MonthlyTicketsDetails.items.length;
        this.modifyDataForm.VehicleQuantity = [
          ...this.modifyDataForm.VehicleQuantity,
        ]; //--> cho nó render cái mảng truyền vào component
      }
    },
    "modifyDataForm.VehicleQuantity"() {
      this.changeTotal("Free", "VehicleQuantity", "Total", "modifyDataForm");
    },
    "modifyDataForm.Free"() {
      this.changeTotal("Free", "VehicleQuantity", "Total", "modifyDataForm");
    },
  },
  created() {
    this.getVehicle();
    this.getSelect(
      "ChargingStations",
      "ChargingStationsName",
      "ChargingStationsID"
    );
    this.getColTypesChildTable(
      "MonthlyTicketsDetails",
      "MonthlyTicketsDetails"
    );
  },
  methods: {
    getVehicle() {
      let body = {
        TeamVehicleID: "%",
      };
      nplAPI
        .getByTeamVehicleID(body)
        .then((val) => {
          const arr = val.status ? val.data : [];
          const newArr = [];
          arr.forEach((item) => {
            newArr.push({
              VehiclesID: item.ID,
              LicensePlates: item.LicensePlates,
              nPLDriversName: item.nPLDriversName,
              VehicleGroupsName: item.VehicleGroupsName,
            });
          });
          const objectKeys = newArr.length > 0 ? Object.keys(newArr[0]) : [];
          this.childTable.MonthlyTicketsDetails.objectKeys = objectKeys;
          this.vehicleListAll = newArr;
        })
        .catch((err) => console.log(err));
    },
    getColTypesChildTable(string, tableName) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .tableFields(body)
        .then((val) => {
          this.childTable[tableName].colTypes = val.status ? val.data : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTotal(field1, field2, field3, form) {
      if (this[form]) {
        const num1 = Number(this.revertCurrency(this[form][field1][1]));
        const num2 = Number(this.revertCurrency(this[form][field2][1]));
        this[form][field3][1] = this.convertCurrency(num1 * num2);
        // this[form] = { ...this[form] };
        this[form][field3] = [...this[form][field3]]; //thay đổi địa chỉ mảng cho render lại
      }
    },
    changeChargingStationsID(field1, field2, form) {
      if (this[form]) {
        const value = this[form][field1][1];
        const obj = this.dataFormOptions[field1].find(
          (item) => item.value == value
        );
        const monthlyFare = obj?.monthlyFare || "";
        this[form][field2][1] = this.convertCurrency(monthlyFare);
        this[form][field2] = [...this[form][field2]]; //thay đổi địa chỉ mảng cho render lại
      }
    },
    removeVehicle(value) {
      const selectedArr = this.childTable.MonthlyTicketsDetails.items;
      const newArr = selectedArr.filter(
        (item) => item.VehiclesID != value.item.VehiclesID
      );
      this.childTable.MonthlyTicketsDetails.items = newArr;
      this.childTable = { ...this.childTable };
    },
    addVehicle(value) {
      this.showModal = false;
      const arr = this.childTable.MonthlyTicketsDetails.items;
      this.childTable.MonthlyTicketsDetails.items = [...arr, ...value];
      this.childTable = { ...this.childTable };
    },
  },
};
</script>
