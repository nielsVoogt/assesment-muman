<template>
  <p>Appointment form</p>
  <form class="appointment-form">
    <FormGroup
      :errors="v$.form.customer.firstName.$errors"
      :label="'First name'"
    >
      <input
        class="form-control"
        type="text"
        v-model="form.customer.firstName"
        placeholder="firstName"
        @blur="v$.form.customer.firstName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.lastName.$errors" :label="'Last name'">
      <input
        class="form-control"
        type="text"
        v-model="form.customer.lastName"
        placeholder="lastName"
        @blur="v$.form.customer.lastName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.phonenumber.$errors" :label="'test'">
      <input
        class="form-control"
        type="tel"
        v-model="form.customer.phonenumber"
        placeholder="phonenumber"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.reason.$errors" :label="'test'">
      <label class="form-checkbox">
        <input type="checkbox" value="warranty" v-model="form.reason" />
        <span>Warranty</span>
      </label>

      <label class="form-checkbox">
        <input type="checkbox" value="maintenance" v-model="form.reason" />
        <span>Maintenance</span>
      </label>

      <label class="form-checkbox">
        <input type="checkbox" id="other" value="other" v-model="form.reason" />
        <span>Other</span>
      </label>
    </FormGroup>

    <FormGroup :errors="v$.form.remarks.$errors" :label="'test'">
      <textarea
        class="form-control"
        name="remarks"
        rows="5"
        placeholder="Please do ..."
        v-model="form.remarks"
      ></textarea>
    </FormGroup>

    <FormGroup :errors="v$.form.date.$errors">
      <DatePicker v-model="form.date">
        <template #default="{ togglePopover }">
          <div @click="togglePopover" class="form-datepicker">
            <span>
              {{
                form.date
                  ? Intl.DateTimeFormat("nl-NL").format(form.date)
                  : "Select a date"
              }}
            </span>
            <img src="@/assets/calendar.svg?url" />
          </div>
        </template>
      </DatePicker>
    </FormGroup>

    <TimeSlots :date="form.date" @select-slot="setDateTimeSlot" />
  </form>

  {{ form }}

  <button @click="post">post</button>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import TimeSlots from "./TimeSlots.vue";
import FormGroup from "./FormGroup.vue";

import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";

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
        reason: [],
        remarks: "",
      },
    };
  },
  methods: {
    async post() {
      const url = `http://localhost:3000/appointments`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(this.form),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      if (res.ok) {
        console.log("feestje!");
      } else {
        console.log("paniek!");
      }
    },

    setDateTimeSlot(time) {
      console.log("I selected", time);
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
        remarks: { required },
        date: { required },
      },
    };
  },
};
</script>
