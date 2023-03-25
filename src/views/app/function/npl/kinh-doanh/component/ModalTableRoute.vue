<template>
  <div class="modal-table-route">
    <b-tabs v-model="currentTab">
      <b-tab :title="$t('npl.list-route')">
        <div class="h-100">
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
            style="margin-top: -1px; max-height: calc(100vh - 300px)"
            @row-dblclicked="handleDbClick"
            @row-selected="rowSelected"
          >
            <template
              v-if="fieldsTable.length"
              slot="top-row"
              slot-scope="{ fields }"
            >
              <td v-for="(field, index) in fields" :key="index">
                <div
                  v-if="
                    field.typeCol.toUpperCase() == 'DATE' ||
                    field.key.toUpperCase() == 'ODATE'
                  "
                  class="frame-filter text-dark"
                >
                  <div
                    v-if="checkIsFilter(field.key)"
                    class="btn-delete-filter"
                    @click="changeFilterValues(field.key, '', field.typeCol)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                      />
                    </svg>
                  </div>
                  <datepicker
                    :language="locale"
                    :format="datePickerFormat"
                    :bootstrap-styling="true"
                    :placeholder="$t('modal.day-select')"
                    :value="setFilterValues(field.key)"
                    @input="
                      (value) =>
                        changeFilterValues(field.key, value, field.typeCol)
                    "
                  />
                </div>
                <div
                  v-else-if="
                    field.key.toUpperCase() == 'ISATTACHFILE' ||
                    field.key.toUpperCase() == 'ISLOCK'
                  "
                  style="min-width: 80px"
                  class="frame-filter"
                >
                  <div
                    v-if="checkIsFilter(field.key)"
                    class="btn-delete-filter"
                    @click="changeFilterValues(field.key, '', field.typeCol)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                      />
                    </svg>
                  </div>
                  <b-form-select
                    :options="[
                      { text: $t('npl.button.all'), value: '' },
                      { text: $t('npl.button.yes'), value: 1 },
                      { text: $t('npl.button.no'), value: 0 },
                    ]"
                    :value="setFilterValues(field.key)"
                    @change="
                      (value) =>
                        changeFilterValues(field.key, value, field.typeCol)
                    "
                  />
                </div>
                <div
                  v-else-if="field.key.toUpperCase() == 'ISACTIVE'"
                  style="min-width: 100px"
                  class="frame-filter"
                >
                  <div
                    v-if="checkIsFilter(field.key)"
                    class="btn-delete-filter"
                    @click="changeFilterValues(field.key, '', field.typeCol)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                      />
                    </svg>
                  </div>
                  <b-form-select
                    :options="[
                      { text: $t('npl.button.all'), value: '' },
                      { text: $t('npl.using'), value: 1 },
                      { text: $t('npl.not-use'), value: 0 },
                    ]"
                    :value="setFilterValues(field.key)"
                    @change="
                      (value) =>
                        changeFilterValues(field.key, value, field.typeCol)
                    "
                  />
                </div>
                <div
                  v-else-if="field.typeCol.toUpperCase() == 'MONEY'"
                  style="min-width: 100px"
                  class="frame-filter"
                >
                  <div
                    v-if="checkIsFilter(field.key)"
                    class="btn-delete-filter"
                    @click="changeFilterValues(field.key, '', field.typeCol)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                      />
                    </svg>
                  </div>
                  <b-form-input
                    class="text-right"
                    :value="setFilterValues(field.key)"
                    :formatter="currencyFormatFilter"
                    @input="
                      (value) =>
                        changeFilterValues(field.key, value, field.typeCol)
                    "
                  />
                </div>
                <div
                  v-else-if="field.typeCol.toUpperCase() == 'ACTION'"
                  class="d-none"
                ></div>
                <div v-else class="frame-filter">
                  <div
                    v-if="checkIsFilter(field.key)"
                    class="btn-delete-filter"
                    @click="changeFilterValues(field.key, '', field.typeCol)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"
                      />
                    </svg>
                  </div>
                  <b-form-input
                    :placeholder="$t('modal.input-text')"
                    :value="setFilterValues(field.key)"
                    @input="
                      (value) =>
                        changeFilterValues(field.key, value, field.typeCol)
                    "
                  />
                </div>
              </td>
            </template>
            <template #cell(IsActive)="row">
              <div class="d-flex justify-content-center">
                <div style="width: 90px">
                  <Status
                    :color="row.item.IsActive ? 'green' : 'gray'"
                    :label="
                      row.item.IsActive ? $t('npl.using') : $t('npl.not-use')
                    "
                    :showCircle="false"
                  />
                </div>
              </div>
            </template>
            <template #cell(Action)="row">
              <div class="btn-action">
                <i
                  class="fas fa-edit text-black"
                  @click="handleEdit(row.item)"
                />
              </div>
            </template>
            <template #empty>
              <div class="text-center font-italic text-muted">
                {{ $t("data.non-data") }}
              </div>
            </template>
          </b-table>
        </div>
      </b-tab>
      <b-tab :title="$t('npl.create-edit')" @click="handleAdd">
        <template v-if="dataForm">
          <b-row class="mt-3">
            <b-col lg="2">
              <b-form-group :label="dataForm.ID ? dataForm.ID[0] : 'ID'">
                <b-form-input
                  :value="dataForm.ID ? dataForm.ID[1] : 'AUTO'"
                  disabled
                  class="text-center"
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
                  <b-form-radio v-model="dataForm.IsActive[1]" :value="1">
                    {{ $t("npl.using") }}
                  </b-form-radio>
                  <b-form-radio
                    v-model="dataForm.IsActive[1]"
                    :value="0"
                    class="ml-2"
                  >
                    {{ $t("npl.not-use") }}
                  </b-form-radio>
                </div>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <b-form-group
                :label="dataForm.StartCityID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.StartCityID[3]"
              >
                <v-select
                  v-model="dataForm.StartCityID[1]"
                  :options="dataFormOptions.StartCityID"
                  :reduce="(item) => item.value"
                  @input="
                    changeRegion('StartCityID', 'StartDistrictID', 'dataForm')
                  "
                  @change="
                    changeRegion('StartCityID', 'StartDistrictID', 'dataForm')
                  "
                />
              </b-form-group>
              <b-form-group
                :label="dataForm.StartDistrictID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.StartDistrictID[3]"
              >
                <v-select
                  v-model="dataForm.StartDistrictID[1]"
                  :options="dataFormOptions.StartDistrictID"
                  :reduce="(item) => item.value"
                  @input="
                    changeRegion('StartDistrictID', 'StartWardID', 'dataForm')
                  "
                  @change="
                    changeRegion('StartDistrictID', 'StartWardID', 'dataForm')
                  "
                />
              </b-form-group>
              <b-form-group
                :label="dataForm.StartWardID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.StartWardID[3]"
              >
                <v-select
                  v-model="dataForm.StartWardID[1]"
                  :options="dataFormOptions.StartWardID"
                  :reduce="(item) => item.value"
                  @input="autoCombine('dataForm')"
                  @change="autoCombine('dataForm')"
                />
              </b-form-group>
            </b-col>
            <b-col lg="6">
              <b-form-group
                :label="dataForm.EndCityID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.EndCityID[3]"
              >
                <v-select
                  v-model="dataForm.EndCityID[1]"
                  :options="dataFormOptions.EndCityID"
                  :reduce="(item) => item.value"
                  @input="
                    changeRegion('EndCityID', 'EndDistrictID', 'dataForm')
                  "
                  @change="
                    changeRegion('EndCityID', 'EndDistrictID', 'dataForm')
                  "
                />
              </b-form-group>
              <b-form-group
                :label="dataForm.EndDistrictID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.EndDistrictID[3]"
              >
                <v-select
                  v-model="dataForm.EndDistrictID[1]"
                  :options="dataFormOptions.EndDistrictID"
                  :reduce="(item) => item.value"
                  @input="
                    changeRegion('EndDistrictID', 'EndWardID', 'dataForm')
                  "
                  @change="
                    changeRegion('EndDistrictID', 'EndWardID', 'dataForm')
                  "
                />
              </b-form-group>
              <b-form-group
                :label="dataForm.EndWardID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.EndWardID[3]"
              >
                <v-select
                  v-model="dataForm.EndWardID[1]"
                  :options="dataFormOptions.EndWardID"
                  :reduce="(item) => item.value"
                  @input="autoCombine('dataForm')"
                  @change="autoCombine('dataForm')"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="8">
              <b-form-group
                :label="dataForm.Code[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.Code[3]"
              >
                <b-form-input
                  v-model="dataForm.Code[1]"
                  @input="resetStateInput('Code', 'dataForm')"
                />
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group
                :label="dataForm.LemonID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.LemonID[3]"
              >
                <b-form-input
                  v-model="dataForm.LemonID[1]"
                  @input="resetStateInput('LemonID', 'dataForm')"
                />
              </b-form-group>
            </b-col>

            <b-col lg="6">
              <b-form-group
                :label="dataForm.RouteGroupID[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.RouteGroupID[3]"
              >
                <v-select
                  v-model="dataForm.RouteGroupID[1]"
                  :options="dataFormOptions.RouteGroupID"
                  :reduce="(item) => item.value"
                  @input="resetStateInput('RouteGroupID', 'dataForm')"
                />
              </b-form-group>
            </b-col>
            <b-col lg="6">
              <b-form-group
                :label="dataForm.Distance[0]"
                :invalid-feedback="$t('form.no-blank')"
                :state="dataForm.Distance[3]"
              >
                <b-form-input
                  v-model="dataForm.Distance[1]"
                  class="text-right"
                  @input="resetStateInput('Distance', 'dataForm')"
                />
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
                  @input="resetStateInput('Name', 'dataForm')"
                  @change="resetStateInput('Name', 'dataForm')"
                />
              </b-form-group>
            </b-col>
            <b-col lg="12">
              <div>
                <b-form-group :label="dataForm.Note[0]">
                  <b-form-textarea
                    v-model="dataForm.Note[1]"
                    rows="2"
                    max-rows="6"
                  />
                </b-form-group>
              </div>
            </b-col>
          </b-row>
        </template>
      </b-tab>
    </b-tabs>
    <template v-if="currentTab == 0">
      <div class="d-flex justify-content-end">
        <b-button variant="outline-danger" size="sm" @click="hiddenModal">
          {{ $t("modal.cancel") }}
        </b-button>
        <b-button
          variant="primary"
          size="sm"
          class="d-inline-block ml-2"
          @click="chooseRoute"
        >
          {{ $t("modal.change") }}
        </b-button>
      </div>
    </template>
    <template v-else>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" size="sm" @click="handleSave">
          {{ $t("action.save") }}
        </b-button>
      </div>
    </template>
  </div>
