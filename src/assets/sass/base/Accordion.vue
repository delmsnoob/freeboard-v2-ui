<!--
  @USE AS:
  import Accordion from '@/components/base/Accordion'
  const Accordion  = () => import('@/components/base/Accordion')

  components: { Accordion }

  <accordion title="test">
    <p>Lorem ipsum dolor sit amet..</p>
  </accordion>
-->

<template>
  <div
    ref="accordion"
    class="accordion"
    :class="toggle"
    @click="toggleAccordion"
  >
    <div
      ref="accordion-title"
      class="accordion__head"
    >
      <div class="accordion-title">
        <slot name="title"></slot>
      </div>

      <div
        v-if="hasActions"
        class="accordion-action"
      >
        <slot name="action"></slot>
      </div>

      <div class="accordion-arr">
        <i class="ico-arrow-full-down"></i>
      </div>
    </div>

    <transition name="expand">
      <div
        v-show="active"
        ref="accordionBody"
        class="accordion__body"
      >
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Accordion',

  props: {
    title: {
      type: String,
      default: ''
    },

    content: {
      type: String,
      default: ''
    },

    isActive: {
      type: Boolean,
      default: false
    },

    isHtml: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      active: false,
      toggle: ''
    }
  },

  computed: {
    hasActions () {
      return this.$slots.action
    },
  },

  watch: {
    active () {
      let toggle

      if (this.active === false) {
        toggle = ''
      } else {
        toggle = 'is-open'
      }

      this.toggle = toggle
    }
  },

  async mounted () {
    await this.$nextTick()
    this.active = this.isActive
  },

  methods: {
    toggleAccordion (e) {
      if (e.target === this.$refs['accordion-title']) {
        this.active = !this.active
      }

      this.$emit('activate', this.active)
    }
  }
}
</script>
