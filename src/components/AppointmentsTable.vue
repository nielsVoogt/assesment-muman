<template>
  <vue-good-table
    mode="remote"
    v-on:page-change="onPageChange"
    v-on:per-page-change="onPerPageChange"
    :totalRows="totalRecords"
    :pagination-options="{
      enabled: true,
    }"
    :sort-options="{
      enabled: false,
    }"
    :rows="rows"
    :columns="columns"
  >
    <template #table-row="props">
      <div v-if="props.column.field == 'date'">
        {{ formatDate(props.row.date, "DD-MM-YYYY") }}
      </div>
      <div v-if="props.column.field == 'time'">
        {{ formatDate(props.row.date, "HH:mm") }}
      </div>
      <div v-if="props.column.field == 'customer'">
        {{ props.row.customer.firstName }}
        {{ props.row.customer.lastName }}
        <div>
          {{ props.row.customer.phone }}
        </div>
      </div>
      <div v-if="props.column.field == 'reason'">
        <span
          v-for="reason in props.row.reason"
          :class="['label', `label--${reason}`]"
        >
          {{ reason }}
        </span>
      </div>
    </template>
  </vue-good-table>
</template>

<script>
import formatDateMixin from "@/mixins/formatDate.js";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";

export default {
  name: "AppointmentsTable",
  components: {
    VueGoodTable,
  },
  mixins: [formatDateMixin],
  data() {
    return {
      columns: [
        {
          label: "Date",
          field: "date",
        },
        {
          label: "Time",
          field: "time",
        },
        {
          label: "Customer",
          field: "customer",
        },
        {
          label: "Reason",
          field: "reason",
        },
        {
          label: "Remarks",
          field: "remarks",
        },
      ],
      rows: [],
      totalRecords: 0,
      serverParams: {
        columnFilters: {},
        sort: {
          field: "date",
          type: "asc",
        },
        page: 1,
        perPage: 10,
      },
    };
  },
  methods: {
    onPageChange(params) {
      this.getAppointments(params.currentPage, params.currentPerPage);
    },
    onPerPageChange(params) {
      this.getAppointments(params.currentPage, params.currentPerPage);
    },
    async getAppointments(page, limit) {
      this.isLoading = true;
      const url = `http://localhost:3000/appointments?_page=${page}&_limit=${limit}`;
      const res = await fetch(url);
      const data = await res.json();

      this.rows = data;
      this.totalRecords = res.headers.get("x-Total-Count");
      this.isLoading = false;
    },
  },
  mounted() {
    this.getAppointments(this.serverParams.page, this.serverParams.perPage);
  },
};
</script>
