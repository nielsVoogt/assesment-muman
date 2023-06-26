<template>
  <button type="button" @click="logJSONData">get customer data</button>
  <div>
    {{ customerAppointments }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customerAppointments = ref([])

async function logJSONData() {
  const response = await fetch("http://localhost:3000/appointments?_page=1&_limit=10");
  const jsonData = await response.json();

  console.log(jsonData);

  if (jsonData) {
    customerAppointments.value = jsonData
  }
}
</script>