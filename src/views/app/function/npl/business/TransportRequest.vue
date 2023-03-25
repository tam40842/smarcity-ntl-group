<template>
  <div class="main">
    <b-card no-body>
      <div class="content">
        <div class="actions">
          <HeaderActions
            :index="currentIndex"
            :isReadonly="isReadonly"
            :isAdd="isAdd"
            :isEdit="isEdit"
            :items="listTransportRequest"
            :selectedItem="selectedTransportRequest"
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
                  :items="listTransportRequest"
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
                            <b-col xl="4" lg="6" md="6">
                              <b-form-group
                                :label="slotProps.dataForm.OID.label"
                                class="custom-label-group"
                              >
                                <b-form-input
                                  :value="
                                    isAdd
                                      ? `AUTO`
                                      : slotProps.dataForm.OID.value
                                  "
                                  disabled
                                />
                              </b-form-group>
                            </b-col>
                            <b-col xl="4" lg="6" md="6">
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
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.CustomerName.label
                                "
                                :state="slotProps.dataForm.CustomerName.valid"
                              >
                                <VSelect
                                  v-model="
                                    slotProps.dataForm.CustomerName.value
                                  "
                                  :class="slotProps.dataForm.CustomerName.class"
                                  :options="listCustomer"
                                  label="nPLCustomersName"
                                  :disabled="isReadonly"
                                  @input="
                                    handleChangeInputByKey(
                                      'CustomerName',
                                      $event
                                    )
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
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.CustomerContactsName.label
                                "
                                :state="
                                  slotProps.dataForm.CustomerContactsName.valid
                                "
                              >
                                <VSelect
                                  v-model="
                                    slotProps.dataForm.CustomerContactsName
                                      .value
                                  "
                                  :class="
                                    slotProps.dataForm.CustomerContactsName
                                      .class
                                  "
                                  :options="listContact"
                                  label="Name"
                                  :disabled="isReadonly"
                                  @input="
                                    handleChangeVSelectContacts(
                                      'CustomerContactsName',
                                      $event
                                    )
                                  "
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Phone"
                                :label="slotProps.dataForm.Phone.label"
                                class="custom-label-group"
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.Phone.label
                                "
                                :state="slotProps.dataForm.Phone.valid"
                              >
                                <b-form-input
                                  v-model="slotProps.dataForm.Phone.value"
                                  :class="slotProps.dataForm.Phone.class"
                                  :disabled="isReadonly"
                                  @input="checkValids"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="4">
                              <b-form-group
                                v-if="slotProps.dataForm.Email"
                                :label="slotProps.dataForm.Email.label"
                                class="custom-label-group"
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.Email.label
                                "
                                :state="slotProps.dataForm.Email.valid"
                              >
                                <b-form-input
                                  v-model="slotProps.dataForm.Email.value"
                                  :class="slotProps.dataForm.Email.class"
                                  :disabled="isReadonly"
                                  @input="checkValids"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </div>
                        <div
                          class="bg-light p-2 mb-2"
                          style="min-height: 215px"
                        >
                          <div class="text-info">
                            <strong>THÔNG TIN HÀNG HÓA</strong>
                          </div>
                          <b-row>
                            <b-col lg="6">
                              <b-form-group
                                v-if="slotProps.dataForm.OrderTypeID"
                                :label="slotProps.dataForm.OrderTypeID.label"
                                class="custom-label-group"
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.OrderTypeID.label
                                "
                                :state="slotProps.dataForm.OrderTypeID.valid"
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
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.GoodsTypeID.label
                                "
                                :state="slotProps.dataForm.GoodsTypeID.valid"
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
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.nPLUnitsID.label
                                "
                                :state="slotProps.dataForm.nPLUnitsID.valid"
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
                                    handleChangeVSelectByKey(
                                      'nPLUnitsID',
                                      $event
                                    )
                                  "
                                />
                              </b-form-group>
                            </b-col>
                            <template v-if="typeOrder == 8">
                              <b-col lg="4">
                                <b-form-group
                                  v-if="slotProps.dataForm.Cont20Quantity"
                                  :label="
                                    slotProps.dataForm.Cont20Quantity.label
                                  "
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
                                  :label="
                                    slotProps.dataForm.Cont40Quantity.label
                                  "
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
                        <div class="bg-light p-2 mb-2" style="height: 471px">
                          <div class="text-info">
                            <strong>THÔNG TIN LẤY HÀNG</strong>
                          </div>
                          <b-row>
                            <b-col lg="12">
                              <b-form-group
                                v-if="slotProps.dataForm.BeginAddressInfo"
                                :label="
                                  slotProps.dataForm.BeginAddressInfo.label
                                "
                                class="custom-label-group"
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.BeginAddressInfo.label
                                "
                                :state="
                                  slotProps.dataForm.BeginAddressInfo.valid
                                "
                              >
                                <b-form-input
                                  v-model="
                                    slotProps.dataForm.BeginAddressInfo.value
                                  "
                                  :class="
                                    slotProps.dataForm.BeginAddressInfo.class
                                  "
                                  :disabled="isReadonly"
                                  @input="checkValids"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="12">
                              <b-form-group
                                v-if="slotProps.dataForm.RequestTimeTake"
                                :label="
                                  slotProps.dataForm.RequestTimeTake.label
                                "
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
                                        slotProps.dataForm.RequestTimeTake
                                          .value,
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
                                        slotProps.dataForm.RequestTimeTake
                                          .value,
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
                                :invalid-feedback="
                                  $t('form.please-invalid') +
                                  slotProps.dataForm.EndAddressInfo.label
                                "
                                :state="slotProps.dataForm.EndAddressInfo.valid"
                              >
                                <b-form-input
                                  v-model="
                                    slotProps.dataForm.EndAddressInfo.value
                                  "
                                  :class="
                                    slotProps.dataForm.EndAddressInfo.class
                                  "
                                  :disabled="isReadonly"
                                  @input="checkValids"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col lg="12">
                              <b-form-group
                                v-if="slotProps.dataForm.RequestTimeBack"
                                :label="
                                  slotProps.dataForm.RequestTimeBack.label
                                "
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
                                        slotProps.dataForm.RequestTimeBack
                                          .value,
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
                                        slotProps.dataForm.RequestTimeBack
                                          .value,
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
                      <b-col v-if="!isAdd" lg="4">
                        <div
                          class="bg-light pt-1 pl-2 pr-2"
                          style="padding-bottom: 1px"
                        >
                          <div class="text-info">
                            <strong>THÔNG TIN XỬ LÝ NỘI BỘ</strong>
                          </div>
                          <template v-if="dataTransportRequestByID">
                            <div class="status-step pl-1 mb-1">
                              <strong>
                                <span class="text-muted">TRẠNG THÁI</span> :
                                <span
                                  v-if="dataTransportRequestByID.StatusApproval"
                                  :style="
                                    dataTransportRequestByID &&
                                    dataTransportRequestByID.StatusColorApproval
                                      ? `color: ${dataTransportRequestByID.StatusColorApproval}`
                                      : null
                                  "
                                >
                                  {{
                                    dataTransportRequestByID.StatusApproval.toUpperCase()
                                  }}
                                </span>
                              </strong>
                            </div>
                            <div class="box-step mb-3">
                              <StepProcess :stepList="stepItems" />
                            </div>
                            <div
                              v-if="
                                dataTransportRequestByID.CancelReasonApproval
                              "
                              class="note-step mb-2"
                            >
                              <b-form-group
                                :label="'Lí do'"
                                class="has-float-label mb-4"
                              >
                                <b-form-input
                                  v-model="
                                    dataTransportRequestByID.CancelReasonApproval
                                  "
                                  :disabled="true"
                                />
                              </b-form-group>
                            </div>
                            <div class="pl-2">
                              <b-form-group
                                :label="`Diễn giải thêm`"
                                class="has-float-label mb-4"
                              >
                                <b-form-textarea
                                  v-model="
                                    dataTransportRequestByID.StatusNoteApproval
                                  "
                                  :disabled="true"
                                  style="height: 65px"
                                />
                              </b-form-group>
                            </div>
                          </template>
                          <template v-else>
                            <div style="font-weight: 600" class="text-muted">
                              Chưa cập nhật dữ liệu..
                            </div>
                          </template>
                        </div>
                        <div
                          class="bg-light pt-1 pl-2 pr-2 pb-1"
                          style="min-height: 218px"
                        >
                          <div class="text-info">
                            <strong>THÔNG TIN PHẢN HỒI KHÁCH HÀNG</strong>
                          </div>
                          <div
                            v-if="dataTransportRequestByID.IDStatusReply >= 5"
                            class="pl-2"
                          >
                            <strong style="color: #666666">
                              <span class="text-muted">Trả lời khách hàng:
                              </span>
                              {{ dataTransportRequestByID.UserReply }}
                            </strong>
                            -
                            <span class="text-primary">{{
                              convertDateTime(
                                dataTransportRequestByID.DateReply
                              )
                            }}</span>
                          </div>
                          <div class="pl-2">
                            <b-form-radio-group
                              v-if="dataTransportRequestByID.IDStatusReply < 5"
                              v-model="radioApproval"
                              class="mb-2"
                              :options="optionApproval"
                              value-field="value"
                              text-field="label"
                            />
                            <VSelect
                              v-model="
                                dataTransportRequestByID.CancelReasonReply
                              "
                              :disabled="
                                radioApproval == 1 ||
                                dataTransportRequestByID.IDStatusReply >= 5
                              "
                              :options="listReasonSale"
                              label="label"
                              class="mb-3"
                              @input="handleChangeVSelectApprovalSale"
                            />
                            <b-form-group
                              :label="`Diễn giải thêm`"
                              class="has-float-label mb-2"
                            >
                              <b-form-textarea
                                v-model="
                                  dataTransportRequestByID.StatusReplyNote
                                "
                                style="height: 65px"
                                :disabled="
                                  dataTransportRequestByID.IDStatusReply >= 5
                                "
                              />
                            </b-form-group>
                            <div
                              v-if="dataTransportRequestByID.IDStatusReply < 5"
                              class="text-right mb-2"
                            >
                              <b-button
                                squared
                                variant="primary"
                                size="xs"
                                @click="showConfirmApproval"
                              >
                                <b>Xác nhận</b>
                              </b-button>
                            </div>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </template>
              </FormDetailSlot>
            </b-tab>
            <b-tab>
              <HistoryActions
                v-if="
                  dataTransportRequestByID && dataTransportRequestByID.Histories
                "
                :items="dataTransportRequestByID.Histories"
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
                  v-else-if="field.typeCol.toUpperCase() == 'STATUSCOLOR'"
                >
                  <template v-for="(operator, io) in optionOperators">
                    <b-dropdown-item
                      v-if="operator.Valu == 'like'"
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
                <VSelect
                  v-else-if="field.typeCol.toUpperCase() == 'STATUSCOLOR'"
                  :value="
                    optionStatus.find(
                      (o) =>
                        o.StatusID ==
                        formFind.ListSearch.find((e) => e.Name == field.key)
                          .Param1
                    )
                  "
                  :options="optionStatus"
                  :reduce="(optionStatus) => optionStatus.StatusID"
                  label="StatusName"
                  @input="
                    inputVSelectSearchStatus(
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
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import FooterTabs from "./component/FooterTabs.vue";
import HeaderActions from "./component/HeaderActions.vue";
import ListItem from "./component/ListItem.vue";
import FormDetailSlot from "./component/FormDetailSlot.vue";
import HistoryActions from "./component/HistoryActions.vue";
import ListFile from "./component/ListFile.vue";
import useTransportRequest from "../hooks/useTransportRequest";
import useToasts from "../hooks/useToasts";
import useCategorysNPL from "../hooks/useCategorysNPL";
import useCustomerNPL from "../hooks/useCustomerNPL";
import moment from "moment";
import handling from "@/constants/handling";
import StepProcess from "./component/StepProcess.vue";
import useReasonNPL from "../hooks/useReasonNPL";
import useAttachFiles from "../hooks/useAttachFiles";
import useStatusNPL from "../hooks/useStatusNPL";

export default {
  components: {
    HeaderActions,
    ListItem,
    FormDetailSlot,
    HistoryActions,
    ListFile,
    FooterTabs,
    VSelect,
    StepProcess,
  },
  setup() {
    const keys = reactive({
      FactorID: "SALE_SHIPREQUETS",
      EntryID: "RC_SHIPREQUETS",
    });
    const radioApproval = ref(1);
    const typeOrder = ref(null);
    const isUpdate = ref(false)
    const isShow = ref(true);
    const isReadonly = ref(true);
    const isAdd = ref(false);
    const isEdit = ref(false);
    const currentTab = ref(0);
    const currentIndex = ref(0);
    const { optionStatus, getStatusByKey } = useStatusNPL();
    const { showToast } = useToasts();
    const {
      listItemUnit,
      getListItemUnits,
      listOrderType,
      listItem,
      getListOrderType,
      getListItem,
    } = useCategorysNPL();
    const {
      listReasonCustomer,
      getListReasonByCustomer,
      listReasonSale,
      getListReasonBySale,
    } = useReasonNPL();
    const {
      listCustomer,
      listContact,
      getListCustomerByUserID,
      getListContactByCusID,
    } = useCustomerNPL();
    const {
      optionOperators,
      fieldTransportRequestFinal,
      listTransportRequest,
      dataTransportRequestByID,
      selectedTransportRequest,
      errorTransportRequest,
      isLoadingTransportRequest,
      getTransportRequest,
      getTransportRequestByID,
      handleFormAddTransportRequest,
      addTransportRequest,
      editTransportRequest,
      deleteTransportRequestByID,
      changeStatusTransportRequest,
      handleSearch,
      approvalSaleProcess,
    } = useTransportRequest();
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
      await getTransportRequest();
      await getListOrderType();
      await getListItem();
      await getListCustomerByUserID();
      await getListItemUnits();
      await getListReasonByCustomer();
      await getListReasonBySale();
      await getStatusByKey({ StatusType: keys.EntryID });
      setTimeout(() => {
        currentIndex.value = listTransportRequest.value.length - 1;
      }, 500);
    });

    watch(selectedTransportRequest, (value) => {
      if (value && value.OrderTypeID) {
        typeOrder.value = value.OrderTypeID.value;
      }
      if (dataTransportRequestByID.value) {
        radioApproval.value = dataTransportRequestByID.value.CancelReasonReply
          ? 0
          : 1;
      }
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
      let bodyAtt = {
        OID: item.OID,
        FactorID: keys.FactorID,
        EntryID: keys.EntryID,
      };
      let body = {
        OID: item.OID,
      };
      await getTransportRequestByID(body);
      currentIndex.value = listTransportRequest.value.findIndex(
        (e) => e.OID == item.OID
      );
      //import-file
      await getListAttachFile(bodyAtt);
    };

    const handleDbClick = async (item) => {
      let body = {
        OID: item.OID,
      };
      await getTransportRequestByID(body);
      currentTab.value = 1;
      currentIndex.value = listTransportRequest.value.findIndex(
        (e) => e.OID == item.OID
      );
    };

    const handleFirstIndex = async () => {
      if (!listTransportRequest.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      let currentItem = listTransportRequest.value[0];
      let body = {
        OID: currentItem.OID,
      };
      await getTransportRequestByID(body);
      currentIndex.value = 0;
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedTransportRequest.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handlePreIndex = async () => {
      if (!listTransportRequest.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      if (currentIndex.value == 0) {
        currentIndex.value = 0;
      } else {
        currentIndex.value -= 1;
      }
      let currentItem = listTransportRequest.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getTransportRequestByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedTransportRequest.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handleNextIndex = async () => {
      if (!listTransportRequest.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      if (currentIndex.value == listTransportRequest.value.length - 1) {
        currentIndex.value = listTransportRequest.value.length - 1;
      } else {
        currentIndex.value += 1;
      }
      let currentItem = listTransportRequest.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getTransportRequestByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedTransportRequest.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const handleLastIndex = async () => {
      if (!listTransportRequest.value?.length > 0) return;
      if (!isReadonly.value) {
        showToast("error", "THẤT BẠI", "Bạn đang thao tác dữ liệu !");
        return;
      }
      currentIndex.value = listTransportRequest.value.length - 1;
      let currentItem = listTransportRequest.value[currentIndex.value];
      let body = {
        OID: currentItem.OID,
      };
      await getTransportRequestByID(body);
      currentTab.value = 1;
      //import-file
      setTimeout(() => {
        let bodyAtt = {
          OID: selectedTransportRequest.value.OID.value,
          FactorID: keys.FactorID,
          EntryID: keys.EntryID,
        };
        getListAttachFile(bodyAtt);
      }, 500);
    };

    const changeTypeOrder = (newValue) => {
      typeOrder.value = newValue;
    };

    const handleChangeVSelectByKey = async (key, newValue) => {
      selectedTransportRequest.value[key].value = newValue;
      if (key.toUpperCase() == "ORDERTYPEID") {
        changeTypeOrder(newValue);
      }
      await checkValids();
    };

    const checkValids = () => {
      if (!selectedTransportRequest.value) return;
      isShow.value = false;
      let result = true;
      const arr = selectedTransportRequest.value;
      for (const key in arr) {
        if (
          key == "EntryID" ||
          key == "FactorID" ||
          key == "OID" ||
          key == "OrderTypeName" ||
          key == "Cont20Quantity" ||
          key == "Cont40Quantity" ||
          key == "Quantity" ||
          key == "Weight" ||
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
      keys,
      isUpdate,
      isShow,
      keyComponent: "TransportRequest",
      isReadonly,
      isAdd,
      isEdit,
      currentTab,
      currentIndex,
      typeOrder,
      listContact,
      listOrderType,
      listCustomer,
      listItemUnit,
      listItem,
      listTransportRequest,
      fieldTransportRequestFinal,
      stepItems,
      dataTransportRequestByID,
      selectedTransportRequest,
      listReasonCustomer,
      listReasonSale,
      isLoadingTransportRequest,
      errorTransportRequest,
      optionOperators,
      handleClick,
      handleDbClick,
      handleFirstIndex,
      handlePreIndex,
      handleNextIndex,
      handleLastIndex,
      getTransportRequest,
      getTransportRequestByID,
      handleFormAddTransportRequest,
      addTransportRequest,
      editTransportRequest,
      deleteTransportRequestByID,
      changeStatusTransportRequest,
      handleChangeVSelectByKey,
      getListContactByCusID,
      handleSearch,
      approvalSaleProcess,
      checkValids,
      optionStatus,
      optionBlockStatus: [
        { id: 1, label: "Đã khóa", value: 1, text: "Đã khóa" },
        { id: 0, label: "Chưa khóa", value: 0, text: "Chưa khóa" },
      ],
      radioApproval,
      valueApproval: 0,
      optionApproval: [
        { value: 1, label: "Đồng ý" },
        { value: 0, label: "Từ chối" },
      ],
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
    log(){
      console.log('w',this.selectedTransportRequest,this.dataTransportRequestByID)
    },
    showConfirmApproval() {
      this.$bvModal
        .msgBoxConfirm(`Bạn muốn phản hồi cho khách hàng ?`, {
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
        .then((value) => {
          if (this.radioApproval == 0) {
            if (!this.dataTransportRequestByID.CancelReasonReply) {
              this.$notify("error", "THẤT BẠI", "Bạn chưa chọn lý do !");
              return;
            }
          }
          this.submitApprovalSaleByCutomer();
        })
        .catch((err) => console.log(err));
    },
    submitApprovalSaleByCutomer() {
      let body = {
        OID: this.dataTransportRequestByID.OID,
        IDCancelReply: this.valueApproval,
        StatusReplyNote: this.dataTransportRequestByID.StatusReplyNote,
        IsApprovalReply: this.radioApproval.toString(),
      };
      this.approvalSaleProcess(body)
        .then((val) => {
          if (val.status) {
            this.$notify("success", "THÀNH CÔNG", val.message);
            let body = {
              OID: this.dataTransportRequestByID.OID,
            };
            this.getTransportRequestByID(body);
          } else {
            this.$notify("error", "THẤT BẠI", val.message);
          }
        })
        .catch((err) => console.log(err));
    },
    //vselect
    handleChangeVSelectApprovalSale(newValue) {
      this.isShow = false;
      if (!newValue) {
        this.valueApproval = 0;
        this.dataTransportRequestByID.CancelReasonReply = "";
      } else {
        this.valueApproval = newValue.id;
        this.dataTransportRequestByID.CancelReasonReply = newValue.label;
      }
      this.isShow = true;
    },
    //handle-fill-data
    async handleChangeVSelectContacts(key, value) {
      this.isShow = false;
      if (!value) {
        this.selectedTransportRequest[key].value = "";
      } else {
        this.selectedTransportRequest[key].value = value.Name;
        this.selectedTransportRequest.Phone.value = value.PhoneNumber;
        this.selectedTransportRequest.Email.value = value.Email;
      }
      await this.checkValids();
      this.isShow = true;
    },
    async handleChangeInputByKey(key, value) {
      this.isShow = false;
      if (!value) {
        this.selectedTransportRequest[key].value = "";
        this.selectedTransportRequest.nPLCustomersID.value = "";
        this.listContact = [];
      } else {
        let body = {
          CusIDSelect: value.ID.toString(), //o.đức trả number o.bình trả string
        };
        this.selectedTransportRequest[key].value = value.nPLCustomersName;
        this.selectedTransportRequest.nPLCustomersID.value = value.ID;
        this.getListContactByCusID(body);
      }
      await this.checkValids();
      this.isShow = true;
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
    //change-tab
    changeTab(result) {
      if (this.isReadonly == false) {
        this.$notify("error", "THẤT BẠI", "Bạn đang tương tác dữ liệu !");
        return;
      }
      if (!this.selectedTransportRequest) {
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
          if (this.selectedTransportRequest) {
            this.isEdit = true;
            this.isAdd = false;
            this.isReadonly = false;
            this.currentTab = 1;
          } else {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !");
          }
          break;
        case "DELETE":
          if (!this.selectedTransportRequest) {
            this.$notify("error", "THẤT BẠI", "Bạn chưa chọn dữ liệu !", {
              duration: 3000,
              permanent: false,
            });
          } else {
            this.currentTab = 1;
            this.showConfirmDelete(this.selectedTransportRequest.OID.value);
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
            let body = {
              OID: this.dataTransportRequestByID.OID,
            };
            this.getTransportRequestByID(body);
            this.currentTab = 0;
          }
          if (this.isEdit) {
            let body = {
              OID: this.selectedTransportRequest.OID.value,
            };
            this.getTransportRequestByID(body);
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
            // this.$notify("error", "THẤT BẠI", "Dữ liệu này đã được khóa !");
          }
          break;
        case "IMPORT":
          if (!this.selectedTransportRequest) {
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
    //handle-add
    async createFormAdd() {
      await this.handleFormAddTransportRequest();
      this.selectedTransportRequest.ODate.value = moment(new Date()).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      this.selectedTransportRequest.RequestTimeTake.value = moment(
        new Date()
      ).format("YYYY-MM-DDTHH:mm:ss");
      this.selectedTransportRequest.RequestTimeBack.value = moment(
        new Date()
      ).format("YYYY-MM-DDTHH:mm:ss");
      this.selectedTransportRequest.Quantity.value = 0;
      this.selectedTransportRequest.Weight.value = 0;
      this.selectedTransportRequest.Cont20Quantity.value = 0;
      this.selectedTransportRequest.Cont40Quantity.value = 0;
    },
    async submitAdd() {
      const arr = this.selectedTransportRequest;
      let body = {};
      for (const key in arr) {
        let value = arr[key].value;
        Object.assign(body, { [key]: value });
      }
      body.FactorID = "SALE_SHIPREQUETS";
      body.EntryID = "RC_SHIPREQUETS";
      let result = await this.addTransportRequest(body);
      if (result.status) {
        this.$notify("success", "THÀNH CÔNG", result.message);
        let body = {
          OID: result.data[0].OID,
        };
        this.getTransportRequest();
        this.getTransportRequestByID(body);
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
      } else {
        this.$notify("error", "THẤT BẠI", result.message);
      }
    },
    //handle-edit
    async submitEdit() {
      const body = {};
      const arr = this.selectedTransportRequest;
      for (const key in arr) {
        let value = arr[key].value;
        Object.assign(body, { [key]: value });
      }
      let result = await this.editTransportRequest(body);
      if (result.status) {
        this.$notify("success", "THÀNH CÔNG", result.message);
        let body = {
          OID: result.data[0].OID,
        };
        this.getTransportRequest();
        this.getTransportRequestByID(body);
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
            let result = await this.changeStatusTransportRequest(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", "Xử lí thành công !");
              const id = result.data[0].OID;
              let body = {
                OID: id,
              };
              this.getTransportRequestByID(body);
              this.getTransportRequest();
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
            let result = await this.deleteTransportRequestByID(body);
            if (result.status) {
              this.$notify("success", "THÀNH CÔNG", "Xử lí thành công !");
              this.currentTab = 0;
              this.currentIndex = 0;
              const newSelected = this.listTransportRequest[this.currentIndex];
              let body = {
                OID: newSelected.OID,
              };
              this.getTransportRequestByID(body);
              this.getTransportRequest();
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
    inputVSelectSearchStatus(objKey, value) {
      this.isShow = false;
      objKey.Param1 =
        this.optionStatus?.length > 0
          ? this.optionStatus.find((e) => e.StatusID == value).StatusName
          : null;
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
        this.listTransportRequest = result.data;
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedTransportRequest = null;
      } else {
        this.getTransportRequest();
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
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
    handleListDataByFilter(result) {
      if (result.status) {
        this.listTransportRequest = result.data;
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedTransportRequest = null;
      } else {
        this.getTransportRequest();
        this.currentTab = 0;
        this.isAdd = false;
        this.isEdit = false;
        this.isReadonly = true;
        this.selectedTransportRequest = null;
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
        OID: this.selectedTransportRequest.OID.value,
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
          OID: this.selectedTransportRequest.OID.value,
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
        OID: this.selectedTransportRequest.OID.value,
        FactorID: this.keys.FactorID,
        EntryID: this.keys.EntryID,
      };
      this.getListAttachFile(bodyAtt);
    },
    handleEditImportFile(item) {
      this.isShow = false;
      this.formImportFile.ID = item.ID;
      this.formImportFile.OID = this.selectedTransportRequest.OID.value;
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
          OID: this.selectedTransportRequest.OID.value,
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
        Note: '',
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
    convertDate(string) {
      return handling.convertDateNPL(string);
    },
    convertDateTime(string) {
      return handling.convertDateTime(string);
    },
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
