<template>
  <div id="app-content-full" class="npl-categories">
    <b-card>
      <div ref="form-basic" class="h-100">
        <div ref="action-header">
          <ActionsHeaderNPL
            :currentIndex="currentIndex"
            :total="dataTable.length"
            :isPermission="objectData.accessWrite"
            :isDisabledAdd="isDisabledAdd"
            :isDisabledEdit="isDisabledEdit"
            :isDisabledDelete="isDisabledDelete"
            :isDisabledSave="isDisabledSave"
            :isDisabledCancel="isDisabledCancel"
            :isDisabledLock="isDisabledLock"
            :isDisabledCopy="isDisabledCopy"
            :isDisabledAttachFile="isDisabledAttachFile"
            :isDisabledPrint="isDisabledPrint"
            :isDisabledImportExcel="isDisabledImportExcel"
            :isDisabledSearch="isDisabledSearch"
            :statusLock="statusLock"
            :showImportExcel="false"
            @change-index="handleChangeIndex"
            @change-action="handleChangeAction"
            @change-tab="updateTab"
          />
        </div>
        <b-tabs v-model="currentTab" nav-class="d-none">
          <b-tab>
            <div
              class="box-content"
              :style="{ height: heightContent }"
              style="overflow: hidden"
            >
              <CustomTable
                :fieldsTable="fieldsTable"
                :dataTable="dataTable"
                :heightTable="heightTable"
                :formatCurrency="formatCurrency"
                :formatDecimal="formatDecimal"
                :isClearFilter="isClearFilter"
                :statusOptions="statusOptions"
                @onFilter="handleFilter"
                @rowDblclicked="handleDbClick"
              />
            </div>
          </b-tab>
          <b-tab>
            <Title :title="EntryName" />
            <div class="box-content mt-2" :style="{ height: heightContent2 }">
              <component
                :is="renderForm"
                :dataForm="dataForm"
                :currentMode="currentMode"
                :isTakeDataForm="isTakeDataForm"
                :dataChildTable="dataChildTable"
                :formatCurrency="formatCurrency"
                :formatDecimal="formatDecimal"
                @getDataForm="handleSave"
                ref="FormRouteCost"
              />
            </div>
          </b-tab>
          <b-tab>
            <Title :title="EntryName" />
            <div class="box-content mt-2" :style="{ height: heightContent2 }">
              <table-history
                v-if="dataHistory && dataHistory.length > 0"
                :fields="fieldsHistory"
                :items="dataHistory"
              />
              <template v-else>
                {{ $t("cards.no-data") }}
              </template>
            </div>
          </b-tab>
          <b-tab>
            <Title :title="EntryName" />
            <div class="box-content mt-2" :style="{ height: heightContent2 }">
              <table-list-file
                v-if="dataAttachFile && dataAttachFile.length > 0"
                :fields="fieldsAttachFile"
                :items="dataAttachFile"
                @removeFile="removeAttachFile"
                @editFile="editAttachFile"
              />
              <template v-else>
                {{ $t("cards.no-data") }}
              </template>
            </div>
          </b-tab>
        </b-tabs>
        <div ref="action-footer">
          <ActionsFooterNPL
            :activeFocus="currentTab"
            :titleTab0="$t('footer-tab.list')"
            :titleTab1="$t('footer-tab.detail')"
            :titleTab2="$t('footer-tab.action-history')"
            :titleTab3="$t('footer-tab.file-attach')"
            @change-tab="updateTab"
          />
        </div>
        <ModalAttachFile
          :show="showModalAttachFile"
          :formEdit="formEditAttachFile"
          @hidden="showModalAttachFile = false"
          @submitData="handleAttachFile"
        />
        <ModalPrint
          :show="showModalPrint"
          :dataPrint="dataPrint"
          @hidden="showModalPrint = false"
          @formPrint="handlePrint"
        />
        <ModalImportExcel
          :show="showModalImportExcel"
          @hidden="showModalImportExcel = false"
          @submitData="handleImportExcel"
        />
        <ModalNotifyImportExcel
          :show="showModalNotifyImportExcel"
          :dataNotify="dataNotifyImportExcel"
          @hidden="hiddenModalNotifyImportExcel"
        />
        <ModalFind
          :show="showModalFind"
          :methodSearch="methodSearch"
          :dataSearch="dataSearch"
          :formatCurrency="formatCurrency"
          :formatDecimal="formatDecimal"
          @hidden="showModalFind = false"
          @search="handleSearch"
          @resetSearch="resetSearch"
        />
        <ModalPrintTemplate
          v-if="dataForm"
          ref="modalPrintTemplate"
          :dataForm="dataForm"
          :dataFormOptionsPrint="dataFormOptionsPrint"
          :dataChildTable="dataChildTable"
          :formatCurrency="formatCurrency"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import handling from "@/constants/handling.js";
