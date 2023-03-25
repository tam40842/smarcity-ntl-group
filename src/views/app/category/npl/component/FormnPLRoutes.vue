<template>
  <div>
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="2" xl="1">
            <b-form-group label="ID">
              <b-form-input
                :value="modifyDataForm.ID ? modifyDataForm.ID[1] : 'AUTO'"
                disabled
                class="text-center"
              />
            </b-form-group>
          </b-col>
          <b-col lg="1">
            <b-form-group
              :label="modifyDataForm.LemonID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="modifyDataForm.LemonID[3]"
            >
              <b-form-input
                v-model="modifyDataForm.LemonID[1]"
                :disabled="
                  currentMode === 'adding' || currentMode === 'editing'
                    ? false
                    : true
                "
                @input="resetStateInput('LemonID', 'modifyDataForm')"
              />
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              v-if="modifyDataForm.IsActive"
              :label="modifyDataForm.IsActive[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="modifyDataForm.IsActive[3]"
            >
              <div class="d-flex">
                <b-form-radio
                  v-model="modifyDataForm.IsActive[1]"
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
                  v-model="modifyDataForm.IsActive[1]"
                  :value="0"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  class="ml-2"
                >
                  {{ $t("npl.not-use") }}
                </b-form-radio>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="5">
            <b-row>
              <b-col lg="6">
                <b-form-group
                  :label="modifyDataForm.StartCityID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.StartCityID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.StartCityID[1]"
                    :options="dataFormOptions.StartCityID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="
                      changeRegion(
                        'StartCityID',
                        'StartDistrictID',
                        'modifyDataForm'
                      )
                    "
                    @change="
                      changeRegion(
                        'StartCityID',
                        'StartDistrictID',
                        'modifyDataForm'
                      )
                    "
                  />
                </b-form-group>
                <b-form-group
                  :label="modifyDataForm.StartDistrictID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.StartDistrictID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.StartDistrictID[1]"
                    :options="dataFormOptions.StartDistrictID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="
                      changeRegion(
                        'StartDistrictID',
                        'StartWardID',
                        'modifyDataForm'
                      )
                    "
                    @change="
                      changeRegion(
                        'StartDistrictID',
                        'StartWardID',
                        'modifyDataForm'
                      )
                    "
                  />
                </b-form-group>
                <b-form-group
                  :label="modifyDataForm.StartWardID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.StartWardID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.StartWardID[1]"
                    :options="dataFormOptions.StartWardID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="autoCombine('modifyDataForm')"
                    @change="autoCombine('modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="modifyDataForm.EndCityID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.EndCityID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.EndCityID[1]"
                    :options="dataFormOptions.EndCityID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="
                      changeRegion(
                        'EndCityID',
                        'EndDistrictID',
                        'modifyDataForm'
                      )
                    "
                    @change="
                      changeRegion(
                        'EndCityID',
                        'EndDistrictID',
                        'modifyDataForm'
                      )
                    "
                  />
                </b-form-group>
                <b-form-group
                  :label="modifyDataForm.EndDistrictID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.EndDistrictID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.EndDistrictID[1]"
                    :options="dataFormOptions.EndDistrictID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="
                      changeRegion(
                        'EndDistrictID',
                        'EndWardID',
                        'modifyDataForm'
                      )
                    "
                    @change="
                      changeRegion(
                        'EndDistrictID',
                        'EndWardID',
                        'modifyDataForm'
                      )
                    "
                  />
                </b-form-group>
                <b-form-group
                  :label="modifyDataForm.EndWardID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.EndWardID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.EndWardID[1]"
                    :options="dataFormOptions.EndWardID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :reduce="(item) => item.value"
                    @input="autoCombine('modifyDataForm')"
                    @change="autoCombine('modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="6">
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="modifyDataForm.Code[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.Code[3]"
                >
                  <b-form-input
                    v-model="modifyDataForm.Code[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="resetStateInput('Code', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>

              <b-col lg="4">
                <b-form-group
                  :label="modifyDataForm.RouteGroupID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.RouteGroupID[3]"
                >
                  <b-form-select
                    v-model="modifyDataForm.RouteGroupID[1]"
                    :options="dataFormOptions.RouteGroupID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="resetStateInput('RouteGroupID', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-form-group
                  :label="modifyDataForm.Distance[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.Distance[3]"
                >
                  <b-form-input
                    v-model="modifyDataForm.Distance[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    class="text-right"
                    type="number"
                    @input="resetStateInput('Distance', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="10">
                <b-form-group
                  :label="modifyDataForm.Name[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.Name[3]"
                >
                  <b-form-input
                    v-model="modifyDataForm.Name[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="resetStateInput('Name', 'modifyDataForm')"
                    @change="resetStateInput('Name', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="10">
                <div>
                  <b-form-group :label="modifyDataForm.Note[0]">
                    <b-form-textarea
                      v-model="modifyDataForm.Note[1]"
                      :disabled="
                        currentMode === 'adding' || currentMode === 'editing'
                          ? false
                          : true
                      "
                      rows="2"
                      max-rows="6"
                    />
                  </b-form-group>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
  </div>
</template>

<script>
import moment from "moment";
import vSelect from "vue-select";
import nplAPI from "@/api/modules/nplAPI";
import datepickerMixin from "@/views/app/category/npl/mixin/datepickerMixin";
import dataFormOptions from "../mixin/dataFormOptionsMixin";

export default {
  components: {
    "v-select": vSelect,
  },
  mixins: [datepickerMixin, dataFormOptions],
  props: ["dataForm", "currentMode", "CategoryType"],
  data() {
    return {
      modifyDataForm: null,
      checkRouteID: "",
    };
  },
  watch: {
    "$i18n.locale"() {
      this.setUp();
    },
    dataForm(newVal) {
      if (this.dataForm) {
        this.modifyDataForm = { ...this.dataForm };
      } else {
        this.modifyDataForm = null;
      }
      // if (newVal) {
      //   if (newVal?.StartCityID[1]) {
      //     this.getDistrictsWardsFirst("StartDistrictID", newVal.StartCityID[1]);
      //     this.getDistrictsWardsFirst("EndDistrictID", newVal.EndCityID[1]);
      //   }
      //   if (newVal?.StartDistrictID[1]) {
      //     this.getDistrictsWardsFirst("StartWardID", newVal.StartDistrictID[1]);
      //     this.getDistrictsWardsFirst("EndWardID", newVal.EndDistrictID[1]);
      //   }
      //   if (newVal?.RouteGroupID) {
      //     this.dataForm.RouteGroupID[1] =
      //       this.dataForm.RouteGroupID[1].toString();
      //   }
      // }
    },
    modifyDataForm(newVal) {
      if (newVal) {
        if (newVal?.StartCityID[1]) {
          this.getDistrictsWardsFirst("StartDistrictID", newVal.StartCityID[1]);
          this.getDistrictsWardsFirst("EndDistrictID", newVal.EndCityID[1]);
        }
        if (newVal?.StartDistrictID[1]) {
          this.getDistrictsWardsFirst("StartWardID", newVal.StartDistrictID[1]);
          this.getDistrictsWardsFirst("EndWardID", newVal.EndDistrictID[1]);
        }
        if (newVal?.RouteGroupID) {
          this.modifyDataForm.RouteGroupID[1] =
            this.modifyDataForm.RouteGroupID[1].toString();
        }
      }
    },
    // checkRouteID() {
    //   console.log('watch checkRouteID');
    //   this.$emit('changeCheckRouteID', this.checkRouteID)
    // }
  },
  created() {
    this.setUp();
  },
  methods: {
    setUp() {
      this.getSelect("RouteGroups", "RouteGroupsName", "RouteGroupID");
      this.getCities("StartCityID");
      this.getCities("EndCityID");
    },
    resetStateInput(field, form) {
      //reset lại state khi có input để nó mất cái dòng cảnh báo đi
      if (this[form][field][3] === false) {
        this[form][field][3] = true;
      }
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
    changeRegion(field1, field2, form) {
      // if (this[form][field1][3] === false) {
      //   this[form][field1][3] = true;
      // }
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
                // this.checkRouteID = data.RouteID; //nếu 0 là ko có trong hệ thống
                this.$emit("changeCheckRouteID", data.RouteID);
                // console.log(data.RouteID);
                // console.log(this.checkRouteID);
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
  },
};
</script>

<style lang="scss" scoped></style>
