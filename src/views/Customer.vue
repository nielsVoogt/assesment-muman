<template>
  <div class="view-customer">
    <div class="view-customer-heading">
      <h1>Don’t worry!</h1>
      <h2>We’ll have you back on your wheels in no time</h2>
    </div>
    <div class="form-container">
      <p>
        All we need are a few details, please fill out the form to plan your
        appointment
      </p>
      <AppointmentForm />
    </div>
  </div>
</template>

<script setup>
import AppointmentForm from "../components/AppointmentForm.vue";
</script>
