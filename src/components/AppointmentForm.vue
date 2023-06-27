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
        id="phonenumber"
        v-model="form.customer.phonenumber"
        placeholder="phonenumber"
      />
    </FormGroup>

    <FormGroup :errors="v$.form.reason.$errors" :label="'test'">
      <input
        type="checkbox"
        id="warranty"
        value="warranty"
        v-model="form.reason"
      />
      <label for="warranty">Warranty</label>

      <input
        type="checkbox"
        id="maintenance"
        value="maintenance"
        v-model="form.reason"
      />
      <label for="maintenance">Maintenance</label>

      <input type="checkbox" id="other" value="other" v-model="form.reason" />
      <label for="other">other</label>
    </FormGroup>

    <FormGroup :errors="v$.form.remarks.$errors" :label="'test'">
      <textarea
        id="remarks"
        name="remarks"
        rows="5"
        placeholder="Please do ..."
        v-model="form.remarks"
      ></textarea>
    </FormGroup>

    <FormGroup :errors="v$.form.date.$errors">
      <input type="date" v-model="form.date" @input="getUnavailableSlots" />
    </FormGroup>

    <ul v-if="form.date" class="slot-list">
      <li v-for="slot in allSlots" class="slot-list-item">
        <button
          class="slot-button"
          :disabled="unavailableSlots.find((e) => e === slot)"
        >
          {{ slot }}
        </button>
      </li>
    </ul>
  </form>

  {{ form }}

  <button @click="post">post</button>
</template>

<script>
import moment from "moment";
import { allSlots } from "../allSlots";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import FormGroup from "./FormGroup.vue";

export default {
  components: {
    FormGroup,
  },
  setup() {
    return { v$: useVuelidate(), moment };
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
      selectedTimeSlot: "",
      unavailableSlots: [],
      allSlots,
    };
  },
  methods: {
    async post() {
      const url = `http://localhost:3000/appointments`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(this.form),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      if (response.ok) {
        console.log("feestje!");
      } else {
        // show error
      }
    },

    async getUnavailableSlots() {
      this.unavailableSlots = [];

      const url = `http://localhost:3000/appointments?q=${this.form.date}`;
      const response = await fetch(url);
      const data = await response.json();

      data.forEach((appointment) => {
        const slotTime = moment(appointment.date).format("hh:mm");
        this.unavailableSlots.push(slotTime);
      });
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

<style lang="scss">
// TEMPDUMP
.slot-list {
  margin: 0;
  padding: 0;
  max-width: 500px;
  width: 100%;
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));

  .slot-list-item {
    margin: 0;
    padding: 0;
    text-indent: 0;
    list-style-type: 0;
    list-style: none;

    button {
      width: 100%;

      &:disabled {
        background: red;
      }
    }
  }
}
</style>
