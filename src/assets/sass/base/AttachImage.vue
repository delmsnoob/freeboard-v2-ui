<!--
  @USE AS:
  import AttachImage from '@/components/base/AttachImage'
  const AttachImage  = () => import('@/components/base/AttachImage')

  components: { AttachImage }

  data () {
    return {
      attachImage: {
        image: null,
        existing: null
      }
    }
  }

  <attach-image
    name="attach-image"
    ref="attach-image"
    :image="attachImage.existing"
    @setImage="attachImage.image = $event"
    @removeImage="attachImage.image = $event"
  />
-->

<template>
  <div
    class="attach-image"
    ref="attach-image"
  >
    <div class="attach-image__inner">
      <input
        :disabled="disabled"
        type="file"
        :name="name"
        :id="name"
        ref="attach-image-file"
        class="attach-image__file"
        @change="setImage"
      />

      <label
        class="attach-image__lbl"
        :for="name"
      >
        <template v-if="!prevImage">
          <template v-if="showImage">
            <img
              class="attach-image__preview"
              :src="fileImage"
            />
          </template>

          <template v-else>
            <i class="ico-no-image"></i>
            <span>
              {{ translate('attach image') }}
            </span>
          </template>
        </template>

        <template v-else>
          <img
            class="attach-image__preview"
            :src="prevImage"
            v-if="!fileImage"
          />

          <img
            class="attach-image__preview"
            :src="fileImage"
            v-else
          />
        </template>
      </label>

      <button
        class="btn-delete"
        type="button"
        v-if="showImage && showRemove"
        @click="clearImage()"
      >
        <i class="ico-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
// translation
import { translations } from '@/assets/js/translations/base/attach-image'

export default {
  name: 'AttachImage',

  props: {
    image: {
      type: [String, Object, Array]
    },

    showRemove: {
      type: Boolean,
      default: true
    },

    name: {
      type: String,
      default: 'attach-image'
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      translations,
      showImage: false,
      file: null,
      fileImage: null,
      prevImage: null
    }
  },

  async mounted () {
    await this.$nextTick()

    this.applyAttach()
    this.prevImage = this.image
  },

  methods: {
    applyAttach () {
      let attachImageFile = this.$refs['attach-image-file']
      let attachImage = this.$refs['attach-image']

      var xhr = new XMLHttpRequest()
      if (xhr.upload) {
        attachImage.addEventListener("dragover", this.fileDragHover, false)
        attachImage.addEventListener("dragleave", this.fileDragHover, false)
        attachImage.addEventListener("drop", this.fileSelectHandler, false)
      }
    },

    fileSelectHandler (e) {
      this.fileDragHover(e)
      this.setImage(e)
    },

    fileDragHover (e) {
      e.stopPropagation()
      e.preventDefault()
    },

    setImage (e) {
      const files = e.target.files || e.dataTransfer.files

      if (files && files.length !== 0) {
        this.showImage = true

        let fileName = files[0].name
        let fileReader = new FileReader()

        this.file = files
        this.$emit('setImage', this.file)

        fileReader.onload = (event) => {
          this.fileImage = event.target.result
        }

        fileReader.readAsDataURL(files[0])
      } else {
        this.showImage = false
      }
    },

    clearImage () {
      this.showImage = false
      this.fileImage = null
      this.file = null

      if (this.prevImage) {
        this.fileImage = this.prevImage
      } else {
        this.fileImage = null
      }

      this.$emit('removeImage', this.file)
    }
  }
}
</script>
