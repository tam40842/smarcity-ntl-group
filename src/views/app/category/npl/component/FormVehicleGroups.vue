<template>
  <div>
    <template v-if="dataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="3">
            <b-row>
              <b-col lg="6">
                <b-form-group label="ID">
                  <b-form-input
                    :value="dataForm.ID ? dataForm.ID[1] : 'AUTO'"
                    disabled
                    class="text-center"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="dataForm.LemonID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.LemonID[3]"
                >
                  <b-form-input
                    v-model="dataForm.LemonID[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12">
                <b-form-group
                  v-if="dataForm.IsActive"
                  :label="dataForm.IsActive[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.IsActive[3]"
                >
                  <div class="d-flex">
                    <b-form-radio
                      v-model="dataForm.IsActive[1]"
                      :value="1"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                    >
                      {{ $t("npl.using") }}
                    </b-form-radio>
                    <b-form-radio
                      v-model="dataForm.IsActive[1]"
                      :value="0"
                      class="ml-2"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                    >
                      {{ $t("npl.not-use") }}
                    </b-form-radio>
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12">
                <b-form-group
                  :label="dataForm.Name[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.Name[3]"
                >
                  <b-form-input
                    v-model="dataForm.Name[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group
                  :label="dataForm.NameExtention1[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.NameExtention1[3]"
                >
                  <b-form-input
                    v-model="dataForm.NameExtention1[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group
                  :label="dataForm.UserID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.UserID[3]"
                >
                  <b-form-select
                    v-model="dataForm.UserID[1]"
                    :options="dataFormOptions.UserID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group :label="dataForm.Note[0]">
                  <b-form-textarea
                    v-model="dataForm.Note[1]"
                    rows="2"
                    max-rows="6"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <!-- <b-col lg="9"  v-if="false"> -->
          <b-col v-if="dataForm?.ID" lg="9">
            <ChildTable
              :title="$t('npl.vehicle-group.detail-vehicle')"
              :items="dataTable"
              :fields="fieldsTable"
              :currentMode="currentMode"
              tableName=""
              :isHideEdit="true"
              heightTable="calc(100vh - 315px)"
              @add="handleShowModal"
              @remove="removeVehicle"
            />
          </b-col>
          <!-- <b-col v-if="false" lg="9">
            <strong class="text-uppercase text-info">
              {{ $t("npl.vehicle-group.detail-vehicle") }}
            </strong>
            <b-table
              id="npl-table-basic-form"
              class="npl-table-basic-form border-bottom"
              :fields="fieldsTable"
              :items="dataTable"
              bordered
              head-variant="light"
              sticky-header
              style="max-height: 67vh"
            >
              <template #cell(IsSelected)="row">
                <b-form-checkbox
                  v-model="row.item.IsSelected"
                  :value="1"
                  :unchecked-value="0"
                  @change="(value) => changeChoose(value, row.item)"
                />
              </template>
              <template #empty>
                <div class="text-center font-italic text-muted">
                  {{ $t("data.non-data") }}
                </div>
              </template>
            </b-table>
          </b-col> -->
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
    <ModalTableVehicle
      :show="showModal"
      :fieldsTable="fieldsModalVehicle"
      :dataTable="dataModalVehicle"
      @hidden="showModal = false"
      @add="addVehicle"
      @onFilter="handleFilter"
    />
  </div>
</template>

<script>
import handling from "@/constants/handling.js";
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";

import dataFormOptions from "../mixin/dataFormOptionsMixin";
import ChildTable from "@/views/app/function/npl/kinh-doanh/component/ChildTable";
import ModalTableVehicle from "@/views/app/category/npl/component/ModalTableVehicle";

