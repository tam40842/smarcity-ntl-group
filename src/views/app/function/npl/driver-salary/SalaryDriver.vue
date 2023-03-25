<template>
  <div id="app-content-full" class="main">
    <b-card no-body>
      <div class="content">
        <div class="actions">
          <HeaderActions
            :index="currentIndex"
            :isReadonly="isReadonly"
            :isAdd="isAdd"
            :isEdit="isEdit"
            :items="listSalaryDriver"
            :selectedItem="selectedSalaryDriver"
            @changeActions="handleChangeActions"
            @firstIndex="handleFirstIndex"
            @preIndex="handlePreIndex"
            @nextIndex="handleNextIndex"
            @lastIndex="handleLastIndex"
          />
        </div>
        <div class="content-tabs">
          <b-tabs v-model="currentTab" nav-class="d-none">
            <b-tab>
              <b-overlay :show="isLoadingSalaryDriver" rounded="sm">
                <div
                  v-if="errorSalaryDriver"
                  class="error text-center m-4 text-muted"
                >
                  <strong>{{ errorSalaryDriver }}</strong>
                </div>
                <ListItem
                  v-else
                  :fields="fieldSalaryDriverFinal"
                  :items="listSalaryDriver"
                  :disablePagination="true"
                  :optionBlockStatus="[
                    ...optionBlockStatus,
                    { id: -1, label: 'Tất cả', value: -1, text: 'Tất cả' },
                  ]"
                  @returnClick="handleClick"
                  @returnDbClick="handleDbClick"
                  @returnListData="handleListDataByFilter"
                />
              </b-overlay>
            </b-tab>
            <b-tab>
              <FormDetailSlot
                :item="selectedSalaryDriver"
                :prItem="dataSalaryDriverByID"
                :isAdd="isAdd"
                @updateTitle="returnTitle"
              >
                <template #customForm="slotProps">
                  <div
                    v-if="isShow && slotProps.dataForm"
                    class="content-form p-2"
                  >
                    <b-row>
                      <b-col xl="6" lg="9" md="9">
                        <b-row>
                          <b-col lg="3">
                            <b-form-group
                              :label="slotProps.dataForm.OID.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                :value="
                                  isAdd ? `AUTO` : slotProps.dataForm.OID.value
                                "
                                disabled
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="3">
                            <b-form-group
                              v-if="slotProps.dataForm.ODate"
                              :label="slotProps.dataForm.ODate.label"
                              class="custom-label-group"
                            >
                              <b-form-datepicker
                                v-model="slotProps.dataForm.ODate.value"
                                locale="vi"
                                placeholder="DD/MM/YYYY"
                                :disabled="isReadonly"
                                :date-format-options="{ month: 'numeric' }"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col lg="3">
                            <b-form-group
                              v-if="slotProps.dataForm.nPLDriversID"
                              :label="slotProps.dataForm.nPLDriversID.label"
                              class="custom-label-group"
                              :invalid-feedback="
                                $t('form.please-invalid') +
                                slotProps.dataForm.nPLDriversID.label
                              "
                              :state="slotProps.dataForm.nPLDriversID.valid"
                            >
                              <VSelect
                                :value="
                                  listDriver.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.nPLDriversID.value
                                  )
                                "
                                :disabled="isReadonly"
                                :options="listDriver"
                                :reduce="(listDriver) => listDriver.id"
                                name="label"
                                @input="
                                  handleChangeVSelectByKey(
                                    'nPLDriversID',
                                    $event
                                  )
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="3">
                            <b-form-group
                              :label="`Điện thoại`"
                              class="custom-label-group"
                            >
                              <b-form-input
                                :value="
                                  listDriver.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.nPLDriversID.value
                                  )
                                    ? listDriver.find(
                                        (e) =>
                                          e.id ==
                                          slotProps.dataForm.nPLDriversID.value
                                      ).PhoneNumber
                                    : null
                                "
                                :disabled="true"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="6">
                            <b-form-group
                              :label="`Địa chỉ`"
                              class="custom-label-group"
                            >
                              <b-form-input
                                :value="
                                  listDriver.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.nPLDriversID.value
                                  )
                                    ? listDriver.find(
                                        (e) =>
                                          e.id ==
                                          slotProps.dataForm.nPLDriversID.value
                                      ).nPLDriversAddress
                                    : null
                                "
                                :disabled="true"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col lg="3">
                            <b-form-group
                              v-if="slotProps.dataForm.Month"
                              :label="slotProps.dataForm.Month.label"
                              class="custom-label-group"
                              :invalid-feedback="
                                $t('form.please-invalid') +
                                slotProps.dataForm.Month.label
                              "
                              :state="slotProps.dataForm.Month.valid"
                            >
                              <VSelect
                                v-model="slotProps.dataForm.Month.value"
                                :disabled="isReadonly"
                                :options="optionDate"
                                @input="
                                  handleChangeVSelectByKey('Month', $event)
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="3">
                            <b-form-group
                              v-if="slotProps.dataForm.Amount"
                              :label="slotProps.dataForm.Amount.label"
                              class="custom-label-group"
                              :invalid-feedback="
                                $t('form.please-invalid') +
                                slotProps.dataForm.Amount.label
                              "
                              :state="slotProps.dataForm.Amount.valid"
                            >
                              <b-form-input
                                id="Amount-input"
                                class="text-right"
                                :value="
                                  convertFloat(slotProps.dataForm.Amount.value)
                                "
                                :disabled="isReadonly"
                                @input="handleUpdateByKey('Amount', $event)"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="6">
                            <b-form-group
                              v-if="slotProps.dataForm.Reason"
                              :label="slotProps.dataForm.Reason.label"
                              class="custom-label-group"
                              :invalid-feedback="
                                $t('form.please-invalid') +
                                slotProps.dataForm.Reason.label
                              "
                              :state="slotProps.dataForm.Reason.valid"
                            >
                              <b-form-input
                                v-model="slotProps.dataForm.Reason.value"
                                :disabled="isReadonly"
                                @input="checkValids"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.Note"
                              :label="slotProps.dataForm.Note.label"
                              class="custom-label-group"
                            >
                              <b-form-textarea
                                v-model="slotProps.dataForm.Note.value"
                                :class="slotProps.dataForm.Note.class"
                                :disabled="isReadonly"
                                style="height: 65px"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col xl="6" lg="3" md="3" />
                    </b-row>
                  </div>
                </template>
              </FormDetailSlot>
            </b-tab>
            <b-tab>
              <HistoryActions
                v-if="dataSalaryDriverByID && dataSalaryDriverByID.Histories"
                :items="dataSalaryDriverByID.Histories"
                :disablePagination="true"
              />
            </b-tab>
            <b-tab>
              <ListFile
                :items="listAttachFile"
                :disablePagination="true"
                @reLoadData="handleReLoadData"
                @returnEdit="handleEditImportFile"
              />
            </b-tab>
          </b-tabs>
        </div>
      </div>
      <div class="footer-tabs">
        <FooterTabs :activeFocus="currentTab" @changeTab="changeTab" />
      </div>
    </b-card>
    <b-modal
      :id="`modal-import-${keyComponent}`"
      title="ĐÍNH KÈM FILE"
      ok-title="Đồng ý"
      cancel-title="Hủy bỏ"
      size="md"
    >
      <div>
        <b-row>
          <b-col lg="12">
            <b-form-group :label="`Tiêu đề`" class="custom-label-group">
              <b-form-input v-model="formImportFile.Name" />
            </b-form-group>
          </b-col>
          <b-col lg="12">
            <b-form-group
              :label="$t('modal.file-attach')"
              class="custom-label-group"
            >
              <b-form-file
                v-model="formImportFile.File"
                :placeholder="$t('modal.please-choose-file') + '...'"
                :file-name-formatter="formatNames"
                :browse-text="$t('browse-text')"
                multiple
              />
            </b-form-group>
          </b-col>
          <b-col
            v-if="
              isShow &&
              formImportFile.OldLinks &&
              formImportFile.OldLinks.length > 0
            "
            lg="12"
          >
            <b-form-group :label="`File hiện tại`" class="custom-label-group">
              <template v-for="(link, i) in formImportFile.OldLinks">
                <b-row :key="i" class="bg-light" style="font-weight: 600">
                  <b-col lg="10">
                    <a :href="link" target="_blank" download>{{
                      formImportFile.Names[i]
                    }}</a>
                  </b-col>
                  <b-col lg="2" class="text-right">
                    <i
                      class="fas fa-trash-alt text-danger"
                      @click="removeFileImportFile(i)"
                    />
                  </b-col>
                </b-row>
              </template>
            </b-form-group>
          </b-col>
          <b-col lg="12">
            <b-form-group
              :label="$t('dashboards.note')"
              class="custom-label-group"
            >
              <b-form-textarea v-model="formImportFile.Note" />
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <template #modal-footer>
        <div class="w-100 text-right">
          <b-button variant="primary" @click="handleTypeImportFile">
            <span style="font-weight: 550"> Ok</span>
          </b-button>
        </div>
      </template>
    </b-modal>
    <b-modal
      :id="`modal-find-${keyComponent}`"
      title="TÌM, LỌC DỮ LIỆU"
      size="lg"
      @ok="search"
    >
      <b-overlay :show="!isShow" rounded="sm">
        <template v-for="(field, i) in fieldSalaryDriverFinal">
          <div
            :key="i"
            class="d-flex justify-content-between align-items-center mb-1"
          >
            <div style="width: 100%">
              <strong>{{ field.label }}</strong>
            </div>
            <div style="width: 100%" class="text-right">
              <span style="color: #145388">
                <b v-if="isShow">
                  {{
                    formFind.ListSearch.find((e) => e.Name == field.key)
                      .Operator
                      ? optionOperators.find(
                          (e) =>
                            e.Valu ==
                            formFind.ListSearch.find((e) => e.Name == field.key)
                              .Operator
                        ).Shw
                      : `Chọn điều kiện`
                  }}
                </b>
              </span>
              <b-dropdown
                class="title-dropdown ml-1 mr-4"
                variant="link"
                toggle-class="text-decoration-none"
              >
                <template v-if="field.typeCol.toUpperCase() == 'STRING'">
                  <template v-for="(operator, io) in optionOperators">
                    <b-dropdown-item
                      v-if="
                        operator.Valu == '=' ||
                        operator.Valu == 'like' ||
                        operator.Valu == 'not like'
                      "
                      :key="io"
                      @click="changeTypeSearch(field.key, operator.Valu)"
                    >
                      {{ operator.Shw == "" ? `Không chọn` : operator.Shw }}
                    </b-dropdown-item>
                  </template>
                </template>
                <template v-else-if="field.typeCol.toUpperCase() == 'BIT'">
                  <template v-for="(operator, io) in optionOperators">
                    <b-dropdown-item
                      v-if="operator.Valu == '='"
                      :key="io"
                      @click="changeTypeSearch(field.key, operator.Valu)"
                    >
                      {{ operator.Shw == "" ? `Không chọn` : operator.Shw }}
                    </b-dropdown-item>
                  </template>
                </template>
                <template
                  v-else-if="
                    field.typeCol.toUpperCase() == 'DATE' ||
                    field.typeCol.toUpperCase() == 'DATETIME'
                  "
                >
                  <template v-for="(operator, io) in optionOperators">
                    <b-dropdown-item
                      v-if="
                        operator.Valu == '=' ||
                        operator.Valu == 'between' ||
                        operator.Valu == '<' ||
                        operator.Valu == '<=' ||
                        operator.Valu == '>' ||
                        operator.Valu == '>='
                      "
                      :key="io"
                      @click="changeTypeSearch(field.key, operator.Valu)"
                    >
                      {{ operator.Shw == "" ? `Không chọn` : operator.Shw }}
                    </b-dropdown-item>
                  </template>
                </template>
                <template v-else>
                  <template v-for="(operator, io) in optionOperators">
                    <b-dropdown-item
                      :key="io"
                      @click="changeTypeSearch(field.key, operator.Valu)"
                    >
                      {{ operator.Shw == "" ? `Không chọn` : operator.Shw }}
                    </b-dropdown-item>
                  </template>
                </template>
              </b-dropdown>
            </div>
            <template
              v-if="
                isShow &&
                formFind.ListSearch.find((e) => e.Name == field.key).Operator ==
                  'between'
              "
            >
              <div class="d-flex" style="width: 150%">
                <div style="width: 50%" class="mr-2">
                  <div>Giá trị 1</div>
                  <b-form-datepicker
                    v-if="
                      field.typeCol.toUpperCase() == 'DATE' ||
                      field.typeCol.toUpperCase() == 'DATETIME'
                    "
                    v-model="
                      formFind.ListSearch.find((e) => e.Name == field.key)
                        .Param1
                    "
                    locale="vi"
                    placeholder="DD/MM/YYYY"
                    :date-format-options="{ month: 'numeric' }"
                  />
                  <b-form-input
                    v-else
                    v-model="
                      formFind.ListSearch.find((e) => e.Name == field.key)
                        .Param1
                    "
                  />
                </div>
                <div style="width: 50%">
                  <div>Giá trị 2</div>
                  <b-form-datepicker
                    v-if="
                      field.typeCol.toUpperCase() == 'DATE' ||
                      field.typeCol.toUpperCase() == 'DATETIME'
                    "
                    v-model="
                      formFind.ListSearch.find((e) => e.Name == field.key)
                        .Param2
                    "
                    locale="vi"
                    placeholder="DD/MM/YYYY"
                    :date-format-options="{ month: 'numeric' }"
                  />
                  <b-form-input
                    v-else
                    v-model="
                      formFind.ListSearch.find((e) => e.Name == field.key)
                        .Param2
                    "
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div style="width: 150%">
                <div>Giá trị 1</div>
                <b-form-datepicker
                  v-if="
                    field.typeCol.toUpperCase() == 'DATE' ||
                    field.typeCol.toUpperCase() == 'DATETIME'
                  "
                  v-model="
                    formFind.ListSearch.find((e) => e.Name == field.key).Param1
                  "
                  locale="vi"
                  placeholder="DD/MM/YYYY"
                  :date-format-options="{ month: 'numeric' }"
                />
                <VSelect
                  v-else-if="field.typeCol.toUpperCase() == 'BIT'"
                  :value="
                    optionBlockStatus.find(
                      (o) =>
                        o.id ==
                        formFind.ListSearch.find((e) => e.Name == field.key)
                          .Param1
                    )
                  "
                  :options="optionBlockStatus"
                  :reduce="(optionBlockStatus) => optionBlockStatus.id"
                  @input="
                    inputVSelectSearch(
                      formFind.ListSearch.find((e) => e.Name == field.key),
                      $event
                    )
                  "
                />
                <b-form-input
                  v-else
                  v-model="
                    formFind.ListSearch.find((e) => e.Name == field.key).Param1
                  "
                />
              </div>
            </template>
          </div>
        </template>
      </b-overlay>
      <template #modal-footer="{ ok }">
        <div class="w-100 text-right">
          <b-button
            variant="outline-danger"
            class="mr-1"
            @click="resetFormFind"
          >
            <span style="font-weight: 550"> Xoá điều kiện</span>
          </b-button>
          <b-button variant="primary" @click="ok()">
            <span style="font-weight: 550"> Tìm kiếm</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import handling from "@/constants/handling";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { onBeforeMount, reactive, ref } from "vue";
