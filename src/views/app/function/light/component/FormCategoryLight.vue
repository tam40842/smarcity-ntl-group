<template>
  <div class="mt-3 npl-form-fixation">
    <form v-if="dataForm" ref="form" @submit.stop.prevent="emitSubmit">
      <b-row>
        <b-col xl="4" lg="4">
          <b-row class="align-items-center">
            <b-col lg="3">
              <b-form-group :label="'Mã chương trình:'">
                <b-form-input
                  :id="'ID-input'"
                  :value="dataForm.ScheduleID ? dataForm.ScheduleID : 'AUTO'"
                  disabled
                  class="text-center"
                />
              </b-form-group>
            </b-col>
            <b-col lg="9">
              <b-form-group
                :label="'Tên lịch điều khiển:'"
                :invalid-feedback="$t('form.no-blank')"
                :state="stateForm.OName"
              >
                <b-form-input
                  :id="'OName-input'"
                  v-model="dataForm.OName"
                  :disabled="!disableAdd"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="3">
              <b-form-group :label="'Thời gian bắt đầu:'">
                <b-input-group class="mb-3">
                  <b-input-group-append>
                    <b-form-timepicker
                      ref="lightTimepicker"
                      v-model="timeNow"
                      button-only
                      locale="vi"
                      :disabled="!disableAdd"
                      @input="formatTimeNow"
                    />
                  </b-input-group-append>
                  <b-form-input
                    id="example-input"
                    v-model="timeNow"
                    type="text"
                    placeholder="HH:mm"
                    :disabled="!disableAdd"
                    @change="formatTimeNow"
                  />
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col lg="5">
              <b-form-group :label="'Thông tin điều khiển:'">
                <b-form-select
                  v-model="dataForm.ActionID"
                  class="text-left"
                  :options="ActionID"
                  size="sm"
                  :disabled="!disableAdd"
                />
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <template
                v-if="dataForm.ActionID !== 0 && dataForm.ActionID !== 5"
              >
                <b-form-group :label="'Mức sáng:'">
                  <b-form-select
                    v-model="dataForm.LightID"
                    class="text-left"
                    :options="LightID"
                    size="sm"
                    :disabled="!disableAdd"
                  />
                </b-form-group>
              </template>
              <template v-else-if="dataForm.ActionID === 5">
                <b-form-group :label="'Chế độ tùy chọn:'">
                  <b-form-select
                    :id="'RelayID-input'"
                    v-model="dataForm.CustomAction"
                    class="text-left"
                    :options="CustomAction"
                    size="sm"
                    :disabled="!disableAdd"
                  />
                </b-form-group>
              </template>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <div>
                <h6 class="small-title-led">Thông tin lịch điều khiển</h6>
                <b-form-group class="mb-0">
                  <div class="d-flex align-items-center">
                    <label class="mb-0">Chế độ:</label>
                    <b-form-radio-group
                      v-model="dataForm.SelectID"
                      class="ml-2"
                      :options="optionsMode"
                      name="radio-inline"
                      :disabled="!disableAdd"
                    />
                  </div>
                </b-form-group>
              </div>
            </b-col>
            <b-col lg="6">
              <b-form-group label="Trạng thái">
                <b-form-radio-group
                  id="radio-group-isactive"
                  v-model="dataForm.IsActive"
                  :options="optionsRadio"
                  :disabled="!disableEdit"
                >
                </b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <div v-if="dataForm.SelectID == 2">
                <div
                  class="d-flex frame-choose-all-week align-items-center"
                  @click="isSelectedAll"
                >
                  <b-form-checkbox
                    :checked="autoChecked"
                    :disabled="!disableAdd"
                  />
                  <div style="font-weight: 600">Tất cả các thứ trong tuần</div>
                </div>
                <b-form-checkbox-group
                  id="checkbox-group-light"
                  v-model="selectedDay"
                  :disabled="!disableAdd"
                  :options="optionsDay"
                  name="checkbox-group"
                  class="choose-day"
                />
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <b-form-group :label="'Ghi chú:'">
                <b-form-textarea
                  v-model="dataForm.Note"
                  class="text-left"
                  rows="3"
                  max-rows="6"
                  :disabled="!disableAdd"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="6" lg="6">
          <div class="d-flex frame-choose-all-week" @click="isSelectTableAll">
            <b-form-checkbox
              :checked="autoCheckedTable"
              size="md"
              class="mb-2"
              :disabled="!disableAdd"
            >
              <b>{{ $t("all").toUpperCase() }} (CHỌN TỦ QUẢN LÍ CHIẾU SÁNG)</b>
            </b-form-checkbox>
          </div>
          <b-table
            :no-border-collapse="true"
            :bordered="true"
            :hover="true"
            :items="dataTable"
            :fields="fieldTable"
            head-variant="light"
            class="mb-0"
            thead-class="text-center"
            sort-by="title"
            :current-page="isPagination ? currentPage : null"
            :per-page="isPagination ? perPage : null"
          >
            <template #head()="scope">
              <div class="text-nowrap">{{ scope.label }}</div>
            </template>
            <template v-slot:cell(Actions)="row">
              <b-form-checkbox
                v-if="isShow"
                v-model="row.item.IsSelected"
                :disabled="!disableAdd"
                size="md"
                @change="handleChangeIsSelect(row.item)"
              />
            </template>
          </b-table>
          <template v-if="dataTable && dataTable.length > 0">
            <b-pagination
              v-show="isPagination"
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
            </b-pagination>
          </template>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import handling from "@/constants/handling";
