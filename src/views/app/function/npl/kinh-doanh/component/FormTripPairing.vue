<template>
  <div class="crane-allowance">
    <template v-if="modifyDataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="4">
            <b-row>
              <b-col lg="7">
                <b-form-group
                  :label="modifyDataForm.ID ? modifyDataForm.ID[0] : 'OID'"
                >
                  <b-form-input
                    :value="modifyDataForm?.ID[1] || 'AUTO'"
                    disabled
                    class="text-center"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="5">
                <b-form-group
                  :label="modifyDataForm.ODate[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.ODate[3]"
                >
                  <datepicker
                    v-model="modifyDataForm.ODate[1]"
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
                        modifyDataForm.ODate[1],
                        'ODate',
                        'modifyDataForm'
                      )
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group
                  :label="modifyDataForm.VehicleGroupID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.VehicleGroupID[3]"
                >
                  <v-select
                    v-model="modifyDataForm.VehicleGroupID[1]"
                    :options="dataFormOptions.VehicleGroupID"
                    :reduce="(item) => item.value"
                    multiple
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    @input="resetStateInput('VehicleGroupID', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="modifyDataForm.TotalQuantityTrip[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.TotalQuantityTrip[3]"
                >
                  <b-form-input
                    v-model="modifyDataForm.TotalQuantityTrip[1]"
                    class="text-right"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    type="number"
                    @input="resetStateInput('TotalQuantityTrip', 'modifyDataForm')"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group
                  :label="modifyDataForm.TotalAmountTrip[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="modifyDataForm.TotalAmountTrip[3]"
                >
                  <b-form-input
                    v-model="modifyDataForm.TotalAmountTrip[1]"
                    class="text-right"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    :formatter="
                      (value) =>
                        currencyFormatInput(
                          value,
                          'TotalAmountTrip',
                          'modifyDataForm'
                        )
                    "
                  />
                </b-form-group>
              </b-col>
              <b-col lg="12">
                <b-form-group :label="modifyDataForm.Note[0]">
                  <b-form-textarea
                    v-model="modifyDataForm.Note[1]"
                    rows="2"
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
                <div
                  v-if="
                    modifyDataForm.IsActive && modifyDataForm.IsActive[1] == 1
                  "
                  class="img-lock"
                >
                  <img
                    src="/assets/img/npl/img-lock.png"
                    alt=""
                    style="height: 60px"
                  >
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="8">
            <ChildTable
              :title="$t('npl.details-of-supplementary-items')"
              :items="childTable.PairshipAllowancesDetails.items"
              :fields="getFieldsChildTable('PairshipAllowancesDetails')"
              :currentMode="currentMode"
              tableName="PairshipAllowancesDetails"
              :formatCurrency="formatCurrency"
              :formatDecimal="formatDecimal"
              @add="addChildTable"
              @edit="editChildTable"
              @remove="removeChildTable"
            />
          </b-col>
        </b-row>
      </b-col>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
    <b-modal
      id="modal-child-table"
      :title="$t('modal.add')"
      body-class="body-modal-add"
      size="md"
      cancel-variant="outline-danger"
      :ok-title="$t('modal.change')"
      :cancel-title="$t('modal.cancel')"
      @ok="handleModalChildTable"
      @hidden="hiddenModalChildTable"
    >
      <template v-if="formModalAdd">
        <b-row>
          <b-col lg="12">
            <b-form-group
              :label="formModalAdd.NumberOfRedemptions[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="formModalAdd.NumberOfRedemptions[3]"
            >
              <b-form-input
                v-model="formModalAdd.NumberOfRedemptions[1]"
                class="text-right"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col lg="12">
            <b-form-group
              :label="formModalAdd.RouteID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="formModalAdd.RouteID[3]"
            >
              <v-select
                v-model="formModalAdd.RouteID[1]"
                :options="
                  getSelectChildTable(
                    dataFormOptions.RouteID,
                    tableName,
                    'RouteID'
                  )
                "
                :reduce="(item) => item.value"
                @input="resetStateInput('RouteID', 'formModalAdd')"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import nplAPI from "@/api/modules/nplAPI";
import formMixin from "@/views/app/function/npl/kinh-doanh/mixin/formMixin";

export default {
  mixins: [formMixin],
  data() {
    return {
      childTable: {
        PairshipAllowancesDetails: {
          items: [],
          objectKeys: [],
          colTypes: [],
          columnAdd: [],
        },
      },
    };
  },
  watch: {
    "$i18n.locale"() {
      this.setUp();
    },
    dataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToShow(newVal);
        this.modifyDataForm = obj;
      } else {
        this.modifyDataForm = null;
      }
    },
    isTakeDataForm(newVal) {
      if (newVal) {
        const obj = this.customDataFormToServer(this.modifyDataForm);
        this.$emit("getDataForm", obj);
      }
    },
  },
  created() {
    this.setUp();
  },
  methods: {
    setUp() {
      this.getSelect("VehicleGroups", "VehicleGroupsName", "VehicleGroupID");
      this.getRoute()
      this.getColTypesChildTable(
        "PairshipAllowancesDetails",
        "PairshipAllowancesDetails"
      );
      this.getDynamicFormAddChildTable(
        "PairshipAllowancesDetails",
        "PairshipAllowancesDetails"
      );
    },
    getRoute() {
      nplAPI
        .getRoutesActive()
        .then((val) => {
          let data = val.status ? val.data : [];
          let newArr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              newArr.push({
                label: item.RoutesName,
                value: item.ID.toString(),
                code: item.Code,
              });
            });
          }
          this.dataFormOptions = {
            ...this.dataFormOptions,
            RouteID: newArr,
          };
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss">
.body-modal-add {
  .custom-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.6rem;
    height: 36px;
  }
}
.crane-allowance {
  th {
    padding: 0.5rem;
  }
  td {
    white-space: nowrap;
    vertical-align: middle;
    padding: 0.5rem;

    .form-control {
      border: none;
      padding: 0;
    }
    .form-control:disabled {
      background-color: white;
    }
  }
}
</style>
