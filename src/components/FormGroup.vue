<template>
  <div :class="['form-group', { 'form-group--error': errors.length }]">
    <label class="form-group-label">{{ label }}</label>
    <slot></slot>
    <div class="input-errors" v-for="error of errors" :key="error.$uid">
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormGroup",
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

<style scoped lang="scss">
.form-group {
  margin-bottom: 1rem;

  label {
    margin-bottom: 0.25rem;
    display: block;
  }
}
</style>
