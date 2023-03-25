<template>
  <div class="h-100">
    <template v-if="dataForm">
      <b-col lg="12" class="pl-0 form-light-cabinets h-100">
        <b-row class="h-100">
          <b-col lg="6">
            <strong class="text-info text-uppercase">{{
              $t("lights.light-cabinet-info")
            }}</strong>
            <b-row>
              <b-col lg="2">
                <b-form-group
                  :label="dataForm.CabinetID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.CabinetID[3]"
                >
                  <b-form-input v-model="dataForm.CabinetID[1]" disabled />
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-form-group
                  :label="dataForm.InputDate[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.InputDate[3]"
                >
                  <datepicker
                    v-model="dataForm.InputDate[1]"
                    :language="locale"
                    :format="datePickerFormat"
                    :bootstrap-styling="true"
                    :placeholder="$t('modal.day-select')"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="
                      formatDateToServer(
                        dataForm.InputDate[1],
                        'InputDate',
                        'dataForm'
                      )
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="4">
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
              <b-col lg="5">
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
                    @input="resetStateInput('Name')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="7">
                <b-form-group
                  :label="dataForm.Address[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.Address[3]"
                >
                  <b-form-input
                    v-model="dataForm.Address[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="resetStateInput('Address')"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="5">
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
                    @input="resetStateInput('NameExtention1')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="7">
                <b-form-group
                  :label="dataForm.AddressExtention1[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.AddressExtention1[3]"
                >
                  <b-form-input
                    v-model="dataForm.AddressExtention1[1]"
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
              <b-col lg="5">
                <b-row>
                  <b-col lg="6">
                    <b-form-group
                      :label="dataForm.CabinetLat[0]"
                      :invalid-feedback="$t('form.no-blank')"
                      :state="dataForm.CabinetLat[3]"
                    >
                      <b-form-input
                        v-model="dataForm.CabinetLat[1]"
                        :disabled="
                          currentMode === 'adding' || currentMode === 'editing'
                            ? false
                            : true
                        "
                      />
                    </b-form-group>
                  </b-col>
                  <b-col lg="6">
                    <b-form-group
                      :label="dataForm.CabinetLong[0]"
                      :invalid-feedback="$t('form.no-blank')"
                      :state="dataForm.CabinetLong[3]"
                    >
                      <b-form-input
                        v-model="dataForm.CabinetLong[1]"
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
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.RegionID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.RegionID[3]"
                >
                  <treeselect
                    name="tree-select-input"
                    :searchable="searchable"
                    :close-on-select="closeOnSelect"
                    :options="dataFormOptions.RegionID"
                    :max-height="500"
                    :placeholder="placeholder"
                    :default-expand-level="keyShow"
                    :no-results-text="noResultsText"
                    v-model="dataForm.RegionID[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group
                  :label="dataForm.PowerTypeID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.PowerTypeID[3]"
                >
                  <b-form-select
                    v-model="dataForm.PowerTypeID[1]"
                    :options="dataFormOptions.PowerTypeID"
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
              <b-col lg="3">
                <b-form-group
                  :label="dataForm.ConnectTypeID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.ConnectTypeID[3]"
                >
                  <b-form-select
                    v-model="dataForm.ConnectTypeID[1]"
                    :options="dataFormOptions.ConnectTypeID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-form-group
                  :label="dataForm.SessionData[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.SessionData[3]"
                >
                  <b-form-input
                    v-model="dataForm.SessionData[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group
                  :label="dataForm.CabinetPhone[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.CabinetPhone[3]"
                >
                  <b-form-input
                    v-model="dataForm.CabinetPhone[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? checkConnectTypeID('ConnectTypeID', 'dataForm')
                          ? false
                          : true
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.CabinetPhonePassword[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.CabinetPhonePassword[3]"
                >
                  <b-form-input
                    v-model="dataForm.CabinetPhonePassword[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? checkConnectTypeID('ConnectTypeID', 'dataForm')
                          ? false
                          : true
                        : true
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group :label="dataForm.Note[0]">
                  <b-form-textarea
                    v-model="dataForm.Note[1]"
                    style="height: 36px"
                    rows="1"
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
            <b-row>
              <b-col lg="4">
                <b-form-group :label="dataForm.LinkAvatar[0] + ':'">
                  <b-form-file
                    v-model="avatar"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                  <b-row class="mt-4">
                    <b-colxx md="12">
                      <b-form-group>
                        <template v-if="avatarBase64">
                          <b-img
                            :src="avatarBase64"
                            fluid
                            alt="avatar-image"
                            style="height: 150px"
                          />
                        </template>
                        <template v-else>
                          <template v-if="dataForm.LinkAvatar[1]">
                            <b-img
                              :src="dataForm.LinkAvatar[1]"
                              fluid
                              alt="avatar-image"
                              style="height: 150px"
                            />
                          </template>
                        </template>
                      </b-form-group>
                    </b-colxx>
                  </b-row>
                </b-form-group>
              </b-col>
              <b-col lg="8">
                <b-form-group :label="dataForm.ImageLink[0] + ':'">
                  <b-form-file
                    v-model="listImage"
                    :placeholder="$t('update-image') + '...'"
                    :file-name-formatter="formatNames"
                    multiple
                    accept="image/*"
                    :browse-text="$t('browse-text')"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  />
                </b-form-group>
                <template
                  v-if="
                    (listImageBase64 && listImageBase64.length > 0) ||
                    (dataForm.ImageLink[1] && dataForm.ImageLink[1].length > 0)
                  "
                >
                  <div class="box">
                    <carousel
                      v-if="isShowCarousel"
                      :autoplay="true"
                      :loop="true"
                      :autoplayLoop="true"
                      :autoplayTimeout="3000"
                      :perPage="2"
                      :navigationEnabled="true"
                    >
                      <template
                        v-if="listImageBase64 && listImageBase64.length > 0"
                      >
                        <template v-for="(img, i) in listImageBase64">
                          <slide :key="i + 'a'" style="" class="slide">
                            <div style="height: 149px; position: relative">
                              <b-img
                                style="width: 100%; height: 149px"
                                :src="img.Images"
                              />
                              <b-badge
                                v-if="
                                  currentMode === 'adding' ||
                                  currentMode === 'editing'
                                "
                                style="
                                  background: red !important;
                                  position: absolute;
                                  right: 0px;
                                  top: -5px;
                                  cursor: pointer;
                                "
                                @click.stop.prevent="removeBase64(i, 'BASE64')"
                              >
                                X
                              </b-badge>
                            </div>
                          </slide>
                        </template>
                      </template>
                      <template
                        v-if="
                          dataForm.ImageLink[1] &&
                          dataForm.ImageLink[1].length > 0
                        "
                      >
                        <template v-for="(img, i) in dataForm.ImageLink[1]">
                          <slide :key="i + 'b'" class="slide">
                            <div style="height: 149px; position: relative">
                              <b-img
                                style="width: 100%; height: 149px"
                                :src="img.ImageLink"
                              />

                              <b-badge
                                v-if="
                                  currentMode === 'adding' ||
                                  currentMode === 'editing'
                                "
                                style="
                                  background: red !important;
                                  position: absolute;
                                  right: 0px;
                                  top: -5px;
                                  cursor: pointer;
                                "
                                @click.stop.prevent="
                                  removeBase64(i, 'DATAFORM', 'ImageLink')
                                "
                              >
                                X
                              </b-badge>
                            </div>
                          </slide>
                        </template>
                      </template>
                    </carousel>
                  </div>
                </template>
                <template v-else>
                  <div style="height: 149px">
                    <b-img
                      style="width: 100%; height: 149px; background: #c1c1c1"
                      :src="'https://dainam.edu.vn/img/system/no-image.png'"
                    />
                  </div>
                </template>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="6" class="h-100">
            <div class="d-flex align-items-center">
              <strong class="text-info text-uppercase">{{
                $t("lights.light-info")
              }}</strong>
              <b-button
                class="ml-1"
                squared
                :variant="`outline-primary`"
                size="sm"
                style="
                  height: 24px;
                  padding: 1px;
                  padding-left: 3px;
                  padding-right: 3px;
                "
                :style="{
                  visibility:
                    currentMode === 'adding' || currentMode === 'editing'
                      ? 'visible'
                      : 'hidden',
                }"
                @click="addLamp"
              >
                <i class="fas fa-plus" /> <b>{{ $t("npl.button.add") }}</b>
              </b-button>
            </div>

            <template v-if="dataTableLamps.length > 0">
              <b-table
                id="npl-table-basic-form"
                class="npl-table-basic-form border-bottom"
                :fields="fieldsTableLamps"
                :items="dataTableLamps"
                bordered
                responsive
                head-variant="light"
                selectable
                :select-mode="'single'"
                sticky-header
                style="max-height: calc(100% - 15px); margin-top: -1px"
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
                <template #cell(Action)="row">
                  <div class="btn-action">
                    <i
                      class="fas fa-edit text-black"
                      @click="editLamp(row.item)"
                    />
                    <i
                      class="fad fa-trash-alt text-danger"
                      @click="removeLamp(row.item)"
                    />
                  </div>
                </template>
              </b-table>
            </template>
            <template v-else>
              <div>
                {{ $t("data.non-data") }}
              </div>
            </template>
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
    <b-modal
      id="modal-add-lamp"
      :title="$t('modal.add')"
      size="lg"
      cancel-variant="outline-danger"
      :ok-title="$t('modal.change')"
      :cancel-title="$t('modal.cancel')"
      @ok="handleAddLamp"
      @hidden="hiddenModalAddLamp"
    >
      <b-table
        v-if="dataTableSelectLamps.length > 0"
        id="table-child"
        :items="dataTableSelectLamps"
        :fields="[
          { key: 'LampID', label: $t('fire.device-id') },
          { key: 'STT', label: $t('lights.STT') },
          { key: 'LampName', label: $t('fire.device-name') },
        ]"
        :bordered="true"
        head-variant="light"
        class="border-bottom"
        select-mode="single"
        selectable
        @row-selected="rowSelectedLamp"
      />
      <template v-else>
        {{ $t("cards.no-data") }}
      </template>
    </b-modal>
    <b-modal
      id="modal-edit-deploy-lamp"
      :title="$t('modal.edit')"
      size="lg"
      cancel-variant="outline-danger"
      :ok-title="$t('modal.change')"
      :cancel-title="$t('modal.cancel')"
      @ok="handleEditDeployLamp"
      @hidden="hiddenModalEditDeployLamp"
    >
      <FormLamps
        :dataForm="dataFormLamp"
        :listImageBase64="listImageBase64Lamp"
        :isShowCarousel="isShowCarouselLamp"
        :dataFormOptions="dataFormOptions"
        @changeAvatarBase64="changeAvatarBase64Lamp"
      />
    </b-modal>
  </div>
