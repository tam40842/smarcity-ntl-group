<template>
  <div>
    <template v-if="dataForm">
      <b-col lg="12" class="pl-0">
        <b-row>
          <b-col lg="2" xl="1">
            <b-form-group label="ID">
              <b-form-input
                :value="dataForm.ID ? dataForm.ID[1] : 'AUTO'"
                disabled
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="2" xl="1">
            <b-form-group
              :label="dataForm.LemonID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.LemonID[3]"
            >
              <b-form-input
                v-model="dataForm.LemonID[1]"
                :disabled="
                  currentMode === 'adding' || currentMode === 'editing'
                    ? false
                    : true
                "
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="4" xl="4">
            <b-form-group
              :label="dataForm.IsActive[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.IsActive[3]"
              v-if="dataForm.IsActive"
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
                  >{{ $t("npl.using") }}</b-form-radio
                >
                <b-form-radio
                  v-model="dataForm.IsActive[1]"
                  :value="0"
                  class="ml-2"
                  :disabled="
                    currentMode === 'adding' || currentMode === 'editing'
                      ? false
                      : true
                  "
                  >{{ $t("npl.not-use") }}</b-form-radio
                >
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="3">
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
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="3">
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
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="2">
            <b-form-group
              :label="dataForm.JobTypeID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.JobTypeID[3]"
            >
              <b-form-select
                v-model="dataForm.JobTypeID[1]"
                :options="dataFormOptions.JobTypeID"
                :disabled="
                  currentMode === 'adding' || currentMode === 'editing'
                    ? false
                    : true
                "
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col lg="2">
            <b-form-group
              :label="dataForm.ExpertID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.ExpertID[3]"
            >
              <b-form-select
                v-model="dataForm.ExpertID[1]"
                :options="dataFormOptions.ExpertID"
                :disabled="
                  currentMode === 'adding' || currentMode === 'editing'
                    ? false
                    : true
                "
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.AmountWork[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.AmountWork[3]"
                >
                  <b-form-input
                    v-model="dataForm.AmountWork[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    class="text-right"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.AmountWorker[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.AmountWorker[3]"
                >
                  <b-form-input
                    v-model="dataForm.AmountWorker[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    class="text-right"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.AmountTime[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.AmountTime[3]"
                >
                  <b-form-input
                    v-model="dataForm.AmountTime[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    class="text-right"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="8">
                <b-form-group
                  :label="dataForm.MSID[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.MSID[3]"
                >
                  <b-form-select
                    v-model="dataForm.MSID[1]"
                    :options="dataFormOptions.MSID"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="dataForm.MaintenanceSupplyAmount[0]"
                  :invalid-feedback="$t('form.no-blank')"
                  :state="dataForm.MaintenanceSupplyAmount[3]"
                >
                  <b-form-input
                    v-model="dataForm.MaintenanceSupplyAmount[1]"
                    :disabled="
                      currentMode === 'adding' || currentMode === 'editing'
                        ? false
                        : true
                    "
                    class="text-right"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="4">
            <b-form-group :label="dataForm.Note[0]">
              <b-form-textarea
                v-model="dataForm.Note[1]"
                rows="2"
                max-rows="6"
                :disabled="
                  currentMode === 'adding' || currentMode === 'editing'
                    ? false
                    : true
                "
                style="height: 113px"
              ></b-form-textarea>
            </b-form-group>
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
import dataFormOptions from "../mixin/dataFormOptionsMixin";

export default {
  props: ["dataForm", "currentMode", "CategoryType"],
  mixins: [dataFormOptions],
  created() {
    this.getSelect("Experts", "ExpertsName", "ExpertID");
    this.getSelect("JobTypes", "JobTypesName", "JobTypeID");
    this.getSelect("MaintenanceSupplies", "MaintenanceSuppliesName", "MSID");
  },
};
</script>

<style lang="scss" scoped></style>
