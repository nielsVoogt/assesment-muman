<template>
  <ul class="slot-list">
    <li v-for="slot in slots" class="slot-list-item">
      <label class="slot-select">
        <input
          type="radio"
          :value="slot"
          name="slots"
          @click="$emit('selectSlot', slot)"
          :disabled="unavailableSlots.find((e) => e === slot)"
        />
        <span class="slot-time">
          {{ slot }}
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import moment from "moment";

const slots = [];
for (let i = 0; i < 32; i++) {
  const slotTime = moment("09:00", "HH:mm")
    .add(15 * i, "minutes")
    .format("HH:mm");
  slots.push(slotTime);
}

export default {
  name: "TimeSlots",
  props: {
    date: {
      type: [Date, null],
      required: true,
    },
  },
  data() {
    return {
      unavailableSlots: [],
      slots,
    };
  },
  methods: {
    async getUnavailableSlots() {
      this.unavailableSlots = [];

      const date = moment(this.date).format("YYYY-MM-DD");
      const url = `http://localhost:3000/appointments?q=${date}`;

      const response = await fetch(url);
      const data = await response.json();

      data.forEach((appointment) => {
        const slotTime = moment(appointment.date).format("HH:mm");
        this.unavailableSlots.push(slotTime);
      });
    },
  },
  watch: {
    date() {
      this.getUnavailableSlots();
    },
  },
};
</script>