</template>

<script>
import { en, vi } from "vuejs-datepicker/dist/locale";
import "vue-select/dist/vue-select.css";
import handling from "@/constants/handling.js";
import systemAPI from "@/api/modules/systemAPI";
import nplAPI from "@/api/modules/nplAPI";

import vSelect from "vue-select";
import Status from "@/components/Badges/StatusColor.vue";

export default {
  components: {
    "v-select": vSelect,
    Status,
  },
  data() {
    return {
      locale: this.$t("language") == "vn" ? vi : en,
      datePickerFormat: "dd/MM/yyyy",
      currentTab: 0,
      dataTable: [],
      objectKeys: [],
      colTypes: [],
      columnAdd: [],
      dataForm: null,
      isCheckIsValid: false,
      dataFormOptions: {
        StartCityID: [],
        StartDistrictID: [],
        StartWardID: [],
        EndCityID: [],
        EndDistrictID: [],
        EndWardID: [],
      },
      selectedStartCity: "",
      selectedStartDistrict: "",
      selectedEndCity: "",
      selectedEndDistrict: "",
      notRequired: [
        "ID",
        "Note",
        "NameExtention1",
        "AddressExtention1",
        "EntryID",
      ],
      checkRouteID: "",
      selectedRoute: "",

      //liên quan đến filter trong cột table
      filterValues: null,
      dataBeforeFilter: [],
      isClearFilter: false,
    };
  },
  computed: {
    fieldsTable() {
      if (this.objectKeys.length > 0 && this.colTypes.length > 0) {
        let result = handling.mergeKeyDynamic(this.objectKeys, this.colTypes);
        result.forEach((item) => {
          if (item.key.toUpperCase() === "ODATE") {
            item.sortable = false;
            item.typeCol = "date";
          } else {
            item.sortable = false;
            item.tdClass = item.tdClass.replace("pt-2", "");
          }
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
    "$i18n.locale"() {
      this.getData();
      this.getColTypes("nPLRoutes");
      this.getDynamicFormAdd("nPLRoutes");

      this.getSelect("RouteGroups", "RouteGroupsName", "RouteGroupID");
      this.getCities("StartCityID");
      this.getCities("EndCityID");
    },
    dataForm(newVal) {
      if (newVal) {
        if (newVal?.StartCityID[1]) {
          this.getDistrictsWardsFirst("StartDistrictID", newVal.StartCityID[1]);
          this.getDistrictsWardsFirst("EndDistrictID", newVal.EndCityID[1]);
        }
        if (newVal?.StartDistrictID[1]) {
          this.getDistrictsWardsFirst("StartWardID", newVal.StartDistrictID[1]);
          this.getDistrictsWardsFirst("EndWardID", newVal.EndDistrictID[1]);
        }
      }
    },
    currentTab() {
      this.isCheckIsValid = false;
      this.checkRouteID = "";
      this.selectedRoute = "";
      if (this.currentTab == 0) {
        this.dataForm = null;
      }
    },
    isClearFilter(newVal) {
      if (newVal) {
        this.filterValues = null;
      }
    },
  },
  created() {
    this.getData();
    this.getColTypes("nPLRoutes");
    this.getDynamicFormAdd("nPLRoutes");

    this.getSelect("RouteGroups", "RouteGroupsName", "RouteGroupID");
    this.getCities("StartCityID");
    this.getCities("EndCityID");
  },
  methods: {
    getData() {
      nplAPI
        .getRoutesList()
        .then((val) => {
          const arr = val.status ? val.data : [];
          this.dataTable = [...arr];
          this.dataBeforeFilter = [...arr]
          this.objectKeys = arr.length > 0 ? Object.keys(arr[0]) : [];
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
    getByID(id) {
      let body = {
        ID: id,
      };
      nplAPI
        .getRoutesByID(body)
        .then((val) => {
          let obj = val.status ? val.data : null;
          if (obj) {
            let newObj = handling.showExtensionFormEdit(obj);
            newObj.RouteGroupID[1] = newObj.RouteGroupID[1].toString();
            this.dataForm = {
              ...newObj,
              ID: ["ID", id, "ID", null],
              IsActive: [this.$t("status.status"), obj.IsActive, null, null],
            };
            this.currentTab = 1;
          } else {
            this.dataForm = null;
          }
        })
        .catch((err) => console.log(err));
    },
    resetStateInput(field, form) {
      //reset lại state khi có input để nó mất cái dòng cảnh báo đi
      if (this[form][field][3] === false) {
        this[form][field][3] = true;
      }
    },
    handleDbClick() {},
    rowSelected(row) {
      // this.$emit("rowSelected", row[0]);
      this.selectedRoute = row[0];
    },
    edit(item) {
      this.$emit("edit", item);
    },
    remove(item) {
      this.$emit("remove", item);
    },
    getCities(option) {
      let body = {
        Level: 2,
      };
      nplAPI
        .getCities(body)
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              if (item.IsActive == 1) {
                const obj = {
                  label: item.nPLRegionsName,
                  value: item.ID,
                };
                newArr.push(obj);
              }
            });
          }
          // this.dataFormOptions.City = newArr;
          this.dataFormOptions = {
            ...this.dataFormOptions,
            [option]: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
    getDistrictsWardsFirst(option, parentID) {
      if (parentID) {
        let body = {
          ParentId: parentID,
        };
        nplAPI
          .getDistrictsWards(body)
          .then((val) => {
            let data = val.status ? val.data : [];
            let newArr = [];
            if (data.length > 0) {
              data.forEach((item) => {
                if (item.IsActive == 1) {
                  const obj = {
                    label: item.nPLRegionsName,
                    value: item.ID,
                  };
                  newArr.push(obj);
                }
              });
            }
            this.dataFormOptions = {
              ...this.dataFormOptions,
              [option]: newArr,
            };
          })
          .catch((err) => console.log(err));
      }
    },
    getDistrictsWards(option, parentID) {
      if (parentID) {
        let body = {
          ParentId: parentID,
        };
        nplAPI
          .getDistrictsWards(body)
          .then((val) => {
            let data = val.status ? val.data : [];
            let newArr = [];
            if (data.length > 0) {
              data.forEach((item) => {
                if (item.IsActive == 1) {
                  const obj = {
                    label: item.nPLRegionsName,
                    value: item.ID,
                  };
                  newArr.push(obj);
                }
              });
            }
            if (newArr.length > 0) {
              //mặc định chọn phần tử đầu tiên trong mảng cho District, hoặc là Ward
              this.dataForm[option][1] = newArr[0].value;
              if (option == "StartDistrictID") {
                this.getDistrictsWards("StartWardID", newArr[0].value);
              } else if (option == "EndDistrictID") {
                this.getDistrictsWards("EndWardID", newArr[0].value);
              }
            }
            this.dataFormOptions = {
              ...this.dataFormOptions,
              [option]: newArr,
            };
          })
          .catch((err) => console.log(err));
      }
    },
    handleAdd() {
      if (this.columnAdd && this.columnAdd.length > 0) {
        let newObj = {};
        this.columnAdd.forEach((item) => {
          newObj = {
            ...newObj,
            [item.ClName]: [item.ShwName, "", item.TypeCol, null],
          };
        });
        this.dataForm = { ...newObj };
      } else {
        this.dataForm = null;
      }
    },
    handleEdit(item) {
      this.getByID(item.ID);
    },
    getSelect(type, nameKey, option) {
      let body = {
        CategoryType: type,
      };
      nplAPI
        .getCategoryActive(body)
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              if (type == "GoodsTypes") {
                newArr.push({
                  label: item[nameKey],
                  value: Number(item.ID),
                });
              }
              if (type == "MaintenanceJobs") {
                newArr.push({
                  label: item[nameKey],
                  value: item.ID,
                  supplies: item.MaintenanceSuppliesName,
                  supplyAmount: item.MaintenanceSupplyAmount,
                });
              } else {
                newArr.push({
                  label: item[nameKey],
                  value: item.ID,
                });
              }
            });
          }
          // this.dataFormOptions[option] = newArr //--> cái này có khi nó sẽ ko cập nhật lại
          this.dataFormOptions = {
            ...this.dataFormOptions,
            [option]: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
    changeRegion(field1, field2, form) {
      if (this[form][field1][3] === false) {
        this[form][field1][3] = true;
      }
      const value = this[form][field1][1];
      this.getDistrictsWards(field2, value);
      this.autoCombine(form);
    },
    autoCombine(form) {
      setTimeout(() => {
        const StartCityID = this[form]?.StartCityID[1] || "";
        const StartDistrictID = this[form]?.StartDistrictID[1] || "";
        const StartWardID = this[form]?.StartWardID[1] || "";
        const EndCityID = this[form]?.EndCityID[1] || "";
        const EndDistrictID = this[form]?.EndDistrictID[1] || "";
        const EndWardID = this[form]?.EndWardID[1] || "";
        if (
          StartCityID &&
          StartDistrictID &&
          StartWardID &&
          EndCityID &&
          EndDistrictID &&
          EndWardID
        ) {
          let body = {
            StartCityID,
            StartDistrictID,
            StartWardID,
            EndCityID,
            EndDistrictID,
            EndWardID,
          };

          nplAPI
            .checkRoutes(body)
            .then((val) => {
              let data = val.status ? val.data[0] : null;
              if (data) {
                this.checkRouteID = data.RouteID; //nếu 0 là ko có trong hệ thống
                this[form].Code[1] = data.RouteCode;
                this[form].Name[1] = data.Name;
                this[form].Distance[1] = data.Distance;
                if (data.RouteGroupID == 0) {
                  this[form].RouteGroupID[1] = "";
                } else {
                  this[form].RouteGroupID[1] = data.RouteGroupID.toString();
                }
                this[form] = { ...this[form] };
              }
            })
            .catch((err) => console.log(err));
        }
      }, 500);
    },
    checkIsValid(key) {
      //có bắt đầu kiểm có giá trị
      // let isValid = true
      if (!this.isCheckIsValid) {
        // isValid = true
        return true;
      }
      // const notRequired = ["ID", "Note"];
      if (this.notRequired.includes(key)) {
        // isValid = true
        return true;
      }
      const value = this.dataForm[key][1];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      if (value || value === 0 || value === false) {
        // isValid = true
        // console.log(key);
        return true;
      } else {
        // isValid = false
        return false;
      }
      // return isValid
    },
    checkFormValidate() {
      // let result = true;
      for (const key in this.dataForm) {
        // console.log(key);
        let result = this.checkIsValid(key);
        this.dataForm[key][3] = result;
        // console.log(result);
        if (!result) {
          console.log("invaildKey:", key);
          // break;
        }
      }
      this.dataForm = { ...this.dataForm }; //--> gán lại để render lại dataForm
      for (const key in this.dataForm) {
        if (!this.dataForm[key][3]) {
          return false;
        }
      }
      return true;
      // return result;
    },
    handleSave() {
      this.isClearFilter = true; //tắt cái đang filter ở danh sách hiện tại
      if (!this.dataForm) return null;
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

      let body = {
        ...obj,
        RouteID: this.checkRouteID,
      };

      if (body.ID) {
        nplAPI
          .editRoutes(body)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getData();
              this.currentTab = 0;
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        nplAPI
          .addRoutes(body)
          .then((val) => {
            if (val.status) {
              this.showNotify("success", this.$t("toast.message"), val.message);
              this.getData();
              this.currentTab = 0;
            } else {
              this.showNotify("error", this.$t("toast.message"), val.message);
            }
          })
          .catch((err) => console.log(err));
      }
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },
    hiddenModal() {
      this.$emit("hidden");
    },
    chooseRoute(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (!this.selectedRoute) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("npl.no-device-to-add")
        );
      }
      if (this.selectedRoute && this.selectedRoute.IsActive == 0) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("npl.no-choose-not-use")
        );
      }
      this.$emit("chooseRoute", this.selectedRoute);
    },
    //liên quan đến filter trong cột table
    changeFilterValues(key, value, typeCol = "") {
      console.log("changeFilterValues", key);
      this.filterValues = {
        ...this.filterValues,
        [key]: {
          value,
          typeCol,
        },
      };
      this.handleFilter(this.filterValues)
    },
    setFilterValues(key) {
      if (this.filterValues && this.filterValues[key]) {
        return this.filterValues[key].value;
      }
      return "";
    },
    checkIsFilter(key) {
      if (this.filterValues) {
        const value = this.filterValues[key]
          ? this.filterValues[key].value
          : "";
        if (value.toString() != "") {
          return true;
        }
      }
      return false;
    },
    handleFilter(obj) {
      this.isClearFilter = false;
      if (this.isFiltering(obj)) {
        const tempArr = this.filterFunc(obj, this.dataBeforeFilter);
        this.dataTable = [...tempArr];
      } else {
        //nếu không có giá trị filter nào thì load lại data
        this.dataTable = [...this.dataBeforeFilter];
      }
    },
    filterFunc(objFilter, arr = []) {
      if (!objFilter) return [];
      const newArr = arr.filter((item) => {
        for (const key in objFilter) {
          let value = objFilter[key].value;
          if (objFilter[key].typeCol.toUpperCase() == "DATE" && value) {
            value = moment(value).format("YYYY-MM-DD") || "";
          } else if (objFilter[key].typeCol.toUpperCase() == "MONEY") {
            value = this.revertCurrency(value);
          }
          if (
            !item[key]
              .toString()
              .toLowerCase()
              .trim()
              .includes(value.toString().toLowerCase().trim())
          ) {
            return false;
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
            return true;
          }
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
#modal-route-table {
  .body-modal-add {
    padding: 0.75rem;
  }
  .nav-link {
    padding-top: 0;
  }
}
.modal-table-route {
  td {
    vertical-align: middle;
  }
  .frame-filter {
    position: relative;
    .btn-delete-filter {
      width: 16px;
      height: 16px;
      position: absolute;
      z-index: 5;
      top: -5px;
      right: -5px;
      cursor: pointer;

      svg {
        transition: 0.3;
        &:hover {
          opacity: 0.9;
        }
        path {
          fill: #3a3a3a;
        }
      }
    }

    .vdp-datepicker {
      .vdp-datepicker__calendar {
        position: fixed;
      }
      .input-group {
      }
    }

    .vs__dropdown-menu {
      min-width: 100%;
    }
    .vs__selected-options {
      height: 34px;
      .vs__selected {
        padding: 5px 0 0 0 !important;
      }
    }
    .vs__search {
      display: none;
    }
    .custom-select {
      // height: 24px !important;
      &:focus {
        box-shadow: none;
      }
    }
  }

  .b-table-top-row {
    position: sticky;
    background: white;
    top: 43px;
    z-index: 2;
  }
}
</style>
