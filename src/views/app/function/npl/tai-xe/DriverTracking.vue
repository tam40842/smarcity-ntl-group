<template>
  <div id="app-content-full" class="crown-category">
    <b-card>
      <BusinessTabs
        :activeFocus="currentTabBusiness"
        @changeTab="changeTabBusiness"
      />

      <ActionsHeaderDriver
        :currentIndex="currentIndex"
        :currentTotalIndex="dataTable?.length"
        :showImport="false"
        :disableAdd="disableAdd"
        :disableEdit="disableEdit"
        :disableDelete="disableDelete"
        :disableSave="disableSave"
        :disableCancel="disableCancel"
        :disableBlock="disableBlock"
        :disableCopy="disableCopy"
        :disableAttachFile="disableAttachFile"
        :disablePrint="disablePrint"
        :disableFind="disableFind"
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
                  label1: 'Đã khóa',
                  color2: 'gray',
                  label2: 'Chưa khóa',
                }"
                style="margin-top: -20px"
                :field-table="fieldIncidentRequestFinal"
                :data-table="dataTable"
                :bordered="true"
                :isSearch="false"
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
            <Title
              :title="title"
              :listTitle="listFactorID"
              :inject="$t('major')"
              @changeTitle="changeTitle"
            />
            <template v-if="dataForm && Object.keys(dataForm).length > 0">
              <FormTaiXeYeuCau
                ref="formCategoryTree"
                :data-form="dataForm"
                :disableAdd="disableAdd"
                :disableEdit="disableEdit"
                :disableBlock="disableBlock"
                :stateForm="stateForm"
                :apiForm="apiForm"
                :typeAction="typeAction"
                :dataFormOptions="dataFormOptions"
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

    <!-- Modal -->

    <!-- <ModalAttachFileTree
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
    /> -->
  </div>
</template>
<script>
import handling from "@/constants/handling";
import { timer } from "@/constants/config";
import systemAPI from "@/api/modules/systemAPI";
import ActionsHeaderDriver from "./component/ActionsHeaderDriver.vue";
import ActionsFooterTree from "@/components/Tree/ActionsFooterTree.vue";
import DynamicTableTree from "@/components/Tree/DynamicTableTree.vue";
import FormTaiXeYeuCau from "./component/FormTaiXeYeuCau.vue";
import TableHistoryTree from "@/components/Tree/TableHistoryTree.vue";
import TableListFile from "@/components/Tree/TableListFile.vue";
import ModalAttachFileTree from "@/components/Tree/ModalAttachFileTree.vue";
import ModalPrint from "@/components/Tree/ModalPrint.vue";
import ModalImportExcel from "@/components/Tree/ModalImportExcel.vue";
import ModalNotifyImportExcel from "@/components/Tree/ModalNotifyImportExcel.vue";
import ModalFind from "@/components/Tree/ModalFind.vue";
import nplAPI from "@/api/modules/nplAPI";
import Title from "./component/Title.vue";
import { createLogger } from "@microsoft/signalr/dist/esm/Utils";
import BusinessTabs from "./component/BusinessTabs.vue";
import { ref } from "vue";
import useDriverRequests from "./hooks/useDriverRequests.js";

