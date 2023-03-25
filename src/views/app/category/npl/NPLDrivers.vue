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
            :isDisabledAttachFile="isDisabledAttachFile"
            :isDisabledPrint="isDisabledPrint"
            :isDisabledImportExcel="isDisabledImportExcel"
            :isDisabledSearch="isDisabledSearch"
            :showBlock="false"
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
                :isClearFilter="isClearFilter"
                :statusOptions="statusOptions"
                @onFilter="handleFilter"
                @rowDblclicked="handleDbClick"
              />
            </div>
          </b-tab>
          <b-tab>
            <Title :title="objectData.formName" />
            <div class="box-content mt-2" :style="{ height: heightContent2 }">
              <component
                :is="CategoryType"
                :dataForm="dataForm"
                :currentMode="currentMode"
                :CategoryType="CategoryType"
              />
            </div>
          </b-tab>
          <b-tab>
            <Title :title="objectData.formName" />
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
            <Title :title="objectData.formName" />
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
          @hidden="showModalFind = false"
          @search="handleSearch"
          @resetSearch="resetSearch"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import handling from "@/constants/handling.js";
import categoryMixin from "@/views/app/category/npl/mixin/nplCategoryMixin";

export default {
  mixins: [categoryMixin],
  data() {
    return {
      notRequired: [
        "ID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "PermanentResidenceExtention1",
        "StartDate",
        "EndDate",
      ],
      apiGet: "/api/NPLDrivers/Get",
      apiGetById: "/api/NPLDrivers/GetById",
      apiAdd: "/api/NPLDrivers/Add",
      apiEdit: "/api/NPLDrivers/Edit",
      apiDelete: "/api/NPLDrivers/Delete",
    };
  },
  created() {
    console.log("Đang phát triển!");
  },
  ///phải format lại cái dataForm
  methods: {
    getByID(id, isActive) {
      let body = {
        ID: id,
      };
      nplAPI
        .submitData(body, this.apiGetById)
        .then((val) => {
          let obj = val.status ? val.data : null;
          if (obj) {
            let newObj = handling.showExtensionFormEdit(obj);
            newObj.GoodType[1] = newObj.GoodType[1].replace(/:1/g, '').split(",")
            let isActiveValue = isActive
            if(obj.IsActive === 0 || obj.IsActive === 1) {
              isActiveValue = obj.IsActive
            }
            this.dataForm = {
              ...newObj,
              ID: ["ID", id, "ID", null],
              IsActive: [this.$t("status.status"), isActiveValue, "IsActive", null ],
            };

            //lịch sử thao tác
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
          } else {
            this.dataForm = null;
            this.dataHistory = [];
            this.dataAttachFile = [];
          }
        })
        .catch((err) => console.log(err));
    },
    handleSave() {
      this.isClearFilter = true; //tắt cái đang filter ở danh sách hiện tại

      if (!this.dataForm) return;
      this.isCheckIsValid = true;
      if (!this.checkFormValidate()) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("toast.content")
        );
      }
      let obj = {};
      for (const key in this.dataForm) {
        if (key == "GoodType") {
          const arr = this.dataForm[key][1];
          let string = "";
          arr.forEach((item) => {
            string += `${item}:1,`;
          });
          obj = {
            ...obj,
            [key]: string.slice(0, -1),
          };
        } else {
          obj = {
            ...obj,
            [key]: this.dataForm[key][1],
          };
        }
      }
      // console.log(obj);
      let body = {
        ...obj,
        CategoryType: this.CategoryType,
      };

      // console.log(body);
      if (body.ID) {
        nplAPI
          .submitData(body, this.apiEdit)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getData();
              this.getByID(obj.ID, obj.IsActive);
              this.currentMode = "readOnly";
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        nplAPI
          .submitData(body, this.apiAdd)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getData();
              this.getByID(val.data[0].ID, val.data[0].IsActive);
              this.getAttachFile(val.data[0].ID);
              this.isTakeNewIndex = true
              this.currentMode = "readOnly";
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      }
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
  .b-form-datepicker {
    .form-control {
      margin-top: 3px;
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
}
</style>
