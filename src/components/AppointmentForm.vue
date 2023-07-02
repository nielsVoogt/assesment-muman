<template>
  <form class="appointment-form" @submit.prevent="onSubmit">
    <FormGroup
      :errors="v$.form.customer.firstName.$errors"
      :label="'First name'"
    >
      <input
        class="form-control"
        type="text"
        v-model="form.customer.firstName"
        placeholder="Your firstname"
        @blur="v$.form.customer.firstName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.lastName.$errors" :label="'Last name'">
      <input
        class="form-control"
        type="text"
        v-model="form.customer.lastName"
        placeholder="Your lastname"
        @blur="v$.form.customer.lastName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.phone.$errors" :label="'Phonenumber'">
      <input
        class="form-control"
        type="tel"
        v-model="form.customer.phone"
        placeholder="Your phonenumber"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.reason.$errors" :label="'Reason'">
      <label class="form-checkbox">
        <input type="checkbox" value="warranty" v-model="form.reason" />
        <span class="form-checkbox-border"></span>
        Warranty
      </label>

      <label class="form-checkbox">
        <input type="checkbox" value="maintenance" v-model="form.reason" />
        <span class="form-checkbox-border"></span>
        Maintenance
      </label>

      <label class="form-checkbox">
        <input type="checkbox" value="other" v-model="form.reason" />
        <span class="form-checkbox-border"></span>
        Other
      </label>
    </FormGroup>

    <FormGroup :errors="false" :label="'Remarks'">
      <textarea
        class="form-control"
        name="remarks"
        rows="5"
        placeholder="Please do ..."
        v-model="form.remarks"
      ></textarea>
    </FormGroup>

    <FormGroup :errors="v$.form.date.$errors" :label="'Date'">
      <DatePicker v-model="form.date">
        <template #default="{ togglePopover }">
          <div @click="togglePopover" class="form-datepicker" tabindex="0">
            <span>
              {{
                form.date
                  ? formatDate(form.date, "DD-MM-YYYY")
                  : "Select a date"
              }}
            </span>
            <img src="@/assets/calendar.svg?url" />
          </div>
        </template>
      </DatePicker>
    </FormGroup>
    <FormGroup
      v-if="form.date"
      :errors="v$.form.time.$errors"
      :label="'Select a timeslot'"
    >
      <TimeSlots :date="form.date" @select-slot="setTime" />
    </FormGroup>

    <button class="button" type="submit" @click="post" :disabled="disabled">
      <span> Save your date and timeslot </span>
    </button>
  </form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import TimeSlots from "./TimeSlots.vue";
import FormGroup from "./FormGroup.vue";

import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";

import moment from "moment";
import formatDateMixin from "@/mixins/formatDate.js";

export default {
  name: "AppointmentForm",
  components: {
    FormGroup,
    TimeSlots,
    Calendar,
    DatePicker,
  },
  mixins: [formatDateMixin],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      disabled: false,
      form: {
        customer: {
          firstName: "",
          lastName: "",
          phone: "",
        },
        date: null,
        time: null,
        reason: [],
        remarks: "",
      },
    };
  },
  methods: {
    async checkDate(dateTime) {
      const url = `http://localhost:3000/appointments?date=${dateTime}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const data = await res.json();
      return data.length === 0;
    },
    async setAppointment(payload) {
      const url = `http://localhost:3000/appointments`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      return res;
    },
    async onSubmit() {
      this.disabled = true;
      // Validate form
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const { time, date, ...payload } = this.form;

      // Combine date and time
      const d = moment(date, "YYYY-MM-DD");
      const t = moment(time, "HH:mm:ss");
      const dateTime = `${d.format("YYYY-MM-DD")}T${t.format("HH:mm:ss")}Z`;

      // Add to payload object
      payload.date = dateTime;

      // Check if dateTime is available
      const dateAvailable = await this.checkDate(dateTime);
      if (!dateAvailable) {
        alert(`Deze combinatie datum/tijd is al gekozen door iemand anders`);
        this.form.date = null;
        this.form.time = null;
        this.disabled = false;
        return;
      }

      const res = await this.setAppointment(payload);
      res.ok
        ? alert(`Afspraak om ${d.format("YYYY-MM-DD")} ${t.format("HH:mm:ss")}`)
        : alert(`Er is iets mis gegaan`);

      this.disabled = false;
    },
    setTime(time) {
      this.form.time = time;
    },
  },
  validations() {
    return {
      form: {
        customer: {
          firstName: { required },
          lastName: { required },
          phone: { required },
        },
        reason: { required },
        date: { required },
        time: { required },
      },
    };
  },
};
</script>
