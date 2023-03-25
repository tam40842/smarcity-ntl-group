<template>
  <div class="main">
    <b-table
      id="basic-table-npl"
      class="basic-table-npl"
      bordered
      responsive
      show-empty
      head-variant="light"
      selectable
      :fields="fields"
      :items="items"
      :select-mode="'single'"
      :current-page="disablePagination == false ? currentPage : null"
      :per-page="disablePagination == false ? perPage : null"
      @row-dblclicked="emitDbClick"
      @row-clicked="emitClick"
    >
      <template slot="top-row" slot-scope>
        <td v-for="field in fields" :key="field.ID">
          <b-form-select
            v-if="optionBlockStatus && field.typeCol.toUpperCase() == 'BIT'"
            v-model="valueBlock"
            :options="optionBlockStatus"
            class="search-fselect"
             @input="handleSearchByVSelect(field.key, $event)"
          />
          <b-form-input
            v-else
            placeholder="Nhập tìm.."
            style="height: 24px"
            @input="handleSearchInput(field.typeCol,field.key, $event)"
          />
        </td>
      </template>
      <template v-for="(field, index) in fields" #[`cell(${field.key})`]="row">
        <template v-if="field.typeCol.toUpperCase() == 'DATE'">
          <span :key="index" style="color: #858585">
            {{ convertDate(row.item[`${field.key}`]) }}
          </span>
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'DATETIME'">
          <span :key="index" style="color: #858585">
            {{ convertDateTime(row.item[`${field.key}`]) }}
          </span>
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'MONEY'">
          <span :key="index">
            {{ convertFloat(row.item[`${field.key}`]) }}
          </span>
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'STATUSCOLOR'">
          <StatusColor
            :key="index"
            :color="row.item[`${field.key}Color`]"
            :label="row.item[`${field.key}`]"
            :showCircle="false"
          />
        </template>
        <template v-else-if="field.typeCol.toUpperCase() == 'BIT'">
          <StatusColor
            v-if="row.item[`${field.key}`] == 1"
            :key="index"
            :color="'#dc3545'"
            :label="`Đã khóa`"
            :showCircle="false"
          />
          <StatusColor
            v-else
            :key="index"
            :color="'#2a93d5'"
            :label="`Chưa khóa`"
            :showCircle="false"
          />
        </template>
        <template v-else>
          <div :key="index">
            {{ row.item[`${field.key}`] }}
          </div>
        </template>
      </template>
      <template #empty>
        <div class="font-italic text-muted">
          {{ $t("data.non-data") }}
        </div>
      </template>
    </b-table>
    <b-pagination
      v-if="disablePagination == false"
      v-model="currentPage"
      align="center"
      :total-rows="items.length"
      :per-page="perPage"
    >
      <template #next-text>
        <i class="simple-icon-arrow-right" />
      </template>
      <template #prev-text>
        <i class="simple-icon-arrow-left" />
      </template>
      <template #first-text>
        <i class="simple-icon-control-start" />
      </template>
      <template #last-text>
        <i class="simple-icon-control-end" />
      </template>
    </b-pagination>
  </div>
</template>

<script>
import handling from "@/constants/handling";
import StatusColor from "@/components/Badges/StatusColor.vue";
import { reactive, ref, toRef } from "vue";
import useSalaryDriver from "../../hooks/useDriverSalary";
import moment from 'moment';

export default {
  components: {
    StatusColor,
  },
  props: {
    fields: { type: Array, default: null },
    items: { type: Array, default: null },
    optionBlockStatus: { type: Array, default: null },
    disablePagination: { type: Boolean, default: false },
  },

  setup(props, { emit }) {
    const formFind = reactive({
      FactorID: "COSTDRIVER_INCREASESALARY",
      EntryID: "AJ_INCREASESALARY",
      ListSearch: [],
    });
    const { handleSearch } = useSalaryDriver();
    const valueBlock = ref(-1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const emitClick = (item, index) => {
      emit("returnClick", item, index);
    };
    const emitDbClick = (item, index) => {
      emit("returnDbClick", item, index);
    };
    return {
      currentPage,
      perPage,
      emitClick,
      emitDbClick,
      formFind,
      valueBlock, //-1(all),0(chưa khóa),1(đã khóa)
      handleSearch,
      bgFormSelect:'none',
      colorFormSelect:'#3a3a3a',
      bdFormSelect:'#ced4da'
    };
  },
  beforeMount(){
    const typeTheme = localStorage.getItem('theme_selected_color').split('.')[0]
     if(typeTheme=='dark'){
         this.bgFormSelect='#242424'
         this.colorFormSelect='#8f8f8f'
         this.bdFormSelect='#484848'
      }
  },
  methods: {
    handleSearchInput(type,field, value) {
      if (!value) {
        this.formFind.ListSearch = this.formFind.ListSearch.filter(
          (e) => e.Name != field
        );
      } else {
        if(type.toUpperCase()=='DATE'){
          value = moment(value,'DD/MM/YYYY').format("YYYY-MM-DD")
        }else{
          value=value.toString()
        }
        let obj = {
          Name: field,
          Operator:type.toUpperCase()=='MONEY' ? '=' : "like",
          Param1: value,
          Param2: "",
        };
        let res = this.formFind.ListSearch.find((e) => e.Name == field);
        if (res) {
          res.Param1 = value;
        } else {
          this.formFind.ListSearch.push(obj);
        }
      }
      this.search();
    },
    handleSearchByVSelect(field, value) {
      if (value == -1) {
        this.formFind.ListSearch = this.formFind.ListSearch.filter(
          (e) => e.Name != field
        );
      } else {
        let obj = {
          Name: field,
          Operator: "=",
          Param1: value.toString(),
          Param2: "",
        };
        let res = this.formFind.ListSearch.find((e) => e.Name == field);
        if (res) {
          res.Param1 = value.toString();
        } else {
          this.formFind.ListSearch.push(obj);
        }
      }
      this.search();
    },
    convertDate(string) {
      return handling.convertDateNPL(string);
    },
    convertDateTime(string) {
      return handling.convertDateTime(string);
    },
    convertFloat(n) {
      return Number(n)
        .toFixed()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async search() {
      let result = await this.handleSearch(this.formFind);
      this.$emit("returnListData", result);
    },
  },
};
</script>

<style lang="scss">
.basic-table-npl .table th {
  white-space: nowrap;
}
</style>
<style>
.search-fselect{
  min-width: 90px;
  height: 24px;
  padding: 1px;
  padding-left: 5px;
  font-size: 12px;
  font-weight: 530;
  color: v-bind(colorFormSelect);
  background: v-bind(bgFormSelect);
  border: 1px solid v-bind(bdFormSelect);
}
</style>