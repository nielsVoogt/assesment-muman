<template>
  <div class="slot-container">
    <ul v-if="date" class="slot-list">
      <li v-for="slot in slots" class="slot-list-item">
        <button
          type="button"
          class="slot-button"
          :disabled="unavailableSlots.find((e) => e === slot)"
          @click="$emit('selectSlot', slot)"
        >
          {{ slot }}
        </button>
      </li>
    </ul>
    <div v-else>No date selected</div>
  </div>
</template>
<script>
import moment from "moment";

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
      selectedSlot: null,
      unavailableSlots: [],
    };
  },
  setup() {
    const slots = [];

    for (let i = 0; i < 32; i++) {
      const slotTime = moment("09:00", "hh:mm")
        .add(15 * i, "minutes")
        .format("hh:mm");
      slots.push(slotTime);
    }

    return { moment, slots };
  },
  methods: {
    async getUnavailableSlots() {
      this.unavailableSlots = [];
      const date = moment(this.date).format("YYYY-MM-DD");
      const url = `http://localhost:3000/appointments?q=${date}`;
      const response = await fetch(url);
      const data = await response.json();

      data.forEach((appointment) => {
        const slotTime = moment(appointment.date).format("hh:mm");
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

<style lang="scss" scoped>
.slot-list {
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  list-style: none;
  max-width: 330px;
  width: 100%;
  aspect-ratio: 1 / 1;

  .slot-button {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
}

li,
ul {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
