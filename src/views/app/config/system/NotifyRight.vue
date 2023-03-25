<template>
  <div id="app-content-full" class="npl-categories npl-regions">
    <b-card>
      <div style="margin-top: -15px">
        <Title :title="objectData?.formName" />
      </div>
      <b-row>
        <b-col lg="3">
          <div class="units-frame">
            <div class="units-header">
              <div class="units-title text-info">
                {{ $t("major") }}
              </div>
            </div>
            <div class="units-content">
              <template v-if="dataFactor?.length > 0">
                <div
                  v-for="(item, index) in dataFactor"
                  :key="index"
                  class="units-item"
                  :class="selectedFactor == item.FactorID && 'active'"
                  @click="changeFactor(item.FactorID)"
                >
                  <div>
                    {{ item.FactorName }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="units-item">
                  {{ $t("cards.no-data") }}
                </div>
              </template>
            </div>
          </div>
        </b-col>
        <b-col lg="3">
          <div class="units-frame">
            <div class="units-header">
              <div class="units-title text-info">{{ $t("function") }}</div>
            </div>
            <div class="units-content">
              <template v-if="dataFactorByID?.length > 0">
                <div
                  v-for="(item, index) in dataFactorByID"
                  :key="index"
                  class="units-item"
                  :class="selectedFactorID == item.EntryID && 'active'"
                  @click="changeFactorID(item)"
                >
                  <div>
                    {{ item.EntryName }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="units-item">
                  {{ $t("cards.no-data") }}
                </div>
              </template>
            </div>
          </div>
        </b-col>
        <b-col lg="3">
          <div class="units-frame">
            <div class="units-header">
              <div class="units-title text-info">
                {{ $t("notify.notification") }}
              </div>
            </div>
            <div class="units-content">
              <template v-if="dataNotifyTypes?.length > 0">
                <div
                  v-for="(item, index) in dataNotifyTypes"
                  :key="index"
                  class="units-item"
                  :class="selectedType == item.ID && 'active'"
                  @click="changeTypes(item.ID)"
                >
                  <div>
                    {{ item.NotifyTypeName }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="units-item">
                  {{ $t("cards.no-data") }}
                </div>
              </template>
            </div>
          </div>
        </b-col>
        <b-col lg="3">
          <div class="units-frame">
            <div class="units-header">
              <div class="units-title text-info">
                {{ $t("user-groups-receive-notifications") }}
              </div>
            </div>
            <div class="units-content">
              <DynamicTable
                v-if="dataNotifyRight?.length > 0"
                style="margin-top: -20px"
                :id="'units-npl'"
                ref="tableDynamic"
                :field-table="fields"
                :data-table="dataNotifyRight"
                :bordered="true"
                @status-edit="changeStatus"
                :isSearch="false"
                :isPagination="false"
              />
              <template v-else>
                <div class="units-item">
                  {{ $t("cards.no-data") }}
                </div>
              </template>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import Title from "@/views/app/category/npl/component/Title.vue";

import systemAPI from "@/api/modules/systemAPI";
import nplAPI from "@/api/modules/nplAPI";
import handling from "@/constants/handling.js";
import DynamicTable from "./DynamicTable.vue";

export default {
  components: {
    Title,
    DynamicTable,
  },
  data() {
    return {
      menuRight: [],
      columnAdd: [],
      selectedFactor: "",
      selectedFactorID: "",
      selectedType: "",
      selectedRight: "",
      titleModal: "",
      dataForm: null,
      notRequired: [
        "ID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "LemonID",
      ],
      updateUnitsType: "", //city, district, ward
      dataFactor: null,
      dataFactorByID: null,
      dataNotifyRight: null,
      dataNotifyTypes: null,
      keys: null,
      colTypes: null,
    };
  },
  computed: {
    fields() {
      let sort = false;
      let result = handling.mergeKeyDynamic(this.keys, this.colTypes, sort);

      return result;
    },
    objectData() {
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
      if (path.includes("category")) {
        return "Category";
      }
      return "";
    },
    CategoryType() {
      return this.$route.name;
    },
  },
  watch: {
    dataForm(newVal) {
      if (newVal) {
        this.$bvModal.show("modal-units");
      }
    },
  },
  async created() {
    this.getListMenuRight();
    this.getDynamicFormAdd(this.CategoryType);
    await this.getColTypes("NotifyRights");
    await this.getDataGeneral();
  },
  methods: {
    changeStatus(row) {
      const id = row.GroupID;
      const newStatus = handling.convertBooleanToBit(row.IsSelected);
      let body = {
        NotifyTypeID: "" + this.selectedType,
        GroupType: row.GroupType,
        GroupID: "" + row.GroupID,
        IsRight: newStatus,
      };
      systemAPI
        .changeNotifyRight(body)
        .then((val) => {
          if (val.status) {
            this.$notify("success", "THÔNG BÁO", this.$t("toast.success"), {
              duration: 3000,
              permanent: false,
            });
          } else {
            this.$notify("danger", "THÔNG BÁO", this.$t("toast.fail"), {
              duration: 2000,
              permanent: false,
            });
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
          this.colTypes = val.status ? val.data : null;
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
    getDynamicFormAdd(string) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .modalFields(body)
        .then((val) => {
          const arr = val.status ? val.data : [];
          this.columnAdd = arr.filter((item) => item.IsHide == 0);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getDataGeneral() {
      try {
        const factor = await this.getListFactor();
        const factorID = await this.getListFactorByID(factor[0].FactorID);
        const notifyType = await this.getListNotifyTypes(
          factorID[0]?.FactorID,
          factorID[0]?.EntryID
        );

        const notifyRight = await this.getListNotifyRight(notifyType[0].ID);
        //  const logStatus = await dataBase.logAccess(userInfo);
      } catch (error) {}
    },
    getListFactor() {
      return systemAPI
        .getFactors()
        .then((val) => {
          this.dataFactor = val.status ? val.data : [];
          if (this.dataFactor?.length > 0 && !this.selectedFactor) {
            this.selectedFactor = this.dataFactor[0]?.FactorID;
          }
          return val.data;
        })
        .catch((err) => console.log(err));
    },
    getListFactorByID(id) {
      let body = {
        FactorID: id,
      };
      return systemAPI
        .getEntryByFactorID(body)
        .then((val) => {
          this.dataFactorByID = val.status ? val.data : [];
          if (this.dataFactorByID?.length > 0 || !this.selectedFactorID) {
            this.selectedFactorID = this.dataFactorByID[0]?.EntryID;
          }
          return val.data;
        })
        .catch((err) => console.log(err));
    },
    getListNotifyTypes(factor, entry) {
      let body = {
        FactorID: factor,
        EntryID: entry,
      };
      return systemAPI
        .getNotifyTypes(body)
        .then((val) => {
          this.dataNotifyTypes = val.status ? val.data : [];
          if (this.dataNotifyTypes?.length > 0 || !this.selectedType) {
            this.selectedType = this.dataNotifyTypes[0]?.ID;
          }

          return val?.data;
        })
        .catch((err) => console.log(err));
    },
    getListNotifyRight(id) {
      let body = {
        NotifyTypeID: "" + id,
      };
      return systemAPI
        .getNotifyRight(body)
        .then((val) => {
          this.dataNotifyRight = val.status
            ? handling.convertDataBitToBoolean(val.data)
            : [];
          this.keys = val.status ? Object.keys(val.data[0]) : null;
          return val?.data;
        })
        .catch((err) => console.log(err));
    },
    async changeFactor(string) {
      try {
        if (this.selectedFactor == string) return;
        this.selectedFactor = string;
        await this.getListFactorByID(string);
        await this.getListNotifyTypes(
          this.dataFactorByID[0]?.FactorID,
          this.dataFactorByID[0]?.EntryID
        );
        await this.getListNotifyRight(this.dataNotifyTypes[0]?.ID);
      } catch (error) {
        console.log(error);
      }
    },
    async changeFactorID(item) {
      try {
        if (this.selectedFactorID == item?.EntryID) return;
        this.selectedFactorID = item?.EntryID;
        await this.getListNotifyTypes(item?.FactorID, item?.EntryID);
        await this.getListNotifyRight(this.dataNotifyTypes[0]?.ID);
      } catch (error) {
        console.log(error);
      }
    },
    async changeTypes(id) {
      try {
        if (this.selectedType === id) return;
        this.selectedType = id;
        await this.getListNotifyRight(id);
      } catch (error) {
        console.log(error);
      }
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
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
<style lang="scss">
.npl-regions {
  .units-frame {
    // border: 1px solid #dee2e6;
    margin-top: 15px;
  }
  .units-header {
    display: flex;
    align-items: center;
    background-color: #f3f3f3;
    border: 1px solid #f3f3f3;
    border-bottom: 0;
    height: 32px;
  }
  .units-title {
    padding: 5px 10px;

    // color: #17a2b8;
    // color: black;
    text-transform: uppercase;
    font-weight: bolder;
  }
  .btn-units {
    cursor: pointer;
    transition: all 0.3s linear;
    &:hover {
      opacity: 0.6;
    }
  }
  .units-content {
    height: calc(100vh - 250px);
    overflow: hidden auto;
    border: 1px solid #dee2e6;
    border-top: 0;
    // padding: 5px 10px;
    cursor: alias;
  }

  .units-item {
    display: flex;
    justify-content: space-between;
    // margin-bottom: 10px;
    padding: 5px 10px;

    i {
      font-size: 11px;
    }

    &:hover {
      background-color: #f3f3f3;
      color: black;
    }
    &.active {
      background-color: #f3f3f3;
      color: black;
      // background-color: #005aab;
      // color: white;
    }
  }
}
</style>
