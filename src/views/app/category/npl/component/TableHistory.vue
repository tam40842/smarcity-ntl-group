<template>
  <div>
    <b-table
      id="npl-table-history-action"
      class="npl-table-history-action"
      :fields="fields"
      :items="items"
      bordered
      responsive
      show-empty
      head-variant="light"
    >
      <template #cell(ActionTypeName)="row">
        <div class="custom-badge" :style="{color: row.item.ActionColor, borderColor: row.item.ActionColor}">
          {{ row.item.ActionTypeName }}
        </div>
      </template>
    </b-table>
    <!-- <b-pagination
      align="center"
      :total-rows="totalRows"
      :per-page="perPage"
      v-model="currentPage"
    >
      <template v-slot:next-text>
        <i class="simple-icon-arrow-right" />
      </template>
      <template v-slot:prev-text>
        <i class="simple-icon-arrow-left" />
      </template>
      <template v-slot:first-text>
        <i class="simple-icon-control-start" />
      </template>
      <template v-slot:last-text>
        <i class="simple-icon-control-end" />
      </template>
    </b-pagination> -->
  </div>
</template>

<script>
export default {
  props: ["fields", "items"],
  data() {
    return {
      totalRows: this.items.length,
      currentPage: 1,
      perPage: 10,
    };
  },
};
</script>

<style lang="scss" scoped>
  .custom-badge {
    display: inline-block;
    border: 1px solid;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;

    text-transform: uppercase;
    text-align: center;
  }
</style>
