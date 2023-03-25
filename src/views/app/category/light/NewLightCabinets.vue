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
            :showImportExcel="false"
            :showAdd="false"
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
                @changeAvatarBase64="changeAvatarBase64"
                @changeListImageBase64="changeListImageBase64"
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
import lightAPI from "@/api/modules/lightAPI";

import FormLightCabinets from "@/views/app/category/light/component/FormLightCabinets";

export default {
  components: {
    FormLightCabinets,
  },
  mixins: [categoryMixin],
  data() {
    return {
      notRequired: [
        "ID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "LinkAvatar",
        "CabinetID",
        "CabinetPhone",
        "CabinetPhonePassword",
        "ImageLink",
      ],
      avatarBase64: null,
      listImageBase64: [],
    };
  },
  computed: {
    renderForm() {
      return "FormLightCabinets";
    },
  },
  watch: {
    dataForm() {
      this.avatarBase64 = null;
      this.listImageBase64 = [];
    },
  },
  methods: {
    getDataAndLastDocument() {
      lightAPI
        .lightCabinetList()
        .then((val) => {
          // this.dataTable = val.status ? val.data : [];
          const arr = val.status ? val.data : [];
          if (arr.length) {
            arr.forEach((item) => {
              item.ID = item.CabinetID;
            });
          }
          this.dataTable = arr;

          if (this.dataTable.length) {
            this.loadDocumentByIndex(this.dataTable.length - 1);
          }
        })
        .catch((err) => console.log(err));
    },
    getData() {
      lightAPI
        .lightCabinetList()
        .then((val) => {
          // this.dataTable = val.status ? val.data : [];
          const arr = val.status ? val.data : [];
          if (arr.length) {
            arr.forEach((item) => {
              item.ID = item.CabinetID;
            });
          }
          this.dataTable = arr;
        })
        .catch((err) => console.log(err));
    },
    getByID(id, isActive) {
      let body = {
        ID: id,
      };
      lightAPI
        .lightCabinetByID(body)
        .then((val) => {
          let obj = val.status ? val.data : null;
          if (obj) {
            let newObj = handling.showExtensionFormEdit(obj);
            this.dataForm = {
              ...newObj,
              ID: ["ID", id, "ID", null],
              IsActive: [this.$t("status.status"), isActive, "IsActive", null],
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
            } else {
              this.Histories = [];
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
        const type = this.dataForm[key][2];
        if (key === "ImageLink") {
          obj.ImageLink = [];
          if (this.dataForm[key][1]?.length > 0) {
            // ImageLink
            this.dataForm[key][1].forEach((e) => {
              if (e.ImageLink) {
                obj.ImageLink.push(e.ImageLink);
              }
            });
          }
          if (this.listImageBase64?.length > 0) {
            this.listImageBase64.forEach((e) => {
              let string = e.Images.split(",")[1];
              obj.ImageLink.push(string);
            });
          }
        } else if (type.toUpperCase() === "AVATAR" && this.avatarBase64) {
          obj[key] = this.avatarBase64.split(",")[1];
        } else {
          obj[key] = this.dataForm[key][1];
        }
      }
      let body = {
        ...obj,
      };
      this.currentMode = "readOnly";

      if (body.ID) {
        lightAPI
          .lightCabinetEditDeploy(body)
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
      }
      // else {
      //   lightAPI
      //     .addFireLocation(body)
      //     .then((val) => {
      //       if (val.status) {
      //         this.showNotify("success", this.$t("toast.message"), val.message);
      //         this.getDataAndLastDocument();
      //       } else {
      //         this.showNotify("error", this.$t("toast.message"), val.message);
      //       }
      //     })
      //     .catch((err) => console.log(err));
      // }
    },
    handleDelete(id) {
      this.$bvModal
        .msgBoxConfirm(`${this.$t("modal.confirm-delete")} ${id} ?`, {
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
              ID: id,
            };
            lightAPI.lightCabinetRemove(body).then((val) => {
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
    changeAvatarBase64(value) {
      this.avatarBase64 = value;
    },
    changeListImageBase64(value) {
      this.listImageBase64 = value;
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
}
</style>
