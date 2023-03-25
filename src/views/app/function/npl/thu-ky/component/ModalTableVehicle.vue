<template>
  <b-modal
    id="modal-table-vehicle"
    :title="$t('modal.add')"
    body-class="body-modal-add"
    size="lg"
    cancel-variant="outline-danger"
    :ok-title="$t('modal.change')"
    :cancel-title="$t('modal.cancel')"
    @ok="handleOk"
    @hidden="hiddenModal"
  >
    <b-table
      id="npl-table-basic-form"
      class="npl-table-basic-form border-bottom"
      :fields="modifyFields"
      :items="dataTable"
      bordered
      responsive
      show-empty
      head-variant="light"
      selectable
      select-mode="multi"
      sticky-header
      style="margin-top: -1px; max-height: calc(100vh - 300px)"
      :no-border-collapse="true"
      @row-selected="rowSelected"
    >
      <template #empty>
        <div class="text-center font-italic text-muted">
          {{ $t("data.non-data") }}
        </div>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
export default {
  props: ["show", "fieldsTable", "dataTable"],
  data() {
    return {
      vehicleSelected: []
    };
  },
  computed: {
    modifyFields() {
      if (this.fieldsTable.length > 0) {
        const arr = [...this.fieldsTable]
        const index = arr.findIndex(
          (item) => item.key.toUpperCase() === "ACTION"
        );
        arr.splice(index, 1)
        return [...arr];
      }
      return [];
    },
  },
  watch: {
    show(newVal) {
      if(newVal) {
        this.$bvModal.show('modal-table-vehicle')
      }
      else {
        this.$bvModal.hide('modal-table-vehicle')
      }
    }
  },
  methods: {
    rowSelected(row) {
      this.vehicleSelected = row
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      if(this.vehicleSelected.length === 0) {
        return this.showNotify(
          "warning",
          this.$t("toast.message"),
          this.$t("npl.toast.no-choose-vehicle")
        )
      }
      this.$emit('add', this.vehicleSelected)
    },
    hiddenModal() {
      this.vehicleSelected = []
      this.$emit('hidden')
    },
    showNotify(type, titleMessage, message) {
      this.$notify(type, titleMessage, message, {
        duration: 3000,
        permanent: false,
      });
    },
  },
};
</script>
