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
              <b-table
                id="npl-table-basic-form"
                class="npl-table-basic-form border-bottom"
                :fields="fieldsTable"
                :items="dataTable"
                bordered
                responsive
                show-empty
                head-variant="light"
                selectable
                :select-mode="'single'"
                sticky-header
                style="max-height: calc(100% - 15px); margin-top: -1px"
                @row-dblclicked="handleDbClick"
              >
                <template #cell(IsActive)="row">
                  <div style="max-width: 120px">
                    <Status
                      :color="row.item.IsActive ? 'green' : 'gray'"
                      :label="
                        row.item.IsActive ? $t('npl.using') : $t('npl.not-use')
                      "
                      :showCircle="false"
                    />
                  </div>
                </template>
                <template #empty>
                  <div class="text-center font-italic text-muted">
                    {{ $t("data.non-data") }}
                  </div>
                </template>
              </b-table>
              <!-- <b-pagination
                align="center"
                :total-rows="dataTable.length"
                :per-page="perPage"
                v-model="currentPage"
                size="sm"
              >
                <template v-slot:next-text>
                  <i class="simple-icon-arrow-right" />
                </template>
                <template v-slot:prev-text>
                  <i class="simple-icon-arrow-left" />
                </template>
                <template v-slot:first-text>
                  <i class="simple-icon-control-start" />
                </template>
                <template v-slot:last-text>
                  <i class="simple-icon-control-end" />
                </template>
              </b-pagination> -->
            </div>
          </b-tab>
          <b-tab>
            <Title :title="objectData.formName" />
            <div class="box-content mt-2" :style="{ height: heightContent2 }">
              <component
                :is="renderForm"
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
import handling from "@/constants/handling.js";
import categoryMixin from "@/views/app/category/npl/mixin/categoryMixin";
import FormFireLocations from '@/views/app/category/fire/component/FormFireLocations'

import fireAPI from "@/api/modules/fireAPI";


export default {
  components: {
    FormFireLocations
  },
  mixins: [categoryMixin],
  data() {
    return {
      notRequired: ["ID", "Note", "NameExtention1", "AddressExtention1", "LinkAvatar"],
    }
  },
  computed: {
    renderForm() {
      return 'FormFireLocations'
    }
  },
  methods: {
    getDataAndLastDocument() {
      fireAPI
        .fireLocationGet()
        .then((val) => {
          this.dataTable = val.status ? val.data : [];
          
          if (this.dataTable.length) {
            this.loadDocumentByIndex(this.dataTable.length - 1);
          }
        })
        .catch((err) => console.log(err));
    },
    getData() {
      fireAPI
        .fireLocationGet()
        .then((val) => {
          this.dataTable = val.status ? val.data : [];
        })
        .catch((err) => console.log(err));
    },
    getByID(id, isActive) {
      let body = {
        ID: id,
      };
      fireAPI
        .fireLocationByID(body)
        .then((val) => {
          let obj = val.status ? val.data : null;
          if (obj) {
            let newObj = handling.showExtensionFormEdit(obj);
            this.dataForm = {
              ...newObj,
              ID: ["ID", id, "ID", null],
              IsActive: [this.$t("status.status"), isActive, 'IsActive', null],
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
            else {
              this.Histories = []
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
        obj = {
          ...obj,
          [key]: this.dataForm[key][1],
        };
      }
      // console.log(obj);
      let body = {
        ...obj,
      };
      this.currentMode = "readOnly";

      // console.log(body);
      if (body.ID) {
        fireAPI
          .editFireLocation(body)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getData();
              this.getByID(obj.ID, obj.IsActive);
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        fireAPI
          .addFireLocation(body)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getDataAndLastDocument();
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      }
    },
    handleDelete(id) {
      this.$bvModal
        .msgBoxConfirm(`${this.$t("modal.confirm-delete")} ${id} ?`, {
          title: this.$t('toast.message'),
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
              ID: id,
            };
            fireAPI.fireLocationRemove(body).then((val) => {
              if (val.status) {
                this.showNotify(
                  "success",
                  this.$t("toast.message"),
                  val.message
                );
                this.getDataAndLastDocument();
              } else {
                this.showNotify("error", this.$t("toast.message"), val.message);
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
}
</style>
