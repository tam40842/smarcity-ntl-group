<template>
  <div id="print-template">
    <div class="px-3 py-1">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div>
            <img
              src="@/assets/img/npl/logoNPL.png"
              alt="logoPNL"
              width="100px"
              height="40px"
            />
          </div>
          <div class="d-flex flex-column">
            <div class="font-16 fw-700 text-uppercase">
              Công ty cổ phần LOGISTICS nPL
            </div>
            <div class="font-italic fw-600 font-14">
              Lô 10 - 12 Đường số 9, KCN Tân Tạo, P.Tân Tạo, Q.Bình Tân, TpHC
            </div>
            <div
              class="
                font-14
                fw-600
                d-flex
                align-items-center
                justify-content-between
              "
            >
              <div>ĐT: (08) 3754 5200</div>
              <div>Fax: (08) 5425 9948</div>
              <div>MST: 0313103204</div>
            </div>
          </div>
        </div>
        <div>
          <div class="font-16 text-uppercase text-center fw-700">Định mức</div>
          <div class="font-16 text-uppercase fw-700">
            Chi phí cho tuyến đường
          </div>
        </div>
      </div>

      <!-- End Header -->

      <!-- I -->

      <b-card
        class="border-3-print mt-2"
        style="position: relative; padding: 0.5rem"
        no-body
      >
        <b-row class="d-flex">
          <div class="sheet-width-50">
            <div class="font-18 text-uppercase fw-700">
              I. KINH DOANH
              <span
                class="font-italic fw-600"
                style="font-size: 11px; text-transform: initial"
                >(NVKD chỉ điền vào ô màu vàng)</span
              >
            </div>
          </div>
          <div class="sheet-width-50">
            <b-row>
              <div class="mb-2 sheet-width-40">
                <label for="input-small" class="font-16 fw-600"
                  >Loại hàng</label
                >
              </div>
              <div class="sheet-width-65">
                <div class="bg-yellow border-custom-print font-16 fw-600 pl-1">
                  {{ typeItem.text }}
                </div>
              </div>
            </b-row>
            <b-row>
              <div class="d-flex align-items-center">
                <div class="d-flex align-items-center w-50">
                  <div class="mb-2 width-50">
                    <label for="input-small" class="font-16 fw-600"
                      >Chở cont</label
                    >
                  </div>
                  <div class="width-40">
                    <div
                      class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                      :style="
                        orderItem?.text?.toUpperCase() == 'HÀNG CONTAINER'
                          ? ``
                          : 'height: 20px'
                      "
                      style="
                        border-left: 1px solid black !important;
                        border-right: 1px solid black !important;
                      "
                    >
                      <span v-if="orderItem?.text?.toUpperCase() == 'HÀNG RỜI'"
                        >✔</span
                      >
                      <span style="height: 20px" v-else></span>
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center w-50 ml-2">
                  <div class="mb-2 width-50">
                    <label for="input-small" class="font-16 fw-600"
                      >Hàng rời</label
                    >
                  </div>
                  <div class="width-40">
                    <div
                      class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                      :style="
                        orderItem?.text?.toUpperCase() == 'HÀNG CONTAINER'
                          ? ``
                          : 'height: 20px'
                      "
                      style="
                        border-left: 1px solid black !important;
                        border-right: 1px solid black !important;
                      "
                    >
                      <span
                        v-if="
                          orderItem?.text?.toUpperCase() == 'HÀNG CONTAINER'
                        "
                        >✔</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </b-row>
          </div>
        </b-row>
        <b-row>
          <div class="sheet-width-50">
            <div class="mt-2 d-flex flex-column">
              <div class="font-16 fw-700">Nơi đi</div>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >Phường/Xã</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                  >
                    {{ cityTo }}
                  </div>
                </div>
              </b-row>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >Quận/Huyện</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                  >
                    {{ districtTo }}
                  </div>
                </div>
              </b-row>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >TP/Tỉnh</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                  >
                    {{ wardsTo }}
                  </div>
                </div>
              </b-row>
            </div>
          </div>
          <div class="sheet-width-50">
            <div class="mt-2 d-flex flex-column">
              <div class="font-16 fw-700">Nơi đến</div>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >Phường/Xã</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                    type="text"
                  >
                    {{ cityFrom }}
                  </div>
                </div>
              </b-row>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >Quận/Huyện</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                    type="text"
                  >
                    {{ districtFrom }}
                  </div>
                </div>
              </b-row>
              <b-row>
                <div class="mb-2 sheet-width-40">
                  <label for="input-small" class="font-16 fw-600"
                    >TP/Tỉnh</label
                  >
                </div>
                <div class="sheet-width-65">
                  <div
                    class="bg-yellow border-custom-print font-16 fw-600 pl-1"
                    type="text"
                  >
                    {{ wardsFrom }}
                  </div>
                </div>
              </b-row>
            </div>
          </div>
        </b-row>
        <div class="font-italic fw-600 font-14 mt-2">
          Ghi xong gời email file này cho bộ phận kế tiếp
        </div>
        <div style="position: absolute; z-index: 9999; bottom: -12%">
          <img
            src="@/assets/img/npl/iconPrintNPL.png"
            alt=""
            height="35"
            width="35"
          />
        </div>
      </b-card>

      <!-- II -->

      <b-card
        class="border-3-print mt-2"
        style="position: relative; padding: 0.5rem"
        no-body
      >
        <b-row class="d-flex">
          <div class="font-18 text-uppercase fw-700">
            II. Điều độ -
            <span
              class="font-italic fw-600"
              style="font-size: 11px; text-transform: initial"
              >(Chỉ điền vào ô màu xanh)</span
            >
          </div>
        </b-row>
        <b-row>
          <div class="mt-2 d-flex flex-column">
            <b-row>
              <div class="mb-2 width-15">
                <label for="input-small" class="font-16 fw-600">Tuyến</label>
              </div>
              <div class="width-60">
                <div class="bg-green border-custom-print font-16 fw-600 pl-1">
                  {{ dataForm.RoutesName[1] }}
                </div>
              </div>

              <div class="width-25 d-flex justify-content-between">
                <label for="input-small" class="font-16 fw-600 mr-2"
                  >Số km</label
                >
                <div
                  class="
                    bg-green
                    border-custom-print
                    font-16
                    fw-600
                    text-center
                    width-60
                    pl-1
                  "
                >
                  {{ convertCurrency(dataForm.Distance[1]) }}
                </div>
              </div>
            </b-row>
            <b-row>
              <div class="mb-2 width-15">
                <label for="input-small" class="font-16 fw-600">Mã tuyến</label>
              </div>
              <div class="width-60">
                <div class="bg-green border-custom-print font-16 fw-600 pl-1">
                  {{ dataForm.RoutesCode[1] }}
                </div>
              </div>
              <div class="width-25"></div>
            </b-row>
            <b-row>
              <div class="mb-2 width-15">
                <label for="input-small" class="font-16 fw-600"
                  >Nhóm tuyến</label
                >
              </div>
              <div class="width-60">
                <div class="bg-green border-custom-print font-16 fw-600 pl-1">
                  {{ dataForm.RouteGroupsName[1] }}
                </div>
              </div>
              <div class="width-25"></div>
            </b-row>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <div class="font-16 fw-600 my-2">
              Phí cầu đường
              <span class="font-italic" style="font-size: 11px"
                >(ô tổng sẽ tự động cộng chi tiết phí từng trạm liệt kê)</span
              >
            </div>
            <div class="font-16 fw-600 pl-1">
              {{ totalChargingStations }}
            </div>
          </div>
        </b-row>
        <div class="pl-3">
          <b-row v-for="(data, i) in dataChildTable" :key="i">
            <div class="mb-2 width-25">
              <label for="input-small" class="font-16 fw-600"
                >Trạm thu phí</label
              >
            </div>
            <div class="width-45">
              <div class="bg-green border-custom-print font-16 fw-600 pl-1">
                {{ data.ChargingStationsName }}
              </div>
            </div>

            <div class="width-30 d-flex justify-content-between">
              <label for="input-small" class="font-16 fw-600 mr-2">phí</label>
              <div
                class="
                  bg-green
                  border-custom-print
                  font-16
                  fw-600
                  text-center
                  width-60
                  pl-1
                "
              >
                {{ convertCurrency(data.ChargingCost) }}
              </div>
            </div>
          </b-row>
        </div>
        <div class="font-italic fw-600 font-14 mt-2">
          Ghi xong gời email file này cho bộ phận kế tiếp
        </div>
        <div style="position: absolute; z-index: 9999; bottom: -12%">
          <img
            src="@/assets/img/npl/iconPrintNPL.png"
            alt=""
            height="35"
            width="35"
          />
        </div>
      </b-card>

      <!-- III -->

      <b-card class="border-3-print mt-2">
        <b-row class="d-flex">
          <div class="font-18 text-uppercase fw-700">
            III. Điều độ - Dũng
            <span
              class="font-italic fw-600"
              style="font-size: 11px; text-transform: initial"
              >(Chỉ điền vào ô màu cam)</span
            >
          </div>
        </b-row>
        <b-row class="justify-content-between">
          <div class="mt-2 d-flex flex-column width-50">
            <div class="d-flex align-items-center mt-2">
              <div class="width-25">
                <label for="input-small" class="font-16 fw-600"
                  >Phí đủ tải</label
                >
              </div>
              <div class="width-60">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ convertCurrency(dataForm.NoOverloadCost[1]) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <div class="width-25">
                <label for="input-small" class="font-16 fw-600"
                  >Phí quá tải</label
                >
              </div>
              <div class="width-60">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ convertCurrency(dataForm.OverloadCost[1]) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <div class="width-25">
                <label for="input-small" class="font-16 fw-600">Phí khác</label>
              </div>
              <div class="width-60">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ convertCurrency(dataForm.OtherCost[1]) }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 d-flex flex-column width-50">
            <div class="d-flex align-items-center mt-2">
              <div class="width-40">
                <label for="input-small" class="font-16 fw-600"
                  >Lương tài xế đủ tải</label
                >
              </div>
              <div class="width-60">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ convertCurrency(dataForm.NoOverloadSalary[1]) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <div class="width-40">
                <label for="input-small" class="font-16 fw-600"
                  >Lương tài xế quá tải</label
                >
              </div>
              <div class="width-60">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ convertCurrency(dataForm.OverloadSalary[1]) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <div class="width-25">
                <label for="input-small" class="font-16 fw-600">Ghi chú</label>
              </div>
              <div class="width-75">
                <div
                  class="
                    text-right
                    pr-1
                    bg-orange
                    border-custom-print
                    font-16
                    fw-600
                  "
                >
                  {{ dataForm.OtherCostDescription[1] }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 d-flex flex-column width-50"></div>
        </b-row>
        <div class="mt-2 d-flex">
          <div class="font-italic fw-600 font-14" style="margin-right: 16px">
            Ghi xong, cần phải:
          </div>
          <div class="font-italic fw-600 font-14">
            1. gời email file này cho bộ phận Kế Toán
          </div>
        </div>
        <div class="font-italic fw-600 font-14">
          <span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
          2. in ra => ký vào ô bên dưới => chuyển Giám đốc ký
        </div>
      </b-card>
      <div
        style="
          border: 2px solid black;
          border-top: unset;
          border-bottom: unset;
          padding-right: 8px;
        "
        class="my-2"
      >
        <div class="d-flex justify-content-end">
          <div class="width-50 d-flex align-items-center">
            <div class="width-50">
              <label for="input-small" class="font-16 fw-600"
                >Tổng phí đủ tải</label
              >
            </div>
            <div class="width-50 ml-2">
              <div
                class="
                  text-right
                  pr-1
                  bg-yellow
                  border-custom-print
                  font-16
                  fw-600
                "
              >
                {{ convertCurrency(dataForm.NoOverloadTotalCost[1]) }}
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <div class="width-50 d-flex align-items-center">
            <div class="width-50">
              <label for="input-small" class="font-16 fw-600"
                >Tổng phí quá tải</label
              >
            </div>
            <div class="width-50 ml-2">
              <div
                class="
                  text-right
                  pr-1
                  bg-yellow
                  border-custom-print
                  font-16
                  fw-600
                "
              >
                {{ convertCurrency(dataForm.OverloadTotalCost[1]) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-between">
        <div
          style="
            padding-right: 20px;
            padding-left: 8px;
            border: 2px solid black;
          "
          class="width-30"
        >
          <div class="font-15 fw-600" style="margin-bottom: 32px">
            Trưởng BP Điều độ
          </div>
          <div class="font-16 fw-700 text-uppercase">TRỊNH TIẾN DŨNG</div>
          <div>
            <span>Ngày</span><span>______/</span><span>______/</span
            ><span>______</span>
          </div>
        </div>
        <div class="width-5">
          <img
            src="@/assets/img/npl/iconPrintNPLRight.png"
            alt="iconPrintNPLRight"
            width="40"
            height="40"
          />
        </div>
        <div
          style="
            padding-right: 20px;
            padding-left: 8px;
            border: 2px solid black;
          "
          class="width-30"
        >
          <div class="font-15 fw-600" style="margin-bottom: 32px">
            Giám đốc công ty
          </div>
          <div class="font-16 fw-700 text-uppercase">NGUYỄN HÙNG VƯƠNG</div>
          <div>
            <span>Ngày</span><span>______/</span><span>______/</span
            ><span>______</span>
          </div>
        </div>
        <div class="width-5">
          <img
            src="@/assets/img/npl/iconPrintNPLRight.png"
            alt="iconPrintNPLRight"
            width="40"
            height="40"
          />
        </div>
        <div
          style="
            padding-right: 20px;
            padding-left: 8px;
            border: 2px solid black;
          "
          class="width-30"
        >
          <div class="font-15 fw-600" style="margin-bottom: 32px">
            <span>Nhận ngày</span><span>____/</span><span>____/</span
            ><span>____</span>
          </div>
          <div
            class="font-16 fw-700 text-uppercase"
            style="padding-bottom: 24px"
          >
            TRẦN THỊ DƯƠNG
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueHtmlToPaper from "@/assets/js/vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://unpkg.com/bootstrap/dist/css/bootstrap.min.css",
    "https://unpkg.com/bootstrap-vue@2.23.1/dist/bootstrap-vue.min.css",
    "/assets/fonts/fontawesome/css/print.css",
  ],
  timeout: 2000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
  openInNewWindow: false,
};

Vue.use(VueHtmlToPaper, options);

export default {
  props: {
    dataForm: {
      type: Object,
      default: () => {},
    },
    dataFormOptionsPrint: {
      type: Object,
      default: () => {},
    },
    dataChildTable: {
      type: Array,
      default: () => [],
    },
    formatCurrency: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      cityTo: "",
      districtTo: "",
      wardsTo: "",
      cityFrom: "",
      districtFrom: "",
      wardsFrom: "",
      isBulk: null,
      isContainer: null,
      typeItem: null,
      orderItem: null,
    };
  },
  computed: {
    totalChargingStations() {
      //Tổng chi phí cầu đường
      let sum = 0;
      const arr = this.dataChildTable;
      if (arr.length > 0) {
        arr.forEach((item) => {
          sum += Number(item.ChargingCost);
        });
      }
      return this.convertCurrency(sum);
    },
  },
  watch: {
    dataForm: {
      immediate: true,
      handler(to) {
        to?.RoutesName[1]?.split("-").forEach((item, index) => {
          let itemSplit = item.split(",");
          if (index == 0 && itemSplit?.length > 0) {
            this.cityTo = itemSplit[0];
            this.districtTo = itemSplit[1];
            this.wardsTo = itemSplit[2];
          } else if (index == 1 && itemSplit?.length > 0) {
            this.cityFrom = itemSplit[0];
            this.districtFrom = itemSplit[1];
            this.wardsFrom = itemSplit[2];
          }
        });
        this.orderItem = this.dataFormOptionsPrint.OrderTypeID.find(
          (item) => item?.value?.toUpperCase() == to?.OrderTypeID[1]
        );

        this.typeItem = this.dataFormOptionsPrint.GoodType.find(
          (item) => item.value == to?.GoodsTypeID[1]
        );
      },
    },
  },
  methods: {
    convertCurrency(value) {
      if (!value) {
        return 0;
      }
      if (this.formatCurrency.toUpperCase() == "VN") {
        return Number(value).toLocaleString("vi-VN");
      } else if (this.formatCurrency.toUpperCase() == "EN") {
        return Number(value).toLocaleString("en-US");
      }
    },
    printSheet() {
      this.$htmlToPaper("print-template");
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/fonts/fontawesome/css/print.css";
</style>f
