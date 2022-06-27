<template>
  <form>
    <div v-if="show">
      <InputWrap
        v-model="reply.replyContent"
        placeholder="Write a nice reply"
      />
      {{ selectedPost }}
      {{ userId }}
    </div>

    <a @click="toggleReply">
      <span v-if="show">Cancel</span>
      <span v-else>Reply</span>
    </a>
  </form>
</template>

<script>
import InputWrap from '@/components/base/InputWrap'

export default {
  name: 'Reply',

  components: {
    InputWrap
  },

  props: {
    selectedPost: Number,
    userId: Number
  },

  data () {
    return {
      show: false,
      reply: {
        replyContent: null
      }
    }
  },

  methods: {
    toggleReply () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
  form {
    width: 40%;
  }
</style>
