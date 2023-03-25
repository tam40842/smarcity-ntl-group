<template>
  <div id="app-content-full" class="crown-category">
    <b-card>
      <ActionsHeaderTree
        :currentIndex="currentIndex"
        :currentTotalIndex="dataTable?.length"
        :showImport="false"
        :disableAdd="disableAdd"
        :disableEdit="disableEdit"
        :disableDelete="disableDelete"
        :disableSave="disableSave"
        :disableCancel="disableCancel"
        :disableCopy="disableCopy"
        :disableAttachFile="disableAttachFile"
        :disablePrint="disablePrint"
        :disableFind="disableFind"
        :showCopy="false"
        :showBlock="false"
        @change-actions="handleChangeActions"
        @first-index="updateFirstIndex"
        @pre-index="updatePreIndex"
        @next-index="updateNextIndex"
        @last-index="updateLastIndex"
      />
      <b-tabs v-model="currentTab" nav-class="d-none" class="box-content">
        <b-tab>
          <div class="mt-2">
            <template v-if="dataTable && dataTable.length > 0">
              <DynamicTableTree
                :id="'units-npl'"
                ref="tableDynamic"
                :pStatus="{
                  color1: 'green',
                  label1: 'Đang dùng',
                  color2: 'gray',
                  label2: 'Chưa dùng',
                }"
                style="margin-top: -20px"
                :pFormatCurrency="dataCurrency"
                :field-table="fields"
                :data-table="dataTable"
                :bordered="true"
                :isSearch="false"
                :isPagination="false"
                @dbclick="handleDbClick"
              />
            </template>
            <template v-else>
              <div class="text-center font-italic text-muted p-3 bg-light">
                {{ $t("panel.non-data") }}
              </div>
            </template>
          </div>
        </b-tab>
        <b-tab>
          <div class="mt-2">
            <Title :title="objectData?.formName" :inject="$t('major')" />
            <template v-if="dataByID">
              <FormCategoryTree
                ref="formSchedules"
                :dataForm="dataForm"
                :LightID="dataFormOptions.LightID"
                :ActionID="dataFormOptions.ActionID"
                :CustomAction="dataFormOptions.CustomAction"
                :isPagination="true"
                :disableAdd="disableAdd"
                :disableEdit="disableEdit"
                :stateForm="stateForm"
                :apiForm="apiForm"
                :typeAction="typeAction"
                :pDataTableChildren="dataTableChildren"
                :dataCurrency="dataCurrency"
                :pCurrentIndex="currentIndex"
                @emitSubmit="handleEmitSubmit"
              />
            </template>
            <template v-else>
              <div class="text-center font-italic text-muted p-3 bg-light">
                {{ $t("panel.non-data") }}
              </div>
            </template>
          </div>
        </b-tab>
        <b-tab>
          <div class="box-content mt-2">
            <table-history-tree
              v-if="dataHistory && dataHistory.length > 0"
              :fields="fieldsHistory"
              :items="dataHistory"
            />
            <template v-else>
              <div class="text-center font-italic text-muted p-3 bg-light">
                {{ $t("panel.non-data") }}
              </div>
            </template>
          </div>
        </b-tab>
        <b-tab>
          <div class="box-content mt-2">
            <table-list-file
              v-if="dataAttachFile && dataAttachFile.length > 0"
              :fields="fieldsAttachFile"
              :items="dataAttachFile"
              @removeFile="removeAttachFile"
              @editFile="editAttachFile"
            />
            <template v-else>
              <div class="text-center font-italic text-muted p-3 bg-light">
                {{ $t("panel.non-data") }}
              </div>
            </template>
          </div>
        </b-tab>
      </b-tabs>
      <ActionsFooterTree :activeFocus="currentTab" @change-tab="updateTab" />
    </b-card>
    <ModalAttachFileTree
      :show="showModalAttachFile"
      :formEdit="formEditAttachFile"
      @submitData="handleAttachFile"
      @hidden="showModalAttachFile = false"
    />
    <ModalImportExcel
      :show="showModalImportExcel"
      @submitData="handleImportExcel"
      @hidden="showModalImportExcel = false"
    />
    <ModalNotifyImportExcel
      :show="showModalNotifyImportExcel"
      :dataNotify="dataNotifyImportExcel"
      @hidden="showModalNotifyImportExcel = false"
    />
    <ModalPrint
      :show="showModalPrint"
      :dataPrint="dataPrint"
      @formPrint="handlePrint"
      @hidden="showModalPrint = false"
    />
    <ModalFind
      :show="showModalFind"
      :filteredSearch="filteredSearch"
      @hidden="showModalFind = false"
      @search="handleSearch"
      @resetSearch="resetSearch"
    />
  </div>
