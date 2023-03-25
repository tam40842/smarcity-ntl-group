<template>
  <div class="main">
    <b-card no-body>
      <div class="content">
        <div class="content-tabs">
          <div class="list">
            <b-overlay :show="isLoadingTransportRequest" rounded="sm">
              <div
                v-if="errorTransportRequest"
                class="error text-center m-4 text-muted"
              >
                <strong>{{ errorTransportRequest }}</strong>
              </div>
              <ListItem
                v-else
                :fields="fieldTransportRequestFinal"
                :items="listTransportRequestActive"
                :disablePagination="true"
                @returnClick="handleClick"
                @returnDbClick="handleDbClick"
              />
            </b-overlay>
          </div>
          <b-modal
            :id="`modal-detail-${keyComponent}`"
            modal-class="custom-box-modal"
            centered
            hide-header
            @ok="confirmApproval"
          >
            <FormDetailSlot :item="selectedTransportRequest">
              <template #customForm="slotProps">
                <div
                  v-if="isShow && slotProps.dataForm"
                  class="content-form p-2"
                >
                  <b-row>
                    <b-col lg="4">
                      <div class="pl-2 pr-1">
                        <b-row>
                          <b-col lg="4">
                            <b-form-group
                              :label="slotProps.dataForm.OID.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                :value="slotProps.dataForm.OID.value"
                                disabled
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="4">
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
                      </div>
                      <div class="bg-light p-2 mb-2">
                        <div class="text-info">
                          <strong>THÔNG TIN KHÁCH HÀNG</strong>
                        </div>
                        <b-row>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.CustomerName"
                              :label="slotProps.dataForm.CustomerName.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="slotProps.dataForm.CustomerName.value"
                                list="list-customer"
                                :disabled="isReadonly"
                                @change="
                                  handleChangeInputByKey('CustomerName', $event)
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="4">
                            <b-form-group
                              v-if="slotProps.dataForm.CustomerContactsName"
                              :label="
                                slotProps.dataForm.CustomerContactsName.label
                              "
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="
                                  slotProps.dataForm.CustomerContactsName.value
                                "
                                :class="
                                  slotProps.dataForm.CustomerContactsName.class
                                "
                                :disabled="isReadonly"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="4">
                            <b-form-group
                              v-if="slotProps.dataForm.Phone"
                              :label="slotProps.dataForm.Phone.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="slotProps.dataForm.Phone.value"
                                :class="slotProps.dataForm.Phone.class"
                                :disabled="isReadonly"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="4">
                            <b-form-group
                              v-if="slotProps.dataForm.Email"
                              :label="slotProps.dataForm.Email.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="slotProps.dataForm.Email.value"
                                :class="slotProps.dataForm.Email.class"
                                :disabled="isReadonly"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </div>
                      <div class="bg-light p-2 mb-2">
                        <div class="text-info">
                          <strong>THÔNG TIN HÀNG HÓA</strong>
                        </div>
                        <b-row>
                          <b-col lg="6">
                            <b-form-group
                              v-if="slotProps.dataForm.OrderTypeID"
                              :label="slotProps.dataForm.OrderTypeID.label"
                              class="custom-label-group"
                            >
                              <VSelect
                                :value="
                                  listOrderTypeNotAll.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.OrderTypeID.value
                                  )
                                "
                                :class="slotProps.dataForm.OrderTypeID.class"
                                :options="listOrderTypeNotAll"
                                :reduce="
                                  (listOrderTypeNotAll) =>
                                    listOrderTypeNotAll.id
                                "
                                label="label"
                                :disabled="isReadonly"
                                @input="
                                  handleChangeVSelectByKey(
                                    'OrderTypeID',
                                    $event
                                  )
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="6">
                            <b-form-group
                              v-if="slotProps.dataForm.GoodsTypeID"
                              :label="slotProps.dataForm.GoodsTypeID.label"
                              class="custom-label-group"
                            >
                              <VSelect
                                :value="
                                  listItem.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.GoodsTypeID.value
                                  )
                                "
                                :class="slotProps.dataForm.GoodsTypeID.class"
                                :options="listItem"
                                :reduce="(listItem) => listItem.id"
                                label="label"
                                :disabled="isReadonly"
                                @input="
                                  handleChangeVSelectByKey(
                                    'GoodsTypeID',
                                    $event
                                  )
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="4">
                            <b-form-group
                              v-if="slotProps.dataForm.nPLUnitsID"
                              :label="slotProps.dataForm.nPLUnitsID.label"
                              class="custom-label-group"
                            >
                              <VSelect
                                :value="
                                  listItemUnit.find(
                                    (e) =>
                                      e.id ==
                                      slotProps.dataForm.nPLUnitsID.value
                                  )
                                "
                                :class="slotProps.dataForm.nPLUnitsID.class"
                                :options="listItemUnit"
                                :reduce="(listItemUnit) => listItemUnit.id"
                                label="label"
                                :disabled="isReadonly"
                                @input="
                                  handleChangeVSelectByKey('nPLUnitsID', $event)
                                "
                              />
                            </b-form-group>
                          </b-col>
                          <template v-if="typeOrder == 8">
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Cont20Quantity"
                                :label="slotProps.dataForm.Cont20Quantity.label"
                                class="custom-label-group"
                              >
                                <b-form-input
                                  v-model.number="
                                    slotProps.dataForm.Cont20Quantity.value
                                  "
                                  type="number"
                                  :class="
                                    slotProps.dataForm.Cont20Quantity.class
                                  "
                                  :disabled="isReadonly"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Cont40Quantity"
                                :label="slotProps.dataForm.Cont40Quantity.label"
                                class="custom-label-group"
                              >
                                <b-form-input
                                  v-model.number="
                                    slotProps.dataForm.Cont40Quantity.value
                                  "
                                  type="number"
                                  :class="
                                    slotProps.dataForm.Cont40Quantity.class
                                  "
                                  :disabled="isReadonly"
                                />
                              </b-form-group>
                            </b-col>
                          </template>
                          <template v-else-if="typeOrder == 7">
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Quantity"
                                :label="slotProps.dataForm.Quantity.label"
                                class="custom-label-group"
                              >
                                <b-form-input
                                  v-model.number="
                                    slotProps.dataForm.Quantity.value
                                  "
                                  type="number"
                                  :class="slotProps.dataForm.Quantity.class"
                                  :disabled="isReadonly"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Weight"
                                :label="slotProps.dataForm.Weight.label"
                                class="custom-label-group"
                              >
                                <b-form-input
                                  v-model.number="
                                    slotProps.dataForm.Weight.value
                                  "
                                  type="number"
                                  :class="slotProps.dataForm.Weight.class"
                                  :disabled="isReadonly"
                                />
                              </b-form-group>
                            </b-col>
                          </template>
                        </b-row>
                      </div>
                    </b-col>
                    <b-col lg="4">
                      <div class="bg-light p-2 mb-2" style="height: 435px">
                        <div class="text-info">
                          <strong>THÔNG TIN LẤY HÀNG</strong>
                        </div>
                        <b-row>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.BeginAddressInfo"
                              :label="slotProps.dataForm.BeginAddressInfo.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="
                                  slotProps.dataForm.BeginAddressInfo.value
                                "
                                :class="
                                  slotProps.dataForm.BeginAddressInfo.class
                                "
                                :disabled="isReadonly"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.RequestTimeTake"
                              :label="slotProps.dataForm.RequestTimeTake.label"
                              class="custom-label-group"
                            >
                              <div class="d-flex">
                                <b-form-datepicker
                                  :value="
                                    slotProps.dataForm.RequestTimeTake.value
                                  "
                                  :disabled="isReadonly"
                                  placeholder="DD/MM/YYYY"
                                  locale="vi"
                                  style="width: 70%"
                                  class="mr-2"
                                  @input="
                                    handleFormatDateTime(
                                      'RequestTimeTake',
                                      slotProps.dataForm.RequestTimeTake.value,
                                      $event
                                    )
                                  "
                                />
                                <b-form-timepicker
                                  :value="
                                    formatTime(
                                      slotProps.dataForm.RequestTimeTake.value
                                    )
                                  "
                                  :disabled="isReadonly"
                                  placeholder="HH:mm"
                                  locale="vi"
                                  style="width: 30%"
                                  @input="
                                    handleTimeToDate(
                                      'RequestTimeTake',
                                      slotProps.dataForm.RequestTimeTake.value,
                                      $event
                                    )
                                  "
                                />
                              </div>
                            </b-form-group>
                          </b-col>
                        </b-row>
                        <div class="text-info">
                          <strong>THÔNG TIN GIAO HÀNG</strong>
                        </div>
                        <b-row>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.EndAddressInfo"
                              :label="slotProps.dataForm.EndAddressInfo.label"
                              class="custom-label-group"
                            >
                              <b-form-input
                                v-model="
                                  slotProps.dataForm.EndAddressInfo.value
                                "
                                :class="slotProps.dataForm.EndAddressInfo.class"
                                :disabled="isReadonly"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col lg="12">
                            <b-form-group
                              v-if="slotProps.dataForm.RequestTimeBack"
                              :label="slotProps.dataForm.RequestTimeBack.label"
                              class="custom-label-group"
                            >
                              <div class="d-flex">
                                <b-form-datepicker
                                  :value="
                                    slotProps.dataForm.RequestTimeBack.value
                                  "
                                  :disabled="isReadonly"
                                  locale="vi"
                                  placeholder="DD/MM/YYYY"
                                  style="width: 70%"
                                  class="mr-2"
                                  @input="
                                    handleFormatDateTime(
                                      'RequestTimeBack',
                                      slotProps.dataForm.RequestTimeBack.value,
                                      $event
                                    )
                                  "
                                />
                                <b-form-timepicker
                                  :value="
                                    formatTime(
                                      slotProps.dataForm.RequestTimeBack.value
                                    )
                                  "
                                  :disabled="isReadonly"
                                  locale="vi"
                                  placeholder="HH:mm"
                                  style="width: 30%"
                                  @input="
                                    handleTimeToDate(
                                      'RequestTimeBack',
                                      slotProps.dataForm.RequestTimeBack.value,
                                      $event
                                    )
                                  "
                                />
                              </div>
                            </b-form-group>
                          </b-col>
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
                      </div>
                    </b-col>
                    <b-col lg="4">
                      <div
                        class="bg-light pt-2 pl-2 pr-2"
                        style="height: 435px"
                      >
                        <div class="text-info">
                          <strong>THÔNG TIN XỬ LÝ</strong>
                        </div>
                        <template v-if="dataTransportRequestByID">
                          <div class="status-step pl-1 mb-1">
                            <strong>
                              <span class="text-muted">TRẠNG THÁI</span> :
                              <span
                                v-if="dataTransportRequestByID.Status"
                                :style="
                                  dataTransportRequestByID &&
                                  dataTransportRequestByID.StatusColor
                                    ? `color: ${dataTransportRequestByID.StatusColor}`
                                    : null
                                "
                              >
                                {{
                                  dataTransportRequestByID.Status.toUpperCase()
                                }}
                              </span>
                            </strong>
                          </div>
                          <div class="box-step mb-3">
                            <StepProcess :stepList="stepItems" />
                          </div>
                          <div
                            v-if="dataTransportRequestByID.CancelReason"
                            class="note-step mb-2 pl-1"
                          >
                            <b-form-group
                              :label="'Lí do'"
                              class="has-float-label mb-4"
                            >
                              <b-form-input
                                v-model="dataTransportRequestByID.CancelReason"
                                :disabled="true"
                              />
                            </b-form-group>
                          </div>
                        </template>
                        <template v-else>
                          <div style="font-weight: 600" class="text-muted">
                            Chưa cập nhật dữ liệu..
                          </div>
                        </template>
                        <div class="text-info pl-1">
                          <strong>XÉT DUYỆT YÊU CẦU</strong>
                        </div>
                        <div class="box-approval pl-1">
                          <b-form-radio-group
                            v-model="radioApproval"
                            :disabled="dataTransportRequestByID.IDStatus > 1"
                            class="mb-2"
                            :options="optionApproval"
                            value-field="value"
                            text-field="label"
                            @input="handleInputRadioApproval"
                          />
                          <VSelect
                            v-if="
                              radioApproval == 0 &&
                              dataTransportRequestByID.IDStatus <= 1
                            "
                            :value="
                              listReasonCoordinator.find((e) => e.id == valueApproval)
                            "
                            :options="listReasonCoordinator"
                            :reduce="(listReasonCoordinator) => listReasonCoordinator.id"
                            label="label"
                            class="mb-3"
                            @input="handleChangeVSelectApproval"
                          />
                          <b-form-group
                            :disabled="
                              valueApproval != 526 ||
                              radioApproval == 1 ||
                              dataTransportRequestByID.IDStatus > 1
                            "
                            :label="`Diễn giải thêm`"
                            class="has-float-label mb-4"
                          >
                            <b-form-textarea
                              v-model="dataTransportRequestByID.StatusNote"
                              style="height: 65px"
                            />
                          </b-form-group>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </template>
            </FormDetailSlot>
            <template #modal-footer="{ cancel, ok }">
              <div class="w-100 text-right">
                <b-button class="mr-1" @click="cancel">
                  <span style="font-weight: 550">Hủy</span>
                </b-button>
                <b-button v-if="dataTransportRequestByID.IDStatus<=1" variant="primary" @click="ok()">
                  <span style="font-weight: 550"> Xác nhận</span>
                </b-button>
              </div>
            </template>
          </b-modal>
        </div>
      </div>
    </b-card>
    <b-modal
      :id="`modal-find-${keyComponent}`"
      title="TÌM, LỌC DỮ LIỆU"
      size="lg"
      @ok="search"
    >
      <b-overlay :show="!isShow" rounded="sm">
        <template v-for="(field, i) in fieldTransportRequestFinal">
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
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { computed, onBeforeMount, ref, watch } from "vue";
import ListItem from "./component/ListItem.vue";
import FormDetailSlot from "./component/FormDetailSlot.vue";
import useTransportRequest from "../hooks/useTransportRequest";
import useCategorysNPL from "../hooks/useCategorysNPL";
import useReasonNPL from "../hooks/useReasonNPL";
import moment from "moment";
import StepProcess from "./component/StepProcess.vue";