export default {
  components: {
    "table-history-tree": TableHistoryTree,
    "table-list-file": TableListFile,
    ActionsHeaderDriver,
    ActionsFooterTree,
    DynamicTableTree,
    FormTaiXeYeuCau,
    ModalAttachFileTree,
    ModalImportExcel,
    ModalNotifyImportExcel,
    ModalPrint,
    ModalFind,
    Title,
    BusinessTabs,
  },
  setup() {
    // REF
    const currentTabBusiness = ref(0);
    const currentIndex = ref(0);
    const disableAdd = ref(true);
    const disableEdit = ref(true);
    const disableDelete = ref(true);
    const disableSave = ref(true);
    const disableCancel = ref(true);
    const disableBlock = ref(true);
    const disableCopy = ref(true);
    const disableAttachFile = ref(false);
    const disablePrint = ref(false);
    const disableFind = ref(false);

    const dataTable = ref(null);
    const keyDynamicID = ref("OID");
    const typeAction = ref("");
    const currentTab = ref(0);
    const dataByID = ref(null);
    const dataForm = ref(null);
    const apiForm = ref(null);
    const stateForm = ref(null);
    const dataFormOptions = ref({});
    const dataHistory = ref(null);
    const dataAttachFile = ref(null);
    const listFactorID = ref(null);
    const title = ref("");

    // USE
    const {
      getListTable,
      fieldIncidentRequestFinal,
      getColumn,
      getDataByID,
      objectData,
      getListMenuRight,
      getListEntryID,
    } = useDriverRequests();

    // METHOD
    const changeTabBusiness = (value) => {
      currentTabBusiness.value = value;
      if (value == 0) {
        fetchDriver("Report_Incident");
        fetchTitleEntry("Report_Incident");
        currentIndex.value = 0;
        currentTab.value = 0;
      } else if (value == 1) {
        fetchDriver("Request_Gas");
        fetchTitleEntry("Request_Gas");
        currentIndex.value = 0;
        currentTab.value = 0;
      } else {
        fetchDriver("Request_Other");
        fetchTitleEntry("Request_Other");
        currentIndex.value = 0;
        currentTab.value = 0;
      }
    };

    const handleChangeActions = (bol, key) => {
      switch (key) {
        case "add":
          typeAction.value = key;
          dataForm.value = handling.showExtensionFormAdd(
            columnAdd.value,
            dataFormOptions.value
          );
          apiForm.value = "/api/Allowances/Add";
          currentTab.value = 1;
          break;
        case "edit":
          let arr = [];
          typeAction.value = key;
          let newObj = handling.showExtensionFormEdit(dataByID.value);
          for (let vehicle of dataByID.value.VehicleGroupID.split(",")) {
            arr.push(vehicle);
          }

          let resultObj = {};
          for (const key in newObj) {
            const value = newObj[key];
            const type = newObj[key][2];
            if (
              type &&
              (type?.toUpperCase() === "MONEY" ||
                type?.toUpperCase() === "CURRENCY")
            ) {
              value[1] = handling.convertMoney(
                value[1],
                this.dataCurrency?.currency
              );
              resultObj[key] = value;
            } else {
              resultObj[key] = value;
            }
          }

          this.dataForm = {
            ...resultObj,
          };

          this.dataForm.VehicleGroupID[1] = [...arr];
          this.apiForm = "/api/Allowances/Edit";
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
            this.dataForm?.[this.keyDynamicID][1],
            this.dataForm.IsActive[1]
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
    };

    const updateFirstIndex = () => {
      if (!dataTable.value?.length > 0) return;
      if (
        typeAction.value?.toUpperCase() === "ADD" ||
        typeAction.value?.toUpperCase() === "EDIT"
      ) {
        showModalFormNull("index", "firstIndex");
      } else {
        currentIndex.value = 0;
        fetchByID(dataTable.value[currentIndex.value]?.[keyDynamicID.value]);
        currentTab.value = 1;
        typeAction.value = null;
      }
    };

    const updatePreIndex = () => {
      if (!dataTable.value?.length > 0 || currentIndex.value == 0) return;
      if (
        typeAction.value?.toUpperCase() === "ADD" ||
        typeAction.value?.toUpperCase() === "EDIT"
      ) {
        showModalFormNull("index", "preIndex");
      } else {
        currentIndex.value -= 1;
        fetchByID(dataTable.value[currentIndex.value]?.[keyDynamicID.value]);
        currentTab.value = 1;
        typeAction.value = null;
      }
    };

    const updateNextIndex = () => {
      let indexEqualDataTable =
        currentIndex.value == dataTable.value.length - 1;
      if (!dataTable.value?.length > 0 || indexEqualDataTable) return;
      if (
        typeAction.value?.toUpperCase() === "ADD" ||
        typeAction.value?.toUpperCase() === "EDIT"
      ) {
        showModalFormNull("index", "nextIndex");
      } else {
        currentIndex.value += 1;
        fetchByID(dataTable.value[currentIndex.value]?.[keyDynamicID.value]);
        currentTab.value = 1;
        typeAction.value = null;
      }
    };

    const updateLastIndex = () => {
      if (!dataTable.value?.length > 0) return;
      if (
        typeAction.value?.toUpperCase() === "ADD" ||
        typeAction.value?.toUpperCase() === "EDIT"
      ) {
        showModalFormNull("index", "lastIndex");
      } else {
        currentIndex.value = dataTable.value.length - 1;
        fetchByID(dataTable.value[currentIndex]?.[keyDynamicID.value]);
        currentTab.value = 1;
        typeAction.value = null;
      }
    };

    const updateTab = (value) => {
      let result;
      // result = checkIsBlankForm();
      if (result && typeAction) {
        //đang có dữ liệu chưa save
        showModalFormNull(null, null, value);
      } else {
        typeAction.value = null;
        currentTab.value = value;
      }
    };

    const handleDbClick = (v) => {
      let index = dataTable.value.findIndex(
        (x) => x?.[keyDynamicID.value] == v?.[keyDynamicID.value]
      );
      fetchByID(v?.[keyDynamicID.value]);
      currentIndex.value = index;
      currentTab.value = 1;
    };

    const changeTitle = (item) => {
      title.value = item.EntryName;
    };

    const handleEmitSubmit = () => {};

    // beforeCreated

    const fetchColumnDriver = async (string) => {
      try {
        let body = {
          ObjectName: string,
        };
        await getColumn(body, systemAPI.tableFields);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDriver = async (string) => {
      try {
        let body = {
          FactorID: string,
        };
        dataTable.value = await getListTable(body, nplAPI.getDriverRequests);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTitleEntry = async (string) => {
      try {
        let body = {
          FactorID: string,
        };
        listFactorID.value = await getListEntryID(
          body,
          systemAPI.getEntryByFactorID
        );
        title.value = listFactorID.value[0].EntryName;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchByID = async (id) => {
      try {
        let body = {
          OID: id,
        };
        dataByID.value = await getDataByID(body, nplAPI.getDriverRequestsByID);
        dataForm.value = handling.showExtensionFormEdit(dataByID.value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDriver("Report_Incident");
    fetchTitleEntry("Report_Incident");
    fetchColumnDriver("RP_Incident");
    getListMenuRight();
    setTimeout(async () => {
      if (dataTable.value?.length > 0) {
        await fetchByID(
          dataTable.value[dataTable.value?.length - 1]?.[keyDynamicID.value]
        );
        // await getAttachFile(
        //   dataTable.value[dataTable.value?.length - 1]?.[keyDynamicID.value]
        // );
      }
    }, 500);

    return {
      // R
      currentTabBusiness,
      currentIndex,
      disableAdd,
      disableEdit,
      disableDelete,
      disableSave,
      disableCancel,
      disableBlock,
      disableCopy,
      disableAttachFile,
      disablePrint,
      disableFind,

      dataTable,
      currentTab,
      fieldIncidentRequestFinal,

      // M
      changeTabBusiness,
      handleChangeActions,
      updateFirstIndex,
      updatePreIndex,
      updateNextIndex,
      updateLastIndex,
      handleDbClick,
      updateTab,
      dataByID,
      dataForm,
      objectData,
      stateForm,
      apiForm,
      dataFormOptions,
      handleEmitSubmit,
      typeAction,
      dataHistory,
      dataAttachFile,
      listFactorID,
      title,
      changeTitle,
    };
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