</template>
<script>
import handling from "@/constants/handling";
import { timer } from "@/constants/config";
import systemAPI from "@/api/modules/systemAPI";
import treeAPI from "@/api/modules/treeAPI";
import ActionsHeaderTree from "@/components/Tree/ActionsHeaderTree.vue";
import ActionsFooterTree from "@/components/Tree/ActionsFooterTree.vue";
import DynamicTableTree from "@/components/Tree/DynamicTableTree.vue";
import FormCategoryTree from "./component/FormCategoryLight.vue";
import TableHistoryTree from "@/components/Tree/TableHistoryTree.vue";
import TableListFile from "@/components/Tree/TableListFile.vue";
import ModalAttachFileTree from "@/components/Tree/ModalAttachFileTree.vue";
import ModalPrint from "@/components/Tree/ModalPrint.vue";
import ModalImportExcel from "@/components/Tree/ModalImportExcel.vue";
import ModalNotifyImportExcel from "@/components/Tree/ModalNotifyImportExcel.vue";
import ModalFind from "@/components/Tree/ModalFind.vue";
import nplAPI from "@/api/modules/nplAPI";
import lightAPI from "@/api/modules/lightAPI";
import Title from "@/components/Tree/Title.vue";
import moment from "moment";

export default {
  components: {
    "table-history-tree": TableHistoryTree,
    "table-list-file": TableListFile,
    ActionsHeaderTree,
    ActionsFooterTree,
    DynamicTableTree,
    FormCategoryTree,
    ModalAttachFileTree,
    ModalImportExcel,
    ModalNotifyImportExcel,
    ModalPrint,
    ModalFind,
    Title,
  },
  data() {
    return {
      timer,
      listColumnShow: null,
      objectKey: null,
      menuRight: [],
      nameForm: null,
      apiForm: null,
      stateForm: null,
      columnAdd: null,

      currentIndex: 0,
      currentTotalIndex: 0,
      currentTab: 0,

      fieldsHistory: [
        { key: "CreateDate", label: "Thời gian" },
        { key: "UserFullName", label: "Người thực hiện" },
        { key: "ActionTypeID", label: "Thao tác" },
        { key: "Note", label: "Ghi chú" },
      ],

      fieldsAttachFile: [
        { key: "CreateDate", label: "Thời gian" },
        { key: "UserFullName", label: "Người thực hiện" },
        { key: "Name", label: "Tiêu đề" },
        { key: "FileName", label: "", thClass: "d-none", tdClass: "d-none" },
        { key: "LinkFile", label: "File đính kèm" },
        { key: "Note", label: "Ghi chú" },
        { key: "Action", label: "Thao tác" },
      ],

      // dynamic
      keyDynamicID: "ScheduleID",

      // search
      filteredSearch: null,

      // data
      dataForm: null,
      dataFormBackup: null,
      dataTable: null,
      dataAttachFile: null,
      dataNotifyImportExcel: null,
      dataPrint: null,
      dataByID: null,
      dataSearch: null,
      dataConfig: null,
      dataFormOptions: {
        ActionID: [],
        LightID: [],
        SelectID: [],
        CustomAction: [],
      },
      dataCurrency: null,
      dataTableChildren: null,

      // Actions-header
      disableAdd: false,
      disableEdit: false,
      disableDelete: false,
      disableSave: true,
      disableCancel: true,
      disableCopy: false,
      disableAttachFile: false,
      disablePrint: false,
      disableFind: false,
      typeAction: "",
      files: null,
      dataHistory: null,
      formEditAttachFile: null,

      // showModal
      showModalAttachFile: null,
      showModalFile: null,
      showModalImportExcel: null,
      showModalNotifyImportExcel: null,
      showModalPrint: null,
      showModalFind: null,
    };
  },

  computed: {
    fields() {
      let sortTable = false;
      let result = handling.mergeKeyDynamic(
        this.objectKey,
        this.listColumnShow,
        sortTable
      );
      if (result?.length > 0) {
        result.forEach((item) => {
          item.tdClass = item.tdClass.replace("pt-2", "");
        });
      }
      return result;
    },
    objectData: function () {
      for (let i = 0; i < this.menuRight.length; i++) {
        if (this.$route.fullPath === this.menuRight[i].Link) {
          return {
            menuIDCurrent: this.menuRight[i].MenuID.toString(),
            formName: this.menuRight[i].MenuName.toUpperCase(),
            accessWrite: handling.convertBitToBoolean(
              this.menuRight[i].AccessWrite
            ),
          };
        }
      }
    },
    FactorID() {
      const path = this.$route.fullPath;
      if (path.includes("admin/category")) {
        return "Category";
      } else if (path.includes("admin/security")) {
        return "SystemSecurity";
      } else if (path.includes("admin/function")) {
        return "LIGHTING";
      }
      return "";
    },
    EntryID() {
      return this.$route.name;
    },
  },
  watch: {
    typeAction(to) {
      this.switchDisable();
    },
  },
  async created() {
    await this.getListMenuRight();
    await this.getColumn("CabinetSchedules");
    await this.getKeyTable();
    await this.getData();
    await this.getFormAddShow("CabinetSchedules");
    await this.getPrint();
    await this.getSearch();
    await this.getConfig();
    await this.getOptionActionType();
    await this.getOptionLightType();
    await this.getOptionSelectType();
    await this.getOptionSchedule();
    setTimeout(async () => {
      if (this.dataTable?.length > 0) {
        await this.getDataByID(
          this.dataTable[this.dataTable?.length - 1]?.[this.keyDynamicID]
        );
        await this.getAttachFile(
          this.dataTable[this.dataTable?.length - 1]?.[this.keyDynamicID]
        );
      }
    }, 500);
  },
  mounted() {
    setTimeout(() => {
      if (this.columnAdd) {
        let obj = {};
        for (let i = 0; i < this.columnAdd.length; i++) {
          let key = this.columnAdd[i]["ClName"];
          if (
            key.toUpperCase().search("NOTE") === -1 &&
            key.toUpperCase().search("DESCRIPTION") === -1
          ) {
            obj[key] = null;
          }
        }
        this.stateForm = obj;
      }
    }, 500);
  },
  methods: {
    getOptionSelectType() {
      lightAPI
        .lightCabinetSchedulesSelectTable()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.SelectID = [];
              let array = [];
              for (let i = 0; i < val.data.length; i++) {
                let obj = {
                  text: val.data[i].SelectName,
                  value: val.data[i].SelectID,
                };
                array.push({
                  id: val.data[i].SelectID,
                  enable: val.data[i].SelectEnable,
                  option: val.data[i].SelectOption,
                });
                this.dataFormOptions.SelectID.push(obj);
              }
              this.days = array;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOptionActionType() {
      lightAPI
        .lightCabinetActionList()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.ActionID = [];
              for (let i = 0; i < val.data.length; i++) {
                let obj = {
                  text: val.data[i].ActionName,
                  value: val.data[i].ID,
                };
                // if (obj.value !== 5) {
                //ẩn-1option
                this.dataFormOptions.ActionID.push(obj);
                // }
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOptionLightType() {
      lightAPI
        .lightLevelList()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.LightID = [];
              for (let i = 0; i < val.data.length; i++) {
                if (val.data[i].IsActive === 1) {
                  let obj = {
                    text: val.data[i].LightName,
                    value: val.data[i].LightID,
                  };
                  this.dataFormOptions.LightID.push(obj);
                }
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOptionSchedule() {
      lightAPI
        .scheduleOptionList()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.CustomAction = [];
              for (let i = 0; i < val.data.length; i++) {
                let obj = {
                  text: val.data[i].ScheduleOptionName,
                  value: val.data[i].ScheduleOptionID,
                };
                this.dataFormOptions.CustomAction.push(obj);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    convertCurrency(value) {
      if (!value) {
        return 0;
      }
      if (this.dataCurrency?.currency?.toUpperCase() == "VN") {
        return Number(value).toLocaleString("vi-VN");
      } else if (this.dataCurrency?.currency?.toUpperCase() == "EN") {
        return Number(value).toLocaleString("en-US");
      }
    },
    getConfig() {
      systemAPI
        .getCompanyConfig()
        .then((val) => {
          this.dataConfig = val.status ? val.data : [];
          this.dataCurrency = {
            currency: val.data?.CompanyInfo[0].FormatCurrency,
            decimal: val.data?.CompanyInfo[0].FormatDecimal,
          };
        })
        .catch((err) => console.log(err));
    },
    resetSearch() {
      this.filteredSearch = handling.filterSearchDynamic(
        this.fields,
        this.dataSearch,
        this
      );
    },
    handleSearch(arr) {
      const ListSearch = [];
      arr.forEach((item) => {
        if (item.Param1 || item.Param1 === 0) {
          ListSearch.push({
            Name: item.key,
            Operator: item.Operator,
            Param1: item.Param1.toString(),
            Param2: item.Param2 ? item.Param2.toString() : "",
          });
        }
      });
      if (ListSearch.length > 0) {
        this.currentTab = 0;
        const body = {
          ListSearch,
          FactorID: this.FactorID,
          EntryID: this.EntryID,
        };
        nplAPI
          .search(body)
          .then((val) => {
            this.currentTab = 0;
            this.dataTable = val.status
              ? handling.convertDataBitToBoolean(val.data)
              : [];
            this.currentIndex = val.status ? val.data.length - 1 : 0;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.getData();
      }
    },
    getSearch() {
      nplAPI
        .getMethodSearch()
        .then((val) => {
          this.dataSearch = val.status
            ? val.data?.map((item) => ({
                text: item.Shw,
                value: item.Valu,
              }))
            : [];
        })
        .catch((err) => console.log(err));
    },

    handlePrint(obj) {
      switch (obj.PrintType.toUpperCase()) {
        case "DOWNLOAD":
          const link = document.createElement("a");
          link.download = obj.FormPrintName;
          link.href = obj.PrintAction;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        case "CLIENT":
          handling.printExcel(
            "units-npl",
            this.objectData.formName,
            null,
            null
          );
        case "SERVER":
        default:
          break;
      }
      if (obj.PrintType.toUpperCase() === "DOWNLOAD") {
        const link = document.createElement("a");
        link.download = obj.FormPrintName;
        link.href = obj.PrintAction;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      this.showModalPrint = false;
    },
    handleImportExcel(file) {
      let formData = new FormData();
      formData.append("FactorID", this.FactorID);
      formData.append("EntryID", this.EntryID);
      formData.append("File", file);
      systemAPI
        .postExcel(formData)
        .then((val) => {
          if (val.status) {
            // this.showNotify("success", this.$t("toast.message"), val.message);
            this.dataNotifyImportExcel = val.data;
            this.showModalNotifyImportExcel = true;
            this.currentTab = 0;
            this.getData();
          } else {
            this.showNotify("error", this.$t("toast.message"), val.message);
          }
          this.showModalImportExcel = false;
        })
        .catch((err) => console.log(err));
    },
    removeAttachFile(item) {
      let body = {
        ID: item.ID,
      };
      nplAPI
        .deleteAttachFile(body)
        .then((val) => {
          if (val.status) {
            this.showNotify("success", this.$t("toast.message"), val.message);
            this.getAttachFile(
              this.dataTable[this.currentIndex]?.[this.keyDynamicID]
            );
          } else {
            this.showNotify("error", this.$t("toast.message"), val.message);
          }
        })
        .catch((err) => console.log(err));
    },
    editAttachFile(item) {
      this.showModalAttachFile = true;
      this.formEditAttachFile = { ...item };
    },
    async handleAttachFile(obj) {
      try {
        this.showModalAttachFile = false;
        const id = this.dataTable[this.currentIndex]?.[this.keyDynamicID];
        const newObj = {
          ...obj,
          OID: id,
          FactorID: this.FactorID,
          EntryID: this.EntryID,
        };

        let formData = new FormData();
        for (const key in newObj) {
          if (key === "File" && newObj[key] && newObj[key].length > 0) {
            newObj[key].forEach((item) => {
              formData.append("File", item);
            });
          } else {
            formData.append(key, newObj[key]);
          }
        }
        let res;
        if (obj.ID) {
          res = await nplAPI.editAttachFile(formData);
        } else {
          res = await nplAPI.addAttachFile(formData);
        }
        if (res.status) {
          this.getAttachFile(id);
          this.showNotify("success", this.$t("toast.message"), res.message);
        } else {
          this.showNotify("error", this.$t("toast.message"), res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    getAttachFile(id) {
      //gọi file đính kèm
      let body = {
        OID: id.toString(),
        FactorID: this.FactorID,
        EntryID: this.EntryID,
      };
      nplAPI
        .getAttachFile(body)
        .then((val) => {
          this.dataAttachFile = val.status
            ? val.data.map((item) => ({
                ...item,
                CreateDate: handling.convertDateTime(item.CreateDate),
              }))
            : [];
        })
        .catch((err) => console.log(err));
    },
    checkIsBlankForm() {
      if (!this.dataForm) return;
      for (let key in this.dataForm) {
        const value = this.dataForm[key][1];
        if (value || value === 0 || value === false) {
          //chỉ cần 1 field trong form có giá trị
          return true;
        }
      }
    },
    triggerSave() {
      this.$refs.formSchedules.emitSubmit();
    },
    handleEmitSubmit(value, apiUrl) {
      let body = {};
      if (value?.SelectID === 1) {
        value.CN = 0;
        value.T2 = 0;
        value.T3 = 0;
        value.T4 = 0;
        value.T5 = 0;
        value.T6 = 0;
        value.T7 = 0;
      }
      Object.assign(body, value);
      systemAPI
        .submitData(apiUrl, body)
        .then((val) => {
          if (val.status) {
            this.showNotify(
              "success",
              this.$t("toast.success").toUpperCase(),
              val.message
            );
            this.getDataAndByID();
          } else {
            this.showNotify(
              "danger",
              this.$t("toast.fail").toUpperCase(),
              val.message
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDataAndByID() {
      this.getData();
      this.typeAction = null;
      this.apiForm = null;
      setTimeout(() => {
        if (this.dataTable?.length > 0) {
          this.getDataByID(
            this.dataTable[this.dataTable.length - 1]?.[this.keyDynamicID]
          );
          this.getAttachFile(
            this.dataTable[this.dataTable.length - 1]?.[this.keyDynamicID]
          );
        } else {
          this.dataForm = null;
        }
      }, 100);
      this.typeAction = null;
      this.apiForm = null;
    },

    revertCurrency(val) {
      let value = val.toString();
      if (!value) {
        return 0;
      }
      let newNumb;
      if (this.dataCurrency?.currency.toUpperCase() == "VN") {
        newNumb = value.replace(/\./g, "");
        newNumb = newNumb.replace(/,/g, ".");
      } else if (this.dataCurrency?.currency.toUpperCase() == "EN") {
        newNumb = value.replace(/,/g, "");
      }
      return newNumb;
    },
    switchDisable() {
      if (
        this.typeAction?.toUpperCase() == "ADD" ||
        this.typeAction?.toUpperCase() == "EDIT"
      ) {
        this.disableAdd = true;
        this.disableEdit = true;
        this.disableDelete = true;
        this.disableSave = false;
        this.disableCancel = false;
        this.disableAttachFile = true;
        this.disableImport = true;
        this.disablePrint = true;
        this.disableFind = true;
      } else {
        this.dataForm = null;
        this.disableAdd = false;
        this.disableEdit = false;
        this.disableDelete = false;
        this.disableSave = true;
        this.disableCancel = true;
        this.disableAttachFile = false;
        this.disableImport = false;
        this.disablePrint = false;
        this.disableFind = false;
        for (const key in this.stateForm) {
          this.stateForm[key] = null;
        }
        this.dataForm = this.dataByID;
      }
    },

    handleDbClick(v) {
      let index = this.dataTable.findIndex(
        (x) => x?.[this.keyDynamicID] == v?.[this.keyDynamicID]
      );
      this.getDataByID(v?.[this.keyDynamicID]);
      this.getAttachFile(v?.[this.keyDynamicID]);
      this.currentIndex = index;
      this.currentTab = 1;
    },

    updateTab(value) {
      let result;
      result = this.checkIsBlankForm();
      if (result && this.typeAction) {
        //đang có dữ liệu chưa save
        this.showModalFormNull(null, null, value);
      } else {
        this.typeAction = null;
        this.currentTab = value;
      }
    },
    updateFirstIndex() {
      if (!this.dataTable?.length > 0) return;
      if (
        this.typeAction?.toUpperCase() === "ADD" ||
        this.typeAction?.toUpperCase() === "EDIT"
      ) {
        this.showModalFormNull("index", "firstIndex");
      } else {
        this.currentIndex = 0;
        this.getDataByID(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.currentTab = 1;
        this.typeAction = null;
      }
    },
    updatePreIndex() {
      if (!this.dataTable?.length > 0 || this.currentIndex == 0) return;
      if (
        this.typeAction?.toUpperCase() === "ADD" ||
        this.typeAction?.toUpperCase() === "EDIT"
      ) {
        this.showModalFormNull("index", "preIndex");
      } else {
        this.currentIndex -= 1;
        this.getDataByID(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.getAttachFile(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );

        this.currentTab = 1;
        this.typeAction = null;
      }
    },
    updateNextIndex() {
      let indexEqualDataTable = this.currentIndex == this.dataTable.length - 1;
      if (!this.dataTable?.length > 0 || indexEqualDataTable) return;
      if (
        this.typeAction?.toUpperCase() === "ADD" ||
        this.typeAction?.toUpperCase() === "EDIT"
      ) {
        this.showModalFormNull("index", "nextIndex");
      } else {
        this.currentIndex += 1;
        this.getDataByID(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.getAttachFile(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.currentTab = 1;
        this.typeAction = null;
      }
    },
    updateLastIndex() {
      if (!this.dataTable?.length > 0) return;
      if (
        this.typeAction?.toUpperCase() === "ADD" ||
        this.typeAction?.toUpperCase() === "EDIT"
      ) {
        this.showModalFormNull("index", "lastIndex");
      } else {
        this.currentIndex = this.dataTable.length - 1;
        this.getDataByID(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.getAttachFile(
          this.dataTable[this.currentIndex]?.[this.keyDynamicID]
        );
        this.currentTab = 1;
        this.typeAction = null;
      }
    },

    handleChangeActions(bol, key) {
      switch (key) {
        case "add":
          this.typeAction = key;
          this.apiForm = "/api/CabinetSchedules/Add";
          this.currentTab = 1;
          let defaultAdd = {
            OName: "",
            SelectID: 1, //0: một lần |1:lặp lại
            T2: 0,
            T3: 0,
            T4: 0,
            T5: 0,
            T6: 0,
            T7: 0,
            CN: 0,
            Hour: moment(new Date()).format("HH"),
            Minute: moment(new Date()).format("mm"),
            Note: "",
            CabinetID: [], //arrID,
            LightID: 0,
            ActionID: 0,
            CustomAction: 1,
          };
          this.dataForm = { ...defaultAdd };
          break;
        case "edit":
          this.typeAction = key;
          this.dataForm = this.dataByID;

          this.apiForm = "/api/CabinetSchedules/Edit";
          this.currentTab = 1;
          break;
        case "delete":
          this.typeAction = key;
          this.deleteModal();
          if (this.dataTable?.length > 0) {
            this.currentTab = 1;
          }
          break;
        case "save":
          this.triggerSave();
          break;
        case "cancel":
          this.typeAction = null;
          break;

        case "block":
          this.currentTab = 1;
          this.handleBlock(
            this.dataForm?.[this.keyDynamicID],
            this.dataForm.IsActive
          );
          break;
        case "copy":
          this.currentTab = 1;
          this.handleCopy(this.dataForm?.[this.keyDynamicID][1]);
          break;
        case "attachFile":
          this.showModalAttachFile = true;
          this.currentTab = 3;
          break;
        case "import":
          this.showModalImportExcel = true;
          break;
        case "print":
          this.showModalPrint = true;
          break;
        case "find":
          this.showModalFind = true;
          this.filteredSearch = handling.filterSearchDynamic(
            this.fields,
            this.dataSearch,
            this
          );
          break;
      }
    },

    handleBlock(id, isActive) {
      this.$bvModal
        .msgBoxConfirm(`${this.$t("modal.confirm-lock")} ${id} ?`, {
          title: this.$t("toast.message"),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("modal.yes"),
          cancelTitle: this.$t("modal.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            let body = {
              [this.keyDynamicID]: id,
              IsActive: !!isActive ? 0 : 1,
            };
            lightAPI
              .lightCabinetSchedulesChangeStatus(body)
              .then((val) => {
                if (val.status) {
                  this.showNotify(
                    "success",
                    this.$t("toast.message"),
                    val.message
                  );
                  this.getDataAndByID();
                } else {
                  this.showNotify(
                    "error",
                    this.$t("toast.message"),
                    val.message
                  );
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCopy(id) {
      this.$bvModal
        .msgBoxConfirm(`${this.$t("modal.confirm-copy")} ${id} ?`, {
          title: this.$t("toast.message"),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("modal.yes"),
          cancelTitle: this.$t("modal.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            let body = {
              [this.keyDynamicID]: id,
            };
            nplAPI
              .copyAllowances(body)
              .then((val) => {
                if (val.status) {
                  this.showNotify(
                    "success",
                    this.$t("toast.success").toUpperCase(),
                    val.message
                  );
                  this.getDataAndByID();
                } else {
                  this.showNotify(
                    "error",
                    this.$t("toast.message"),
                    val.message
                  );
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    printExternalExcel(table) {
      handling.printExcel(
        table,
        this.objectData.formName,
        null,
        null,
        this.$t("form.page") + " " + this.$refs["tableForm"].currentPage
      );
    },

    deleteModal() {
      this.$bvModal
        .msgBoxConfirm(
          this.$t("form.question") + this.dataByID?.[this.keyDynamicID] + "?",
          {
            title: this.$t("form.warning").toUpperCase(),
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: this.$t("form.yes"),
            cancelTitle: this.$t("form.no"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value === true) {
            this.handleSubmitDelete();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async handleSubmitDelete() {
      let body = {
        ScheduleID: this.dataByID?.[this.keyDynamicID],
      };
      lightAPI
        .lightCabinetSchedulesRemove(body)
        .then((val) => {
          if (val.status) {
            this.showNotify(
              "success",
              this.$t("toast.success").toUpperCase(),
              val.message
            );
            this.getDataAndByID();
          } else {
            this.showNotify(
              "danger",
              this.$t("toast.fail").toUpperCase(),
              val.message
            );
          }
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
    getFormAddShow(string) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .modalFields(body)
        .then((val) => {
          this.columnAdd = val.status ? val.data : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataByID(id) {
      let body = {
        ID: id,
      };
      lightAPI
        .lightCabinetSchedulesByID(body)
        .then((val) => {
          let arr = [];
          this.dataByID = val.status ? val.data : null;
          this.dataForm = val.status ? val.data : null;
          if (this.dataByID?.VehicleGroupID?.length > 0) {
            for (let vehicle of this.dataByID.VehicleGroupID.split(",")) {
              arr.push(vehicle);
            }
            this.dataForm.VehicleGroupID[1] = [...arr];
          }

          this.dataHistory = val.status
            ? val.data.Histories.map((item) => ({
                ...item,
                CreateDate: handling.convertDateTime(item.CreateDate),
              }))
            : [];

          this.dataTableChildren = val.status ? val.data.Details : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData() {
      lightAPI
        .lightCabinetSchedulesList()
        .then((val) => {
          this.dataTable = val.status
            ? handling.convertDataBitToBoolean(val.data)
            : [];
          this.currentIndex = val.status ? val.data.length - 1 : 0;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getKeyTable() {
      lightAPI
        .lightCabinetSchedulesList()
        .then((val) => {
          this.objectKey =
            val.status && val.data.length > 0 ? Object.keys(val.data[0]) : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getColumn(string) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .tableFields(body)
        .then((val) => {
          this.listColumnShow = val.status ? val.data : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getListMenuRight() {
      let body = {
        GroupID: JSON.parse(localStorage.getItem("user")).GroupID,
      };
      systemAPI
        .getMenus(body)
        .then((val) => {
          this.menuRight = val.status ? val.data : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPrint() {
      const body = {
        FactorID: this.FactorID,
        EntryID: this.EntryID,
      };
      nplAPI
        .getFormPrint(body)
        .then((val) => {
          this.dataPrint = val.status ? val.data : [];
        })
        .catch((err) => console.log(err));
    },
    showModalFormNull(action, update, value) {
      let result;
      result = this.checkIsBlankForm();
      if (action?.toUpperCase() === "INDEX" && result) {
        //đang có dữ liệu chưa save
        this.$bvModal
          .msgBoxConfirm(this.$t("modal.question-skip") + "?", {
            title: this.$t("form.warning").toUpperCase(),
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: this.$t("modal.yes"),
            cancelTitle: this.$t("modal.no"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          })
          .then((confirm) => {
            if (confirm) {
              switch (update?.toUpperCase()) {
                case "FIRSTINDEX":
                  this.currentIndex = 0;
                  this.getDataByID(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.getAttachFile(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.currentTab = 1;
                  this.typeAction = null;
                  break;
                case "PREINDEX":
                  this.currentIndex -= 1;
                  this.getDataByID(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.getAttachFile(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.currentTab = 1;
                  this.typeAction = null;
                  break;

                case "NEXTINDEX":
                  this.currentIndex += 1;
                  this.getDataByID(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.getAttachFile(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );

                  this.currentTab = 1;
                  this.typeAction = null;
                  break;

                case "LASTINDEX":
                  this.currentIndex = this.dataTable.length - 1;
                  this.getDataByID(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.getAttachFile(
                    this.dataTable[this.currentIndex]?.[this.keyDynamicID]
                  );
                  this.currentTab = 1;
                  this.typeAction = null;
                  break;
                default:
                  break;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$bvModal
          .msgBoxConfirm(this.$t("modal.question-skip") + "?", {
            title: this.$t("form.warning").toUpperCase(),
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: this.$t("modal.yes"),
            cancelTitle: this.$t("modal.no"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          })
          .then((confirm) => {
            if (confirm) {
              this.typeAction = null;
              this.currentTab = value;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
.crown-category .btn-outline-secondary.disabled:hover {
  color: #2a93d5;
  background-color: transparent;
}
</style>

<style scoped>
.box-content {
  height: calc(100vh - 247px);
  overflow-y: auto;
  overflow-x: hidden;
}

.title-category {
  display: inline-block;
  height: 37px;
  border-bottom: 1px solid #d7d7d7;
  line-height: 37px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  color: #005aab;
}
</style>