export default {
  components: {
    ListItem,
    FormDetailSlot,
    VSelect,
    StepProcess,
  },
  setup() {
    const radioApproval = ref(1);
    const typeOrder = ref(null);
    const isShow = ref(true);
    const isReadonly = ref(true);
    const { listReasonCoordinator, getListReasonCoordinator } = useReasonNPL();
    const {
      listItemUnit,
      listOrderType,
      listItem,
      getListItemUnits,
      getListOrderType,
      getListItem,
    } = useCategorysNPL();
    const {
      optionOperators,
      fieldTransportRequestFinal,
      listTransportRequestActive,
      dataTransportRequestByID,
      selectedTransportRequest,
      errorTransportRequest,
      isLoadingTransportRequest,
      getTransportRequestActive,
      getTransportRequestByID,
      handleSearch,
      approvalTransportRequest,
    } = useTransportRequest();

    onBeforeMount(async () => {
      await getTransportRequestActive();
      await getListOrderType();
      await getListItem();
      await getListItemUnits();
      await getListReasonCoordinator();
    });

    watch(selectedTransportRequest, (value) => {
      if (value && value.OrderTypeID) {
        typeOrder.value = value.OrderTypeID.value;
      }
       this.radioApproval = this.dataTransportRequestByID.CancelReason ? 0 : 1;
    });

    const stepItems = computed({
      get: () => {
        if (dataTransportRequestByID.value) {
          let stepOne = {
            label: "Yêu cầu kiểm tra",
            name: dataTransportRequestByID.value.UserRequest,
            datetime: dataTransportRequestByID.value.DateRequest,
          };
          let stepTwo = {
            label: "Kết quả phản hồi",
            name: dataTransportRequestByID.value.UserApproval,
            datetime: dataTransportRequestByID.value.DateApproval,
          };
          return [stepOne, stepTwo];
        } else {
          return [];
        }
      },
    });

    const handleClick = async (item) => {
      let body = {
        OID: item.OID,
      };
      await getTransportRequestByID(body);
    };

    const changeTypeOrder = (newValue) => {
      typeOrder.value = newValue;
    };

    const handleChangeVSelectByKey = (key, newValue) => {
      selectedTransportRequest.value[key].value = newValue;
      if (key.toUpperCase() == "ORDERTYPEID") {
        changeTypeOrder(newValue);
      }
    };

    return {
      userIsITSupport: JSON.parse(localStorage.getItem("user")).IsITSupport,
      isShow,
      keyComponent: "ApprovalReqquest",
      isReadonly,
      typeOrder,
      listOrderType,
      listItemUnit,
      listItem,
      listTransportRequestActive,
      listReasonCoordinator,
      fieldTransportRequestFinal,
      stepItems,
      dataTransportRequestByID,
      selectedTransportRequest,
      isLoadingTransportRequest,
      errorTransportRequest,
      optionOperators,
      handleClick,
      getTransportRequestActive,
      getTransportRequestByID,
      approvalTransportRequest,
      handleChangeVSelectByKey,
      handleSearch,
      optionBlockStatus: [
        { id: 1, label: "Đã khóa" },
        { id: 0, label: "Chưa khóa" },
      ],
      radioApproval,
      valueApproval: 0,
      optionApproval: [
        { value: 1, label: "Đồng ý" },
        { value: 0, label: "Từ chối" },
      ],
    };
  },
  computed: {
    listOrderTypeNotAll() {
      const results = [];
      this.listOrderType.forEach((e) => {
        if (e.id != "%") {
          results.push(e);
        }
      });
      return results;
    },
    formFind() {
      const arr = this.fieldTransportRequestFinal;
      const result = {
        FactorID: "SALE_SHIPREQUETS",
        EntryID: "RC_SHIPREQUETS",
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
    handleInputRadioApproval(value) {
      if (value == 1) {
        this.valueApproval = 0;
      }
    },
    confirmApproval() {
      if (this.dataTransportRequestByID.IDStatus > 1) {
        this.$notify("warning", "CẢNHBÁO", "Bạn đã xét duyệt đơn này !");
        return;
      }
      this.$bvModal
        .msgBoxConfirm(
          this.radioApproval == 1
            ? "Đồng ý xét duyệt ?"
            : "Từ chối xét duyệt ?",
          {
            title: this.$t("form.warning").toUpperCase(),
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: this.$t("form.yes"),
            cancelTitle: this.$t("form.no"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then(async (value) => {
          if (value === true) {
            let body = {
              OID: this.dataTransportRequestByID.OID,
              IDCancel: this.valueApproval,
              StatusNote: this.dataTransportRequestByID.StatusNote,
              IsApproval: this.radioApproval.toString(),
            };
            let result = await this.approvalTransportRequest(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", "Xử lí thành công !");
              const currentID = result.data[0].OID;
              let body = {
                OID: currentID,
              };
              this.getTransportRequestByID(body);
              this.getTransportRequestActive();
            } else {
              this.$notify("error", "THẤT BẠI", "Xử lí thất bại !");
            }
          }
        })
        .catch((err) => console.log(err));
    },
    //vselect
    handleChangeVSelectApproval(newValue) {
      this.isShow = false;
      this.valueApproval = newValue;
      this.listReasonCoordinator.forEach((e) => {
        if (e.id == 526) {
          this.dataTransportRequestByID.StatusNote = "";
        } else if (e.id == newValue) {
          this.dataTransportRequestByID.StatusNote = e.label;
        }
      });
      this.isShow = true;
    },
    //
    handleDbClick(item) {
      let body = {
        OID: item.OID,
      };
      this.getTransportRequestByID(body);
      setTimeout(() => {
        this.$bvModal.show(`modal-detail-${this.keyComponent}`);
      }, 500);
    },
    //handle-datetime
    formatTime(datetime) {
      return moment(datetime).format("HH:mm");
    },
    handleFormatDateTime(key, curValue, date) {
      const time = curValue.split("T")[1];
      this.selectedTransportRequest[key].value = date + "T" + time;
    },
    handleTimeToDate(key, curValue, time) {
      this.selectedTransportRequest[key].value =
        curValue.split("T")[0] + "T" + time;
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
        FactorID: "SALE_SHIPREQUETS",
        EntryID: "RC_SHIPREQUETS",
        ListSearch: newListSearch,
      };
      let result = await this.handleSearch(body);
      if (result.status) {
        this.$notify("success", "THÀNH CÔNG", result.message);
        this.listTransportRequestActive = result.data;
        this.isReadonly = true;
        this.selectedTransportRequest = null;
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
        this.getTransportRequestActive();
        this.isReadonly = true;
        this.selectedTransportRequest = null;
      }
    },
    resetFormFind() {
      if (!this.fieldTransportRequestFinal?.length > 0) return;
      this.isShow = false;
      const arr = this.fieldTransportRequestFinal;
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
    //end-search
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
<style>
.custom-box-modal .modal-dialog {
  margin: auto;
  max-width: 90%;
}
</style>