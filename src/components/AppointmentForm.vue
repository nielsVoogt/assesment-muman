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

    <FormGroup
      :errors="v$.form.customer.phonenumber.$errors"
      :label="'Phonenumber'"
    >
      <input
        class="form-control"
        type="tel"
        v-model="form.customer.phonenumber"
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
              {{ form.date ? formattedDate : "Select a date" }}
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
    {{ v$.form.invalid }}
    <button class="button" type="submit" @click="post">
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

export default {
  components: {
    FormGroup,
    TimeSlots,
    Calendar,
    DatePicker,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
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
  computed: {
    formattedDate: function () {
      return moment(this.form.date).format("DD-MM-YYYY");
    },
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const { time, date, ...payload } = this.form;

      // Combine date and time
      const dateTime = moment(date + time, "YYYY-MM-DDTHH:mm:ss.SSSS[Z]");

      // Add to payload object
      payload.date = dateTime;

      const url = `http://localhost:3000/appointments`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      if (res.ok) {
        console.log("feestje!");
      } else {
        console.log("paniek!");
      }
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
          phonenumber: { required },
        },
        reason: { required },
        date: { required },
        time: { required },
      },
    };
  },
};
</script>
