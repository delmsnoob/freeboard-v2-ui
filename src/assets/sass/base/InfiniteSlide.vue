<template>
  <div
    class="slider2"
    ref="parent"
  >
    <slot name="slide-items"></slot>
  </div>
</template>

<script>
import slide from '@/assets/js/mixins/slide'

export default {
  name: 'InfiniteSlide',

  mixins: [
    slide
  ],

  data () {
    return  {
      direction: 'v',
      duration: 4000,
      transition: 2
    }
  },

  props: {
    items: [Array],
    options: [Object]
  },

  watch: {
    async items (e) {
      if (e.length) {
        await this.$nextTick()
        this.clear()
        this.init()
        this.animate()
      }
    }
  },

  mounted () {
    this.direction = this.options.direction
    this.duration = this.options.duration
    this.transition = this.options.transition
  }
}
</script>

<style type="text/css" scoped>
  .slider2 {
    width: 100%;
    height: 100%;
  }

  .with-animation {
    transition: all 2s ease;
  }
</style>
