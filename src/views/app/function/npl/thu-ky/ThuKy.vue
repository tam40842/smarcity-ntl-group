<template>
  <div id="app-content-full">
    <div :class="(currentTab === 3 || currentTab === 4) && 'npl-thuky d-flex flex-column h-100'">
      <div class="header-tabs">
        <TabMajor
          :tabList="tabList"
          :activeFocus="currentTab"
          @changeTab="updateTab"
        />
      </div>
      <div v-if="tabList.length > 0" class="content-major" style="flex-grow: 1">
        <b-card>
          <component 
            :is="renderMajor"
            :formDetail="renderFormDetail"
            :factorID="factorID"
          />
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import TabMajor from "@/views/app/function/npl/thu-ky/component/TabMajor";
import QuanLyChungTuVanDon from "@/views/app/function/npl/thu-ky/QuanLyChungTuVanDon";
// import TabNghiepVu from "./component/TabNghiepVu.vue";
import TamUngTaiXe from "./TamUngTaiXe.vue";
import PhiNangHa from "./PhiNangHa.vue";
import VeThang from "./VeThang.vue";
import PhuCapHangLe from "./PhuCapHangLe.vue";
import VeETC from "./VeETC.vue";
import CapNhatChungTu from "./CapNhatChungTu.vue";
import BanGiaoChungTu from "./BanGiaoChungTu.vue";

export default {
  components: {
    TabMajor,
    QuanLyChungTuVanDon,
    // TabNghiepVu,
    TamUngTaiXe,
    PhiNangHa,
    VeThang,
    PhuCapHangLe,
    VeETC,
    CapNhatChungTu,
    BanGiaoChungTu,
  },
  data() {
    return {
      currentTab: 0,
      // currentTab: 3, //mặc định mở tab ngay Vé tháng
      tabList: [
        {
          label: "Cập nhật phí nâng/hạ/DO",
          icon: "fas fa-truck-loading mr-1",
          component: "PhiNangHa",
        },
        {
          label: "Cập nhật chứng từ",
          icon: "fas fa-edit",
          component: "CapNhatChungTu",
        },
        {
          label: "Bàn giao chứng từ",
          icon: "fas fa-sync-alt",
          component: "BanGiaoChungTu",
        },
        {
          label: "Tạm ứng tài xế",
          icon: "fas fa-file-invoice-dollar",
          component: "QuanLyChungTuVanDon",
          formDetail: "FormAdvanceDrivers",
          factorID: 'SALE_ADVANCEDRIVER'
        },
        {
          label: "Vé tháng",
          icon: "fas fa-file-invoice-dollar",
          component: "QuanLyChungTuVanDon",
          formDetail: "FormMonthlyTicket",
          factorID: 'SALE_REGISTERMONTHLYTICKET'
        },
        {
          label: "P/cấp hàng lẻ",
          icon: "fas fa-file-invoice-dollar",
          component: "PhuCapHangLe",
        },
        {
          label: "Vé ETC",
          icon: "fas fa-file-invoice-dollar",
          component: "VeETC",
        },
      ],
    };
  },
  computed: {
    renderMajor() {
      return this.tabList[this.currentTab].component
    },
    renderFormDetail() {
      return this.tabList[this.currentTab].formDetail || ''
    },
    factorID() {
      return this.tabList[this.currentTab].factorID || ''
    }
  },
  methods: {
    updateTab(value) {
      this.currentTab = value;
    },
  },
};
</script>
<style lang="scss">
.npl-thuky {
  .card {
    height: 100%;
  }
  .card-body {
    height: 100%;
    padding: 0;
  }
  .box-content {
    overflow: auto;
  }
  // .btn-warning.disabled {
  //   color: white;
  // }
  // .btn-outline-danger.disabled {
  //   &:hover {
  //     color: #dc3545;
  //   }
  // }
  // .btn-outline-secondary.disabled {
  //   color: #2a93d5;
  //   &:hover {
  //     color: #2a93d5;
  //     background-color: transparent;
  //   }
  // }
  // .btn-outline-info.disabled {
  //   &:hover {
  //     color: #17a2b8;
  //     background-color: transparent;
  //   }
  // }
  // .custom-select {
  //   height: 36px;
  //   font-size: 0.8rem;
  //   padding: 0.5rem 0.75rem;
  // }
  // td {
  //   vertical-align: middle;
  // }
  // .vdp-datepicker {
  //   .form-control {
  //     text-align: right;
  //   }
  //   .form-control[readonly] {
  //     background: none;
  //   }
  //   .form-control:disabled {
  //     background: #e9ecef;
  //   }
  // }
  // /* Chrome, Safari, Edge, Opera */
  // input::-webkit-outer-spin-button,
  // input::-webkit-inner-spin-button {
  //   -webkit-appearance: none;
  //   margin: 0;
  // }

  // /* Firefox */
  // input[type="number"] {
  //   -moz-appearance: textfield;
  // }

  // .vs__dropdown-menu {
  //   min-width: 100%;
  // }
  // .format-v-select {
  //   .vs__selected-options {
  //     .vs__selected {
  //       padding: 5px 0 0 0 !important;
  //     }
  //   }
  // }

  .tab-content, .tab-pane {
    height: 100%;
  }
}
</style>