import FooterTabs from "./component/FooterTabs.vue";
import HeaderActions from "./component/HeaderActions.vue";
import ListItem from "./component/ListItem.vue";
import FormDetailSlot from "./component/FormDetailSlot.vue";
import HistoryActions from "./component/HistoryActions.vue";
import ListFile from "./component/ListFile.vue";
import useToasts from "../hooks/useToasts";
import useSalaryDriver from "../hooks/useDriverSalary";
import useDriverNPL from "../hooks/useDriverNPL";
import useAttachFiles from "../hooks/useAttachFiles";
import moment from "moment";

export default {
  components: {
    HeaderActions,
    ListItem,
    FormDetailSlot,
    HistoryActions,
    ListFile,
    FooterTabs,
    VSelect,
  },
  setup() {
    const keys = reactive({
      FactorID: "COSTDRIVER_INCREASESALARY",
      EntryID: "AJ_INCREASESALARY",
    });
    const isShow = ref(true);
    const isReadonly = ref(true);
    const isAdd = ref(false);
    const isEdit = ref(false);
    const currentTab = ref(0);
    const currentIndex = ref(0);
    const { showToast } = useToasts();
    const { listDriver, getListDriverActive } = useDriverNPL();
    const {
      isLoadingSalaryDriver,
      errorSalaryDriver,
      listSalaryDriver,
      fieldSalaryDriverFinal,
      selectedSalaryDriver,
      dataSalaryDriverByID,
      optionOperators,
      handleSearch,
      getListSalaryDriver,
      getSalaryDriverByID,
      handleFormAddSalaryDriver,
      addSalaryDriver,
      editSalaryDriver,
      changeStatusSalaryDriver,
      deleteSalaryDriver,
      copySalaryDriver,
    } = useSalaryDriver();
    //import-file
    const typeActionImport = ref(null);
    const { listAttachFile, getListAttachFile, addAttachFile, editAttachFile } =
      useAttachFiles();
    const formImportFile = reactive({
      FactorID: keys.FactorID,
      EntryID: keys.EntryID,
      Name: null,
      File: null,
      Note: null,
    });
    //

    onBeforeMount(async () => {
      await getListSalaryDriver();
      await getListDriverActive();
      setTimeout(() => {
        currentIndex.value = listSalaryDriver.value.length - 1;
      }, 500);
    });

    const handleClick = async (item) => {
      let bodyAtt = {
        OID: item.OID,
        FactorID: keys.FactorID,
        EntryID: keys.EntryID,
      };
      let body = {
        OID: item.OID,
      };
      await getSalaryDriverByID(body);
      currentIndex.value = listSalaryDriver.value.findIndex(
        (e) => e.OID == item.OID
      );
      //import-file
      await getListAttachFile(bodyAtt);
    };

    const handleDbClick = async (item) => {
      let body = {
        OID: item.OID,
      };
      await getSalaryDriverByID(body);
      currentTab.value = 1;
      currentIndex.value = listSalaryDriver.value.findIndex(
        (e) => e.OID == item.OID
      );
    };

    const handleFirstIndex = async () => {
      if (!listSalaryDriver.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      let currentItem = listSalaryDriver.value[0];
      let body = {
        OID: currentItem.OID,
      };
      await getSalaryDriverByID(body);
      currentIndex.value = 0;
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedSalaryDriver.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handlePreIndex = async () => {
      if (!listSalaryDriver.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      if (currentIndex.value == 0) {
        currentIndex.value = 0;
      } else {
        currentIndex.value -= 1;
      }
      let currentItem = listSalaryDriver.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getSalaryDriverByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedSalaryDriver.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handleNextIndex = async () => {
      if (!listSalaryDriver.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      if (currentIndex.value == listSalaryDriver.value.length - 1) {
        currentIndex.value = listSalaryDriver.value.length - 1;
      } else {
        currentIndex.value += 1;
      }
      let currentItem = listSalaryDriver.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getSalaryDriverByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedSalaryDriver.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handleLastIndex = async () => {
      if (!listSalaryDriver.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      currentIndex.value = listSalaryDriver.value.length - 1;
      let currentItem = listSalaryDriver.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getSalaryDriverByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedSalaryDriver.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handleChangeVSelectByKey = (key, newValue) => {
      isShow.value = false;
      selectedSalaryDriver.value[key].value = newValue;
      checkValids();
      isShow.value = true;
    };

    const checkValids = () => {
      if (!selectedSalaryDriver.value) return;
      isShow.value = false;
      let result = true;
      const arr = selectedSalaryDriver.value;
      for (const key in arr) {
        if (
          key == "EntryID" ||
          key == "FactorID" ||
          key == "OID" ||
          arr[key].type.toUpperCase() == "NOTE" ||
          arr[key].type.toUpperCase() == "BIT"
        ) {
          //không check valids
        } else if (!arr[key].value) {
          arr[key].valid = false;
          result = false;
        } else {
          arr[key].valid = true;
        }
      }
      isShow.value = true;
      return result;
    };

    return {
      userIsITSupport: JSON.parse(localStorage.getItem("user")).IsITSupport,
      isShow,
      keys,
      keyComponent: "SalaryDriver",
      isReadonly,
      isAdd,
      isEdit,
      currentTab,
      currentIndex,
      listDriver,
      listSalaryDriver,
      fieldSalaryDriverFinal,
      dataSalaryDriverByID,
      selectedSalaryDriver,
      isLoadingSalaryDriver,
      errorSalaryDriver,
      optionOperators,
      handleClick,
      handleDbClick,
      handleFirstIndex,
      handlePreIndex,
      handleNextIndex,
      handleLastIndex,
      handleSearch,
      getListSalaryDriver,
      getSalaryDriverByID,
      handleFormAddSalaryDriver,
      getListDriverActive,
      handleChangeVSelectByKey,
      addSalaryDriver,
      editSalaryDriver,
      deleteSalaryDriver,
      changeStatusSalaryDriver,
      copySalaryDriver,
      checkValids,
      optionBlockStatus: [
        { id: 1, label: "Đã khóa", value: 1, text: "Đã khóa" },
        { id: 0, label: "Chưa khóa", value: 0, text: "Chưa khóa" },
      ],
      optionDate: [
        handling.getMonthSubtractNPL(1),
        handling.getMonthSubtractNPL(2),
        handling.getMonthSubtractNPL(3),
        handling.getMonthSubtractNPL(4),
        handling.getMonthSubtractNPL(5),
        handling.getMonthSubtractNPL(6),
      ],
      currentTitle: "AJ_INCREASESALARY",
      //import-file
      formImportFile,
      listAttachFile,
      getListAttachFile,
      addAttachFile,
      editAttachFile,
      typeActionImport,
    };
  },
  computed: {
    formFind() {
      const arr = this.fieldSalaryDriverFinal;
      const result = {
        FactorID: "COSTDRIVER_INCREASESALARY",
        EntryID: "AJ_INCREASESALARY",
        ListSearch: [],
      };
      for (const o of arr) {
        let obj = {
          Name: o.key,
          Operator:
            o.typeCol == "Date" || o.typeCol == "Datetime" || o.typeCol == "Bit"
              ? "="
              : "like",
          Param1: null,
          Param2: null,
        };
        result.ListSearch.push(obj);
      }
      return result;
    },
  },
  methods: {
    //emit-title
    returnTitle(value) {
      this.currentTitle = value;
    },
    //end
    convertFloat(value) {
      return handling.convertFloat(value);
    },
    handleUpdateByKey(key, newValue) {
      this.isShow = false;
      let intValue = handling.revertFloat(newValue);
      this.selectedSalaryDriver[key].value = intValue;
      this.checkValids();
      this.isShow = true;
    },
    //handle-datetime
    formatTime(datetime) {
      return moment(datetime).format("HH:mm");
    },
    handleFormatDateTime(key, curValue, date) {
      const time = curValue.split("T")[1];
      this.selectedSalaryDriver[key].value = date + "T" + time;
    },
    handleTimeToDate(key, curValue, time) {
      this.selectedSalaryDriver[key].value =
        curValue.split("T")[0] + "T" + time;
    },
    //change-tab
    changeTab(result) {
      if (this.isReadonly == false) {
        this.$notify("error", "THẤT BẠI", "Bạn đang tương tác dữ liệu !");
        return;
      }
      if (!this.selectedSalaryDriver) {
        this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !");
        return;
      }
      this.currentTab = result;
    },
    //handle-actions
    async handleChangeActions(action, obj) {
      switch (action) {
        case "ADD":
          if (this.isAdd) return;
          await this.createFormAdd();
          this.isAdd = true;
          this.isEdit = false;
          this.isReadonly = false;
          this.currentTab = 1;
          break;
        case "EDIT":
          if (this.selectedSalaryDriver) {
            this.isEdit = true;
            this.isAdd = false;
            this.isReadonly = false;
            this.currentTab = 1;
          } else {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !");
          }
          break;
        case "DELETE":
          if (!this.selectedSalaryDriver) {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !", {
              duration: 3000,
              permanent: false,
            });
          } else {
            this.currentTab = 1;
            this.showConfirmDelete(this.selectedSalaryDriver.OID.value);
          }
          break;
        case "COPY":
          if (!this.selectedSalaryDriver) {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !");
          } else if (this.isReadonly == false) {
            this.$notify("error", "THẤT BẠI", "Bạn đang tương tác dữ liệu !");
          } else {
            this.currentTab = 1;
            this.showConfirmCopy(this.selectedSalaryDriver.OID.value);
          }
          break;
        case "SAVE":
          if (this.checkValids()) {
            if (this.isAdd) {
              this.submitAdd();
            } else if (this.isEdit) {
              this.submitEdit();
            }
          }
          break;
        case "CANCEL":
          if (this.isAdd) {
            this.selectedSalaryDriver = null;
            this.currentTab = 0;
          }
          if (this.isEdit) {
            let body = {
              OID: this.selectedSalaryDriver.OID.value,
            };
            this.getSalaryDriverByID(body);
          }
          this.isAdd = false;
          this.isEdit = false;
          this.isReadonly = true;
          break;
        case "BLOCK":
          if (!obj) return;
          if (obj.IsActive.value == 0) {
            this.showConfirmBlock(obj);
          } else if (this.IsITSupport == 1) {
            console.log(1, "IsITSupport đang phát triễn !");
          } else {
            this.$notify("error", "THẤT BẠI", "Dữ liệu này đã được khóa !");
          }
          break;
        case "IMPORT":
          if (!this.selectedSalaryDriver) {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !");
            return;
          }
          this.typeActionImport = "ADD";
          this.resetFormImportFile();
          this.$bvModal.show(`modal-import-${this.keyComponent}`);
          break;
        case "FIND":
          if (!this.isReadonly) {
            this.$notify("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
            return;
          }
          this.isShow = false;
          setTimeout(() => {
            this.$bvModal.show(`modal-find-${this.keyComponent}`);
            this.isShow = true;
          }, 500);
          break;
      }
    },
    //handle-copy
    showConfirmCopy(id) {
      this.$bvModal
        .msgBoxConfirm(`Bạn muốn sao chép ` + id + " ?", {
          title: this.$t("form.warning").toUpperCase(),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("form.yes"),
          cancelTitle: this.$t("form.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value === true) {
            let body = {
              OID: id,
            };
            let result = await this.copySalaryDriver(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", result.message);
              let body = {
                OID: result.data[0].OID,
              };
              this.getListSalaryDriver();
              this.getSalaryDriverByID(body);
            } else {
              this.$notify("error", "THẤT BẠI", result.message);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //handle-add
    async createFormAdd() {
      await this.handleFormAddSalaryDriver();
      this.selectedSalaryDriver.ODate.value = moment(new Date()).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    },
    async submitAdd() {
      const body = {};
      const arr = this.selectedSalaryDriver;
      for (const key in arr) {
        let value = arr[key].value;
        Object.assign(body, { [key]: value });
      }
      body.EntryID = this.currentTitle;
      let result = await this.addSalaryDriver(body);
      if (result.status) {
        this.$notify("success", "THÀNH CÔNG", result.message);
        let body = {
          OID: result.data[0].OID,
        };
        this.getListSalaryDriver();
        this.getSalaryDriverByID(body);
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
      }
    },
    //handle-edit
    async submitEdit() {
      const body = {
        EntryID: this.dataSalaryDriverByID.EntryID,
      };
      const arr = this.selectedSalaryDriver;
      for (const key in arr) {
        let value = arr[key].value;
        Object.assign(body, { [key]: value });
      }
      let result = await this.editSalaryDriver(body);
      if (result.status) {
        this.$notify("success", "THÀNH CÔNG", result.message);
        let body = {
          OID: result.data[0].OID,
        };
        this.getListSalaryDriver();
        this.getSalaryDriverByID(body);
        this.isReadonly = true;
        this.isAdd = false;
        this.isEdit = false;
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
      }
    },
    //handle-block
    showConfirmBlock(obj) {
      this.$bvModal
        .msgBoxConfirm(`Bạn muốn khóa ` + obj.OID.value + "?", {
          title: this.$t("form.warning").toUpperCase(),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("form.yes"),
          cancelTitle: this.$t("form.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value === true) {
            let body = {
              OID: obj.OID.value,
              IsActive: 1,
            };
            let result = await this.changeStatusSalaryDriver(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", "Xử lí thành công !");
              const id = result.data[0].OID;
              let body = {
                OID: id,
              };
              this.getSalaryDriverByID(body);
              this.getListSalaryDriver();
            } else {
              this.$notify("error", "THẤT BẠI", "Xử lí thất bại !");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //handle-delete
    showConfirmDelete(id) {
      this.$bvModal
        .msgBoxConfirm(this.$t("form.question") + id + "?", {
          title: this.$t("form.warning").toUpperCase(),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("form.yes"),
          cancelTitle: this.$t("form.no"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value === true) {
            let body = {
              OID: id,
            };
            let result = await this.deleteSalaryDriver(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", "Xử lí thành công !");
              this.currentTab = 0;
              this.currentIndex = 0;
              const newSelected = this.listSalaryDriver[this.currentIndex];
              let body = {
                OID: newSelected.OID,
              };
              this.getSalaryDriverByID(body);
              this.getListSalaryDriver();
            } else {
              this.$notify("error", "THẤT BẠI", "Xử lí thất bại !");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //handle-search
    inputVSelectSearch(objKey, value) {
      this.isShow = false;
      objKey.Param1 = value;
      this.isShow = true;
    },
    changeTypeSearch(field, type) {
      this.isShow = false;
      this.formFind.ListSearch.find((e) => e.Name == field).Operator = type;
      this.isShow = true;
    },
    async search() {
      const newListSearch = [];
      this.formFind.ListSearch.map((e) => {
        if (e.Param1 != null) {
          e.Param1 = e.Param1.toString();
          e.Param2 = e.Param2 ? e.Param2 : "";
          newListSearch.push(e);
        }
      });
      let body = {
        FactorID: "COSTDRIVER_INCREASESALARY",
        EntryID: "AJ_INCREASESALARY",
        ListSearch: newListSearch,
      };
      let result = await this.handleSearch(body);
      if (result.status) {
        this.listSalaryDriver = result.data;
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedSalaryDriver = null;
      } else {
        this.getListSalaryDriver();
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedSalaryDriver = null;
      }
    },
    resetFormFind() {
      if (!this.fieldSalaryDriverFinal?.length > 0) return;
      this.isShow = false;
      const arr = this.fieldSalaryDriverFinal;
      this.formFind.ListSearch.forEach((e) => {
        const o = arr.find((f) => f.key == e.Name);
        e.Operator =
          o.typeCol == "Date" || o.typeCol == "Datetime" || o.typeCol == "Bit"
            ? "="
            : "like";
        e.Param1 = null;
        e.Param2 = null;
      });
      this.isShow = true;
    },
    handleListDataByFilter(result) {
      if (result.status) {
        this.listSalaryDriver = result.data;
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedSalaryDriver = null;
      } else {
        this.getListSalaryDriver();
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedSalaryDriver = null;
      }
    },
    //end-search
    //import-file
    formatNames(files) {
      return files.length === 1 ? files[0].name : `${files.length} Tập tin`;
    },
    async submitAddImportFile() {
      const body = {
        ...this.formImportFile,
        OID: this.selectedSalaryDriver.OID.value,
      };
      let formData = new FormData();
      for (const key in body) {
        if (body[key] && body[key].length > 0 && key == "File") {
          for (let i = 0; i < body[key].length; i++) {
            formData.append("File", body[key][i]);
          }
        } else {
          formData.append(key, body[key]);
        }
      }
      let result = await this.addAttachFile(formData);
      if (result.status) {
        let bodyAtt = {
          OID: this.selectedSalaryDriver.OID.value,
          FactorID: this.keys.FactorID,
          EntryID: this.keys.EntryID,
        };
        this.getListAttachFile(bodyAtt);
        this.currentTab = 3;
        this.$notify("success", "THÀNH CÔNG", result.message);
        this.$bvModal.hide(`modal-import-${this.keyComponent}`);
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
      }
    },
    handleReLoadData() {
      let bodyAtt = {
        OID: this.selectedSalaryDriver.OID.value,
        FactorID: this.keys.FactorID,
        EntryID: this.keys.EntryID,
      };
      this.getListAttachFile(bodyAtt);
    },
    handleEditImportFile(item) {
      this.isShow = false;
      this.formImportFile.ID = item.ID;
      this.formImportFile.OID = this.selectedSalaryDriver.OID.value;
      this.formImportFile.Name = item.Name;
      this.formImportFile.FactorID = this.keys.FactorID;
      this.formImportFile.EntryID = this.keys.EntryID;
      this.formImportFile.File = null;
      this.formImportFile.OldLinks = item.OldLinks;
      this.formImportFile.Note = item.Note;
      this.formImportFile.Names = item.Names;
      this.typeActionImport = "EDIT";
      this.$bvModal.show(`modal-import-${this.keyComponent}`);
      this.isShow = true;
    },
    async submitEditImportFile() {
      const body = {
        FactorID: this.formImportFile.FactorID,
        EntryID: this.formImportFile.EntryID,
        OID: this.formImportFile.OID,
        ID: this.formImportFile.ID,
        Name: this.formImportFile.Name,
        Note: this.formImportFile.Note,
        File: this.formImportFile.File,
        OldLinks: this.formImportFile.OldLinks.join(","),
      };
      let formData = new FormData();
      for (const key in body) {
        if (body[key] && body[key].length > 0 && key == "File") {
          for (let i = 0; i < body[key].length; i++) {
            formData.append("File", body[key][i]);
          }
        } else {
          formData.append(key, body[key]);
        }
      }
      let result = await this.editAttachFile(formData);
      if (result.status) {
        let bodyAtt = {
          OID: this.selectedSalaryDriver.OID.value,
          FactorID: this.keys.FactorID,
          EntryID: this.keys.EntryID,
        };
        this.getListAttachFile(bodyAtt);
        this.currentTab = 3;
        this.$notify("success", "THÀNH CÔNG", result.message);
        this.$bvModal.hide(`modal-import-${this.keyComponent}`);
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
      }
    },
    removeFileImportFile(index) {
      this.isShow = false;
      this.formImportFile.OldLinks = this.formImportFile.OldLinks.filter(
        (link, i) => i != index
      );
      this.formImportFile.Names = this.formImportFile.Names.filter(
        (name, i) => i != index
      );
      this.isShow = true;
    },
    resetFormImportFile() {
      this.isShow = false;
      this.formImportFile = {
        FactorID: this.keys.FactorID,
        EntryID: this.keys.EntryID,
        Name: null,
        File: null,
        Note: "",
      };
      this.isShow = true;
    },
    handleTypeImportFile() {
      if (this.typeActionImport == "ADD") {
        if (!this.formImportFile.Name) {
          this.$notify("error", "THẤT BẠI", "Chưa nhập tiêu đề");
          return;
        }
        this.submitAddImportFile();
      } else {
        if (!this.formImportFile.Name) {
          this.$notify("error", "THẤT BẠI", "Chưa nhập tiêu đề");
          return;
        }
        this.submitEditImportFile();
      }
    },
    //end
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/sass/_mixins.scss";

$desktop: 1280px; // xl
$laptop: 1024px; // lg
$tablet: 768px; // md
$mobile: 600px; // sm

$height_content: 225px;
$height_footer-tabs: "auto";

.actions {
  height: auto;
}

.content {
  height: calc(100vh - #{$height_content});
  overflow: auto;
  margin-bottom: 5px;
  overflow-x: hidden;
}

.footer-tabs {
  height: $height_footer-tabs;
}

.box-step {
  height: 100px;
  overflow: auto;
}
</style>

<style>
.custom-label-group .col-form-label {
  padding-bottom: 0;
  white-space: nowrap;
}
.title-dropdown button {
  font-size: 20px;
  padding: 0;
}
.custom-label-group .btn {
  padding: 5px;
  padding-left: 8px;
  padding-top: 2px;
}
.custom-label-group .form-control {
  white-space: nowrap !important;
  text-overflow: ellipsis;
}
.custom-label-group .v-select .vs__dropdown-toggle .vs__selected-options {
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
