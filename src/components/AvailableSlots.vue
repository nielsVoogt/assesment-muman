<template>
  <ul>
    <li v-for="slot in allSlots">
      <button :disabled="unavailableSlots.find((e) => e === slot)">
        {{ slot }}
      </button>
    </li>
  </ul>
</template>

<script>
import { allSlots } from "../allSlots";

export default {
  name: "AvailableSlots",
  props: {
    errors: {
      type: [Array],
      required: false,
    },
    label: {
      type: [String],
      required: false,
    },
  },
};
</script>