import functionMixin from "@/views/app/function/npl/kinh-doanh/mixin/functionMixin";

export default {
  mixins: [functionMixin],
  data() {
    return {
      apiGet: "/api/RouteAllowances/Get",
      apiGetById: "/api/RouteAllowances/GetById",
      apiAdd: "/api/RouteAllowances/Add",
      apiEdit: "/api/RouteAllowances/Edit",
      apiDelete: "/api/RouteAllowances/Delete",
      apiCopy: "/api/RouteAllowances/Copy",
      apiChangeStatus: "/api/RouteAllowances/ChangeStatus",
      dataFormOptionsPrint: {
        OrderTypeID: [],
        RouteID: [],
        GoodType: [],
      },
    }
  },
  created() {
    this.getListGoodsTypes();
    this.getListOrderTypes();
    console.log("Đang phát triển!")
  },
  methods: {
    getListGoodsTypes() {
      let body = {
        CategoryType: "GoodsTypes",
      };
      nplAPI
        .getCategoryActive(body)
        .then((val) => {
          if (val.status && val.data?.length > 0) {
            this.dataFormOptionsPrint.GoodType = [];
            val.data.forEach((item) => {
            if (item.IsActive === 1) {
                let obj = {
                  value: item.ID,
                  text: item.GoodsTypesName,
                  checked: false,
                };
                this.dataFormOptionsPrint.GoodType.push(obj);
              }
            });
          }
        })
        .catch((err) => console.log(err));
    },
    getListOrderTypes() {
      let body = {
        CategoryType: "OrderTypes",
      };
      nplAPI
        .getCategoryActive(body)
        .then((val) => {
          if (val.status && val.data?.length > 0) {
            this.dataFormOptionsPrint.OrderTypeID = [];
            val.data.forEach((item) => {
              if (item.IsActive === 1) {
                let obj = {
                  value: item.ID,
                  text: item.OrderTypesName,
                };
                this.dataFormOptionsPrint.OrderTypeID.push(obj);
              }
            });
          }
        })
        .catch((err) => console.log(err));
    },
    getByID(id, isActive) {
      let body = {
        OID: id,
      };
      nplAPI
        .submitData(body, this.apiGetById)
        .then((val) => {
          let obj = val.status ? val.data : null;
          if (obj) {
            let newObj = handling.showExtensionFormEdit(obj);
            const labelID = newObj?.OID ? newObj?.OID[0] : 'cl.OID'
            // const labelOrderTypeID = newObj?.OrderTypeID ? newObj?.OrderTypeID[0] : 'cl.OrderTypeID'
            newObj.OrderTypeID[1] = newObj.OrderTypeID[1].toString()
            newObj.GoodsTypeID[1] = newObj.GoodsTypeID[1].toString()
            this.dataForm = {
              ...newObj,
              ID: [labelID, id, "ID", null],
              IsActive: [this.$t("status.status"), obj.IsActive, 'IsActive', null],
              // OrderTypeID: [labelOrderTypeID, obj.OrderTypeID.toString(), 'String', null],
              // GoodsTypeID: [labelOrderTypeID, obj.GoodsTypeID.toString(), 'String', null]
            };
            if (obj.Histories) {  
              const arr = [];
              obj.Histories.forEach((item) => {
                arr.push({
                  ...item,
                  CreateDate: handling.convertDateTime(item.CreateDate),
                });
              });
              this.dataHistory = arr;
            }
            //thay đổi 1 số thứ
            this.dataChildTable = obj?.ChargingStation || []
          } else {
            this.dataForm = null;
            this.dataChildTable = [];
            this.dataHistory = [];
            this.dataAttachFile = [];
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style>
.title-dropdown button {
  font-size: 20px;
  padding: 0;
}
</style>
<style>
.npl-table-basic-form .table th {
  white-space: nowrap;
}
.b-form-btn-label-control.form-control > .form-control.form-control-sm {
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style lang="scss">
.npl-categories {
  .card {
    height: 100%;
  }
  .card-body {
    height: 100%;
    padding: 0;
  }
  .box-content {
    overflow: auto;
  }
  .btn-warning.disabled {
    color: white;
  }
  .btn-outline-danger.disabled {
    &:hover {
      color: #dc3545;
    }
  }
  .btn-outline-secondary.disabled {
    color: #2a93d5;
    &:hover {
      color: #2a93d5;
      background-color: transparent;
    }
  }
  .btn-outline-info.disabled {
    &:hover {
      color: #17a2b8;
      background-color: transparent;
    }
  }
  .custom-select {
    height: 36px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
  td {
    vertical-align: middle;
  }
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