import Treeselect from "@riophae/vue-treeselect";
import "@/assets/vue-treeselect/vue-treeselect.css";
import lightAPI from "@/api/modules/lightAPI";

export default {
  components: { Treeselect },
  props: [
    "nameForm",
    "titleForm",
    "dataForm",
    "dataFormOption",
    "stateForm",
    "apiForm",
    "idForm",
    "typeForm",
    "menuCurrent",
    "days",
    "clearDayChk",
    "showSelectID",
    "CustomAction",
    "LightID",
    "ActionID",
    "isPagination",
    "disabled",
    "pCurrentIndex",
    "disableAdd",
    "disableEdit",
    "typeAction",
  ],
  data() {
    return {
      dataTable: null,
      isShow: true,
      T2: null,
      T3: null,
      T4: null,
      T5: null,
      T6: null,
      T7: null,
      CN: null,

      optionsRadio: [
        { text: "Đang dùng", value: 1 },
        { text: "Không dùng", value: 0 },
      ],
      // CustomActionValue: 1,

      optionsMode: [
        { text: "Một lần", value: 1 },
        { text: "Lặp lại", value: 2 },
      ],
      optionsDay: [
        { text: "CN", value: 1 },
        { text: "T2", value: 2 },
        { text: "T3", value: 3 },
        { text: "T4", value: 4 },
        { text: "T5", value: 5 },
        { text: "T6", value: 6 },
        { text: "T7", value: 7 },
      ],
      selectedDay: [],
      timeNow: "",
      fieldTable: [
        {
          key: "Actions",
          label: "Chọn",
          tdClass: "text-center",
        },
        {
          key: "CabinetID",
          label: "Mã quản lý",
        },
        {
          key: "CabinetName",
          label: "Tên quản lý",
        },
        {
          key: "RegionName",
          label: "Khu vực/ nhóm",
        },
        {
          key: "CabinetAddress",
          label: "Địa chỉ lắp đặt",
        },
      ],
      filterOn: [],
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    autoChecked() {
      return this.selectedDay.length === this.optionsDay.length;
    },
    autoCheckedTable() {
      return this.dataForm?.CabinetID?.length === this.dataTable?.length;
    },
  },
  watch: {
    async typeAction(v) {
      this.getDataTable();
    },
    dataForm(v) {
      this.timeNow = `${this.dataForm?.Hour}:${this.dataForm?.Minute}`;
      this.dataForm.Hour = moment(this.timeNow, "HH:mm:ss").format("HH");
      this.dataForm.Minute = moment(this.timeNow, "HH:mm:ss").format("mm");
      this.handleDefaultDay();
      this.getDataTable();
    },

    "dataForm.SelectID"(to, from) {
      if (to !== from && this.typeAction?.toUpperCase() === "ADD") {
        this.selectedDay = [];
      }
    },
    "dataForm.ActionID"(to, from) {
      let customControl = 5; // thông tin lịch điều khiển
      if (to === customControl) {
        this.dataForm.LightID = 0;
      }
    },
    timeNow(time) {
      this.dataForm.Hour = moment(time, "HH:mm:ss").format("HH");
      this.dataForm.Minute = moment(time, "HH:mm:ss").format("mm");
    },

    selectedDay(days) {
      this.dataForm.CN = 0;
      this.dataForm.T2 = 0;
      this.dataForm.T3 = 0;
      this.dataForm.T4 = 0;
      this.dataForm.T5 = 0;
      this.dataForm.T6 = 0;
      this.dataForm.T7 = 0;
      days.forEach((value) => {
        if (value == 1) {
          this.dataForm.CN = 1;
        }
        if (value == 2) {
          this.dataForm.T2 = 1;
        }
        if (value == 3) {
          this.dataForm.T3 = 1;
        }
        if (value == 4) {
          this.dataForm.T4 = 1;
        }
        if (value == 5) {
          this.dataForm.T5 = 1;
        }
        if (value == 6) {
          this.dataForm.T6 = 1;
        }
        if (value == 7) {
          this.dataForm.T7 = 1;
        }
      });
    },
  },
  async created() {
    await this.getDataTable();
    this.timeNow = `${this.dataForm?.Hour}:${this.dataForm?.Minute}`;
  },
  methods: {
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },

    formatTimeNow() {
      this.$nextTick(() => {
        this.timeNow = this.$refs.lightTimepicker.formattedValue;
      });
    },

    isSelectTableAll(bol) {
      if (this.typeAction) {
        if (this.dataForm.CabinetID.length !== this.dataTable.length) {
          this.dataTable = this.dataTable.map((item) => {
            this.add(item);
            return {
              ...item,
              IsSelected: true,
            };
          });
        } else {
          this.dataForm.CabinetID.length = 0;
          this.dataTable = this.dataTable.map((item) => {
            return {
              ...item,
              IsSelected: false,
            };
          });
        }
      }
    },
    isSelectedAll() {
      if (!this.disabled) {
        if (this.selectedDay.length !== this.optionsDay.length) {
          this.selectedDay = this.optionsDay.map((d) => d.value);
        } else {
          this.selectedDay = [];
        }
      }
    },
    handleDefaultDay() {
      this.selectedDay = [];
      if (this.dataForm.CN == 1) {
        this.selectedDay.push(1);
      }
      if (this.dataForm.T2 == 1) {
        this.selectedDay.push(2);
      }
      if (this.dataForm.T3 == 1) {
        this.selectedDay.push(3);
      }
      if (this.dataForm.T4 == 1) {
        this.selectedDay.push(4);
      }
      if (this.dataForm.T5 == 1) {
        this.selectedDay.push(5);
      }
      if (this.dataForm.T6 == 1) {
        this.selectedDay.push(6);
      }
      if (this.dataForm.T7 == 1) {
        this.selectedDay.push(7);
      }
    },
    emitSubmit(keyStringDetele) {
      if (!this.checkFormValidityModal("dataForm")) {
        this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("toast.content")
        );
        return;
      } else {
        if (keyStringDetele?.toUpperCase() === "DELETE") {
          this.$emit("emitSubmit", this.dataForm, "DELETE", this.id);
        } else {
          this.$emit("emitSubmit", this.dataForm, this.apiForm, this.id);
        }
      }
    },
    getDataTable() {
      lightAPI
        .lightCabinetList()
        .then((val) => {
          this.dataTable = val.status && val.data.length > 0 ? val.data : [];
          this.dataTable.forEach((e) => (e.IsSelected = false));
          if (this.autoCheckedTable) {
            this.dataForm.CabinetID = [];
            this.dataTable.forEach((e) => {
              e.IsSelected = true;
              this.dataForm.CabinetID.push(e.CabinetID);
            });
          } else {
            this.dataForm.CabinetID.forEach((id) => {
              this.dataTable.forEach((e) => {
                if (e.CabinetID == id) {
                  e.IsSelected = true;
                }
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getHours(string) {
      let time = moment(string, "HH:mm:ss");
      return time.format("HH");
    },
    getMinute(string) {
      let time = moment(string, "HH:mm:ss");
      return time.format("mm");
    },
    convertDate(string) {
      let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss");
      return date.format("DD/MM/YYYY");
    },
    checkFormValidityModal(form) {
      if (form === "dataForm") {
        // nhắc validation
        for (const key in this.dataForm) {
          if (document.getElementById(`${key}-input`)) {
            let value = this.dataForm[key];
            if (value || value === 0 || value === false) {
              value = true;
            } else {
              value = false;
            }
            this.stateForm[key] = value;
          }
        }

        // hiển thị showNotify
        let result = null;
        for (const key in this.stateForm) {
          if (document.getElementById(`${key}-input`)) {
            let booleanState = this.stateForm[key];
            if (booleanState) {
              result = booleanState;
            } else {
              // nếu chỉ 1 field chưa nhập break ra luôn
              result = booleanState;
              break;
            }
          }
        }
        return result;
      }
    },
    convertBody(body) {
      if (body.hasOwnProperty("CabinetStatus")) {
        body.CabinetStatus = handling.convertBooleanToBit(body.CabinetStatus);
      }
      body.CustomAction = this.CustomActionValue;
      return body;
    },
    convertBitToBoolean: (value) => !!value,
    handleChangeIsSelect(item) {
      if (item.IsSelected == true) {
        this.add(item);
      } else {
        this.remove(item);
      }
    },
    add(item) {
      let id = item.CabinetID;
      this.dataForm.CabinetID.push(id);
      this.dataForm.CabinetID = [...new Set(this.dataForm.CabinetID)];
    },
    remove(item) {
      const index = this.dataForm.CabinetID.findIndex(
        (id) => id == item.CabinetID
      );
      this.dataForm.CabinetID.splice(index, 1);
      this.dataForm.CabinetID = [...new Set(this.dataForm.CabinetID)];
    },
  },
};
</script>
<style>
.cus-form-group {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}
.cus-form-group button {
  background: #c8ced3;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}
.cus-form-group label {
  text-align: center;
}

#checkbox-group-light .custom-control-inline {
  margin-right: 0.5rem !important;
}
</style>
<style scoped>
.small-title-led {
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.frame-choose-all-week {
  position: relative;
  cursor: pointer;
}

.frame-choose-all-week::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
