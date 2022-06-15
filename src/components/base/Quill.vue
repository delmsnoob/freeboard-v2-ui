<!--
  @USE AS:
  import Quill from '@/components/base/Quill'
  const Quill  = () => import('@/components/base/Quill')

  components: { Quill }

  <Quill
    ref="title"
    v-model="data"
    type="title"
    :value="data"
  />
-->

<template>
  <quill-editor
    ref="quill"
    v-model="quillData"
    v-bind="$attrs"
    :options="defaultOptions"
    v-on="$listeners"
  />
</template>

<script>

// components
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Quill',

  components: {
    quillEditor
  },

  inheritAttrs: false,

  model: {
    prop: 'value'
  },

  props: {
    value: {
      type: [
        String,
        Number
      ],
      default: null
    },

    placeholder: {
      type: [String],
      default: null
    },

    type: {
      type: [String],
      default: 'content'
    },

    options: {
      type: [Object, Array],
      default: null
    },

    focus: {
      type: [Boolean],
      default: false
    }
  },

  data () {
    return {
      quillData: '',
      defaultOptions: {
        placeholder: "What's on our mind...",
        modules: {
          toolbar: [
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [
              { 'list': 'ordered' },
              { 'list': 'bullet' }
            ],
            [
              { 'indent': '-1' },
              { 'indent': '+1' }
            ],
            [
              { 'direction': 'rtl' }
            ],
            [
              { 'color': [] },
              { 'background': [] }
            ]
          ],
          keyboard: {
            bindings: {
              tab: {
                key: 9,
                handler (range, context) {
                  return true
                }
              }
            }
          }
        }
      }
    }
  },

  watch: {
    value (val) {
      this.quillData = this.value
    },

    quillData (val) {
      this.$emit('input', val)
    },

    placeholder (val) {
      this.defaultOptions.placeholder = val
    }
  },

  created () {
    const placeholder = this.placeholder

    if (this.options) {
      this.defaultOptions = this.options
    }

    if (!placeholder) {
      if (this.type === 'content') {
        this.defaultOptions.placeholder = "What's on your mind..."
      }

      if (this.type === 'title') {
        this.defaultOptions.placeholder = 'Title here...'
      }
    }

    if (placeholder) {
      this.defaultOptions.placeholder = this.placeholder
    }

    if (this.value) {
      this.quillData = this.value
    }
  },

  mounted () {
    const quill = this.$refs['quill'].quill
    const text = quill.getText()

    const load = setInterval(() => {
      if (this.focus) {
        quill.focus()

        if (text && text.length) {
          quill.setSelection(text.length, 0)
        }
      }
    }, 10)

    setTimeout(() => {
      clearInterval(load)
    }, 100)
  }
}
</script>
