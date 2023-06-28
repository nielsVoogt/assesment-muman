<template>
  <p>Appointment form</p>
  <form>
    <FormGroup :errors="v$.form.customer.firstName.$errors" :label="'test'">
      <input
        type="text"
        id="firstName"
        v-model="form.customer.firstName"
        placeholder="firstName"
        @blur="v$.form.customer.firstName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.lastName.$errors" :label="'test'">
      <input
        type="text"
        id="lastName"
        v-model="form.customer.lastName"
        placeholder="lastName"
        @blur="v$.form.customer.lastName.$touch"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.customer.phonenumber.$errors" :label="'test'">
      <input
        type="text"
        v-model="form.customer.phonenumber"
        placeholder="phonenumber"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.reason.$errors" :label="'test'">
      <input type="checkbox" value="warranty" v-model="form.reason" />
      <label for="warranty">Warranty</label>

      <input type="checkbox" value="maintenance" v-model="form.reason" />
      <label for="maintenance">Maintenance</label>

      <input type="checkbox" id="other" value="other" v-model="form.reason" />
      <label for="other">other</label>
    </FormGroup>

    <FormGroup :errors="v$.form.remarks.$errors" :label="'test'">
      <textarea
        name="remarks"
        rows="5"
        placeholder="Please do ..."
        v-model="form.remarks"
      ></textarea>
    </FormGroup>

    <FormGroup :errors="v$.form.date.$errors">
      <input type="date" v-model="selectedDate" />
    </FormGroup>

    <TimeSlots :selected-date="selectedDate" @select-slot="setDateTimeSlot" />
  </form>

  {{ form }}

  <button @click="post">post</button>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import TimeSlots from "./TimeSlots.vue";
import FormGroup from "./FormGroup.vue";

export default {
  components: {
    FormGroup,
    TimeSlots,
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
      selectedDate: false,
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