</template>

<script>
import handling from "@/constants/handling.js";
import lightAPI from "@/api/modules/lightAPI";
import systemAPI from "@/api/modules/systemAPI";
import shareAPI from "@/api/modules/shareAPI";

import { en, vi } from "vuejs-datepicker/dist/locale";
import Treeselect from "@riophae/vue-treeselect";
import "@/assets/vue-treeselect/vue-treeselect.css";
import Status from "@/components/Badges/StatusColor.vue";
import FormLamps from "@/views/app/category/light/component/FormLamps";

export default {
  components: {
    Treeselect,
    Status,
    FormLamps,
  },
  // props: ["dataForm", "currentMode"],
  props: {
    dataForm: {
      type: Object,
      default: null,
    },
    currentMode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      locale: this.$t("language") == "vn" ? vi : en,
      datePickerFormat: "dd/MM/yyyy",
      dataFormOptions: {
        ConnectTypeID: [],
        PowerTypeID: [],
        RegionID: [],
      },
      listImage: null,
      listImageBase64: [],
      isShowCarousel: true,
      avatarBase64: null,
      avatar: null,
      searchable: true,
      closeOnSelect: true,
      placeholder: this.$t("form.find"),
      noResultsText: this.$t("form.no-result"),
      keyShow: 0,

      //liên quan đến đèn
      dataTableLamps: [],
      objectKeysLamps: [],
      colTypesLamps: [],
      dataTableSelectLamps: [], //cái danh sách xuất hiện trên modal chọn xuống
      selectedLampFromModal: null,

      //cập nhật triển khai của đèn
      dataFormLamp: null,
      listImageBase64Lamp: [],
      avatarBase64Lamp: null,
      isShowCarouselLamp: true,

      file: null,
      base64String: null,
      dataTableFireStations: [],
      colTypesFireStations: [],
      objectKeysFireStations: [],
      titleModalTable: "",
      titleModal: "",
      dataTableSelectFireStations: [],
      selectedFireStations: "",
      selectedFireStationFromModal: "",
      dataFormEditDeployFireStations: null,
      isCheckIsValid: false,
      notRequired: [
        "ID",
        "StationID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "ImageLink",
        "LampPhone",
        "LampPhonePassword",
      ],
    };
  },
  computed: {
    fieldsTableLamps() {
      if (this.objectKeysLamps.length > 0 && this.colTypesLamps.length > 0) {
        let result = handling.mergeKeyDynamic(
          this.objectKeysLamps,
          this.colTypesLamps
        );
        if (result) {
          result.forEach((item) => {
            item.sortable = false;
            item.tdClass = item.tdClass.replace("pt-2", "");
          });
          if (this.currentMode === "adding" || this.currentMode === "editing") {
            return [
              ...result,
              {
                key: "Action",
                label: this.$t("fire.action"),
                thClass: "text-center",
                tdClass: "text-center",
              },
            ];
          } else {
            return result;
          }
        }
      }
      return [];
    },
  },
  watch: {
    "$i18n.locale"() {
      this.getPowerTypeOption();
      this.getConnectTypeOption();
      this.getRegion();
      this.getColTypes("SLLamps");
    },
    dataForm(newVal) {
      this.getLightLampByCabinetID();
      this.avatarBase64 = null;
      this.avatar = null;
      this.listImageBase64 = [];
      if (newVal) {
        this.isShowCarousel = false;
        setTimeout(() => {
          this.isShowCarousel = true;
        }, 300);
      }
    },
    listImage(to, from) {
      if (to && to.length > 0) {
        // this.dataForm['ImageLink'][1] = []
        // this.listImageBase64.length = 0
        for (let i = 0; i < to.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(to[i]);
          setTimeout(() => {
            this.listImageBase64.push({
              ID: to[i].lastModified + i,
              Images: reader.result,
            });
            this.$emit("changeListImageBase64", this.listImageBase64);
          }, 500);
        }
      }
    },
    avatar(to, from) {
      if (to) {
        this.avatarBase64 = null;
        let reader = new FileReader();
        reader.readAsDataURL(to);
        setTimeout(() => {
          this.avatarBase64 = reader.result;
          this.$emit("changeAvatarBase64", this.avatarBase64);
        }, 500);
      }
    },
    file(newVal) {
      this.getBase64String(newVal);
    },
  },
  created() {
    this.getPowerTypeOption();
    this.getConnectTypeOption();
    this.getRegion();
    this.getColTypes("SLLamps");
  },
  methods: {
    formatDateToServer(value, field, form) {
      this[form][field][1] = moment(value).format("YYYY-MM-DD");
    },
    resetStateInput(field) {
      //reset lại state khi có input để nó mất cái dòng cảnh báo đi
      if (this.dataForm[field][3] === false) {
        this.dataForm[field][3] = true;
      }
    },
    getRegion() {
      shareAPI
        .shareRegionList()
        .then((val) => {
          if (val.status) {
            let array = [];
            handling.recursiveTreeSelectRegion(val.data, 0, array);
            this.dataFormOptions.RegionID = array;
            let arrTable = [];
            this.convertKeyTableData(val.data, 0, arrTable, 0);
            // this.regionOption = arrTable;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    convertKeyTableData(array, parentID, arrayTable = [], i) {
      array.forEach((item) => {
        if (item["RegionParentID"] !== parentID) {
          return;
        }
        let obj = {
          IsActive: item["IsActive"],
          Note: item["Note"],
          RegionID: item["RegionID"],
          RegionName: item["RegionName"],
          RegionParentID: item["RegionParentID"],
          Key: i,
        };
        arrayTable.push(obj);
        this.convertKeyTableData(array, item["RegionID"], arrayTable, i + 1);
      });
    },
    getPowerTypeOption() {
      shareAPI
        .getListPowerTypeActive()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.PowerTypeID = [];
              for (let i = 0; i < val.data.length; i++) {
                let obj = {
                  text: val.data[i].PowerTypeName,
                  value: val.data[i].PowerTypeID,
                };
                this.dataFormOptions.PowerTypeID.push(obj);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getConnectTypeOption() {
      shareAPI
        .getListConnectTypeActive()
        .then((val) => {
          if (val.status) {
            if (val.data.length > 0) {
              this.dataFormOptions.ConnectTypeID = [];
              for (let i = 0; i < val.data.length; i++) {
                let obj = {
                  text: val.data[i].ConnectTypeName,
                  value: val.data[i].ConnectTypeID,
                };
                this.dataFormOptions.ConnectTypeID.push(obj);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkConnectTypeID(field, form) {
      const value = this[form][field][1];
      const obj = this.dataFormOptions[field].find(
        (item) => item.value == value
      );
      if (obj) {
        if (
          obj.text.toUpperCase().includes("2G") ||
          obj.text.toUpperCase().includes("3G") ||
          obj.text.toUpperCase().includes("4G") ||
          obj.text.toUpperCase().includes("5G")
        ) {
          return true;
        }
      }
      return false;
    },
    getLightLampByCabinetID() {
      let body = {
        ID: this.dataForm.ID[1].toString(),
      };
      lightAPI
        .lightLampByCabinetID(body)
        .then((val) => {
          let data = val.status ? val.data : [];
          this.dataTableLamps = data;
          this.objectKeysLamps = data.length > 0 ? Object.keys(data[0]) : null;
        })
        .catch((err) => console.log(err));
    },
    removeBase64(index, key, property) {
      this.isShowCarousel = false;
      setTimeout(() => {
        if (key === "BASE64") {
          let remove = this.listImageBase64.splice(index, 1);
        }
        if (key === "DATAFORM" && property) {
          let remove = this.dataForm[property][1].splice(index, 1);
        }
        this.isShowCarousel = true;
      }, 100);
    },
    formatNames(files) {
      return files.length === 1
        ? files[0].name
        : `${files.length} ${this.$t("form.image")}`;
    },
    generateBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
      });
    },
    async getBase64String(file) {
      // console.log(file);
      const base64 = await this.generateBase64(file);
      if (base64.includes("image")) {
        this.base64String = base64;
      } else {
        this.base64String = null;
        this.showNotify(
          "danger",
          this.$t("toast.fail").toUpperCase(),
          this.$t("choose-file-image")
        );
      }
    },
    getColTypes(string) {
      let body = {
        ObjectName: string,
      };
      systemAPI
        .tableFields(body)
        .then((val) => {
          this.colTypesLamps = val.status ? val.data : null;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataTableSelectLamps() {
      lightAPI
        .getDeployLamps()
        .then((val) => {
          this.dataTableSelectLamps = val.status ? val.data : [];
          this.$bvModal.show("modal-add-lamp");
        })
        .catch((err) => console.log(err));
    },
    addLamp() {
      if (this.currentMode == "adding" || this.currentMode == "editing") {
        this.getDataTableSelectLamps();
      }
    },
    rowSelectedLamp(row) {
      this.selectedLampFromModal = row[0].LampID;
    },
    handleAddLamp(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (!this.selectedLampFromModal) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("fire.no-device-to-add")
        );
      }
      let body = {
        LampID: this.selectedLampFromModal.toString(),
        CabinetID: this.dataForm.ID[1].toString(),
      };
      lightAPI
        .editLampsByCabinet(body)
        .then((val) => {
          if (val.status) {
            this.showNotify("success", this.$t("toast.message"), val.message);
            this.getLightLampByCabinetID();
          } else {
            this.showNotify("error", this.$t("toast.message"), val.message);
          }
          this.$bvModal.hide("modal-add-lamp");
        })
        .catch((err) => console.log(err));
    },
    hiddenModalAddLamp() {
      this.selectedLampFromModal = null;
    },
    removeLamp(obj) {
      if (this.currentMode == "adding" || this.currentMode == "editing") {
        let body = {
          LampID: obj.LampID.toString(),
        };
        lightAPI
          .deleteLampsByCabinet(body)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getLightLampByCabinetID();
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      }
    },
    editLamp(obj) {
      if (this.currentMode == "adding" || this.currentMode == "editing") {
        const id = obj.LampID.toString();
        let body = {
          ID: id,
        };
        lightAPI
          .lightLampByID(body)
          .then((val) => {
            const obj = val.status ? val.data : null;
            if (obj) {
              let newObj = handling.showExtensionFormEdit(obj);
              this.dataFormLamp = {
                ...newObj,
                ID: ["ID", id, "ID", null],
              };
              this.$bvModal.show("modal-edit-deploy-lamp");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleEditDeployLamp(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (!this.dataFormLamp) return;
      this.isCheckIsValid = true;
      if (!this.checkFormValidate("dataFormLamp")) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("toast.content")
        );
      }
      this.isCheckIsValid = false;
      let obj = {};
      for (const key in this.dataFormLamp) {
        const type = this.dataFormLamp[key][2];
        if (key === "ImageLink") {
          obj.ImageLink = [];
          if (this.dataFormLamp[key][1]?.length > 0) {
            // ImageLink
            this.dataFormLamp[key][1].forEach((e) => {
              if (e.ImageLink) {
                obj.ImageLink.push(e.ImageLink);
              }
            });
          }
          if (this.listImageBase64Lamp?.length > 0) {
            this.listImageBase64Lamp.forEach((e) => {
              let string = e.Images.split(",")[1];
              obj.ImageLink.push(string);
            });
          }
        } else if (type.toUpperCase() === "AVATAR" && this.avatarBase64Lamp) {
          obj[key] = this.avatarBase64Lamp.split(",")[1];
        } else {
          obj = {
            ...obj,
            [key]: this.dataFormLamp[key][1],
          };
        }
      }
      let body = {
        ...obj,
      };
      lightAPI
        .editDeployLamps(body)
        .then((val) => {
          if (val.status) {
            this.showNotify("success", this.$t("toast.message"), val.message);
            this.getLightLampByCabinetID();
          } else {
            this.showNotify("error", this.$t("toast.message"), val.message);
          }
          this.$bvModal.hide("modal-edit-deploy-lamp");
        })
        .catch((err) => console.log(err));
    },
    hiddenModalEditDeployLamp() {
      this.dataFormLamp = null;
    },
    checkIsValid(key, form) {
      //có bắt đầu kiểm có giá trị
      if (!this.isCheckIsValid) {
        return true;
      }
      // const notRequired = ["ID", "Note"];
      if (this.notRequired.includes(key)) {
        return true;
      }
      // const value = this.dataForm[key][1];
      let value = this[form][key][1];
      // if (form == "FireStations") {
      //   value = this.dataFormEditDeployFireStations[key][1];
      // } else if (form == "FireNodes") {
      //   value = this.dataFormEditDeployFireNodes[key][1];
      // }
      // console.log(value);
      if (value || value === 0 || value === false) {
        return true;
      } else {
        return false;
      }
    },
    checkFormValidate(form) {
      for (const key in this[form]) {
        let result = this.checkIsValid(key, form);
        this[form][key][3] = result;
        if (!result) {
          console.log("invaildKey:", key);
          // break;
        }
      }
      this[form] = {
        ...this[form],
      }; //--> gán lại để render lại dataForm
      for (const key in this[form]) {
        if (!this[form][key][3]) {
          return false;
        }
      }
      return true;
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },
    changeAvatarBase64Lamp(value) {
      this.avatarBase64Lamp = value;
    },
  },
};
</script>

<style lang="scss">
.form-light-cabinets {
  padding-bottom: 15px;
  .show-image-video-2 {
    margin-top: 5px;
    display: block;
    position: relative;
    // padding-top: 75%;
    padding-top: 56.25%; //16:9
  }
  .show-image-video-2-2 {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .VueCarousel-pagination {
    display: none;
  }
  .b-form-file {
    height: 36px;
    .custom-file-label {
      height: 36px;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0;
      overflow: hidden;
      &::after {
        padding: 0.5rem 0.75rem;
        height: 36px;
      }
      // overflow: hidden;
    }
  }
  .vue-treeselect__control {
    height: 36px;
    padding: 0.25rem;
    margin-bottom: 0;
  }
  .vue-treeselect__input {
    vertical-align: middle;
  }
}
</style>