export default {
  components: {
    ChildTable,
    ModalTableVehicle,
  },
  mixins: [dataFormOptions],
  props: ["dataForm", "currentMode", "CategoryType", "isCallDataVehicle"],
  data() {
    return {
      colTypes: [],
      objectKeys: [],
      dataTable: [],
      dataModalVehicle: [],
      dataBeforeFilter: [],
      objectKeysModalVehicle: [],
      showModal: false,
    };
  },
  computed: {
    fieldsTable() {
      if (this.objectKeys.length > 0 && this.colTypes.length > 0) {
        let result = handling.mergeKeyDynamic(this.objectKeys, this.colTypes);
        result.forEach((item) => {
          if (
            // item.key === "LemonID" ||
            item.key === "Note" ||
            item.key === "IsActive"
          ) {
            item.sortable = false;
            item.thClass = "d-none";
            item.tdClass = "d-none";
          } else {
            item.sortable = false;
            item.tdClass = item.tdClass.replace("pt-2", "");
          }
        });
        // return result;
        return [
          // {
          //   key: "IsSelected",
          //   label: this.$t("choose"),
          //   thClass: "text-center",
          //   tdClass: "text-center",
          // },
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
    fieldsModalVehicle() {
      if (this.objectKeysModalVehicle.length > 0 && this.colTypes.length > 0) {
        let result = handling.mergeKeyDynamic(
          this.objectKeysModalVehicle,
          this.colTypes
        );
        result.forEach((item) => {
          item.sortable = false;
          item.tdClass = item.tdClass.replace("pt-2", "");
        });
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
    "$i18n.locale"(to, from) {
      this.getSelect();
      this.getColTypes("VehiclesRight");
    },
    dataForm(newVal) {
      if (newVal && newVal.ID) {
        this.getDataVehicle(newVal.ID[1]);
      } else {
        this.dataTable = [];
      }
    },
    isCallDataVehicle(newVal) {
      if(newVal) {
        this.getDataVehicle(this.dataForm.ID[1]);
      }
    }
  },
  created() {
    this.getSelect();
    this.getColTypes("VehiclesRight");
  },
  methods: {
    getSelect() {
      nplAPI
        .getUserList()
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            const dataIsActive = data.filter((item) => item.IsActive == 1);
            dataIsActive.forEach((item) => {
              const obj = {
                text: item.UserFullName,
                value: item.UserID,
              };
              newArr.push(obj);
            });
          }
          this.dataFormOptions = {
            ...this.dataFormOptions,
            UserID: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
    getDataVehicle(id) {
      let body = {
        TeamVehicleID: id,
      };
      nplAPI
        .getByTeamVehicleID(body)
        .then((val) => {
          this.dataTable = val.status ? val.data : [];

          if (this.dataTable.length) {
            this.objectKeys = Object.keys(this.dataTable[0]);
          } else {
            this.objectKeys = [];
          }
        })
        .catch((err) => console.log(err));
    },
    getByNotTeamVehicleID() {
      nplAPI
        .getByNotTeamVehicleID()
        .then((val) => {
          this.dataModalVehicle = val.status ? val.data : [];
          this.dataBeforeFilter = [...this.dataModalVehicle]
          this.showModal = true
          if (this.dataModalVehicle.length) {
            this.objectKeysModalVehicle = Object.keys(this.dataModalVehicle[0]);
          } else {
            this.objectKeysModalVehicle = [];
          }
        })
        .catch((err) => console.log(err));
    },
    getColTypes(string) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .tableFields(body)
        .then((val) => {
          this.colTypes = val.status ? val.data : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },
    handleShowModal() {
      this.getByNotTeamVehicleID();
      // setTimeout(() => {
      //   this.showModal = true;
      // }, 500);
    },
    addVehicle(value) {
      const combineList = [...value, ...this.dataTable];
      let body = {
        GeoCode: "TeamVehicle",
        GroupID: this.dataForm.ID[1],
        ListStationID: combineList.map((item) => item.ID).join(","),
      };

      this.showModal = false;
      this.dataTable = [...combineList]
      this.$emit('changeVehicle', body)
      // systemAPI
      //   .editStationRightsByList(body)
      //   .then((val) => {
      //     if (val.status) {
      //       this.showNotify("success", this.$t("toast.message"), val.message);
      //       this.getDataVehicle(this.dataForm.ID[1]);
      //     } else {
      //       this.showNotify("error", this.$t("toast.message"), val.message);
      //       this.getDataVehicle(this.dataForm.ID[1]);
      //     }
      //   })
      //   .catch((err) => console.log(err));
    },
    removeVehicle(obj) {
      const newList = this.dataTable.filter(item => item.ID != obj.item.ID)
      let body = {
        GeoCode: "TeamVehicle",
        GroupID: this.dataForm.ID[1],
        ListStationID: newList.map((item) => item.ID).join(","),
      };
      this.dataTable = [...newList]
      this.$emit('changeVehicle', body)

      // systemAPI
      //   .editStationRightsByList(body)
      //   .then((val) => {
      //     if (val.status) {
      //       this.showNotify("success", this.$t("toast.message"), val.message);
      //       this.getDataVehicle(this.dataForm.ID[1]);
      //     } else {
      //       this.showNotify("error", this.$t("toast.message"), val.message);
      //       this.getDataVehicle(this.dataForm.ID[1]);
      //     }
      //   })
      //   .catch((err) => console.log(err));
    },
    //liên quan đến filter trong cột table
    handleFilter(obj) {
      this.isClearFilter = false
      if (this.isFiltering(obj)) {
        const tempArr = this.filterFunc(obj, this.dataBeforeFilter)
        this.dataModalVehicle = [...tempArr]
        // if (tempArr.length) {
        //   this.loadDocumentByIndex(this.dataTable.length - 1);
        // }
      } else {
        //nếu không có giá trị filter nào thì load lại data
        this.dataModalVehicle = [...this.dataBeforeFilter];
      }
    },
    filterFunc(objFilter, arr = []) {
      if (!objFilter) return []
      const newArr = arr.filter(item => {
        for (const key in objFilter) {
          let value = objFilter[key].value
          if (objFilter[key].typeCol.toUpperCase() == 'DATE' && value) {
            value = moment(value).format('YYYY-MM-DD') || ''
          }
          else if (objFilter[key].typeCol.toUpperCase() == 'MONEY') {
            value = this.revertCurrency(value)
          }
          let valueCompare = item[key]
          if(valueCompare === null || valueCompare === undefined) {
            valueCompare = ''
          }
          if (!valueCompare.toString().toLowerCase().trim().includes(value.toString().toLowerCase().trim())) {
            return false
          }
        }
        return true;
      });
      return newArr;
    },
    isFiltering(obj) {
      //kiểm tra đang có giá trị filter ko?
      if (obj) {
        for (const key in obj) {
          if (obj[key].value || obj[key].value == 0) {
            return true
          }
        }
      }
      return false
    },
  },
};
</script>

<style lang="scss">
.npl-table-basic-form {
  &.b-table-sticky-header {
    margin-bottom: 0;
  }
}
</style>
