<template>
  <div
    ref="form-list-layer"
    class="form-list-layer"
    :style="{ maxWidth, textAlign }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FormListLayer',

  props: {
    maxWidth: {
      type: [String, Number],
      default: ''
    },

    position: {
      type: String,
      default: 'center'
    },

    textAlign: {
      type: String,
      default: ''
    }
  },

  mounted () {
    if (this.position === 'center') {
      this.$refs['form-list-layer'].style.margin = 'auto'
    }
  }
}
</script>
