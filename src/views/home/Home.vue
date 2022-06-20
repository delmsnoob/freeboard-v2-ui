<template>
  <div class="home-inner">
    <div class="main__toolbar">
      <InputWrap
        v-model="searchFor"
        placeholder="Enter keywords here..."
        class="search-keyword"
      />

      <search-bar
        v-model="searchParams.main"
        :translations="translations"
        :config="searchbarConfig"
        @search="handleSearch($event)"
      >
        <template #actions>
          <button
            class="btn-default"
            @click="showModal"
          >
            <span>
              Add Post
            </span>
          </button>

          <button
            class="btn-default"
            @click="logout"
          >
            <span>
              Logout
            </span>
          </button>
        </template>
      </search-bar>
    </div>

    <div class="main__contents">
      <form-list @submit.prevent="">
        <!-- <template #header>
          <form-list-layer label="">
            <h2 class="freeboard-header">
              Welcome to Freeboard {{ postDetails.userId }}
            </h2>
            <h3>{{ count }} posts</h3>
          </form-list-layer>
        </template> -->

        <template #body>
          <!-- <form-list-layer>
            <Quill
              ref="content"
              v-model="postDetails.postContent"
            />
          </form-list-layer>

          <div class="post-action-wrapper">
            <button
              class="btn-default post-action__btn"
              @click="sendPost"
            >
              <span>
                POST
              </span>
            </button>

            <button
              class="btn-default post-action__btn"
              @click="clear"
            >
              <span>
                CANCEL
              </span>
            </button>
          </div>
 -->
          <div class="posts-body">
            <form-list-layer
              v-for="(item, key) in posts"
              :key="key"
              class="post-wrapper"
            >
              <div class="post-header">
                @{{ item.user_id }}
                <timeago
                  :datetime="item.created_at"
                  :auto-update="60"
                />
                <h4>June 20, 2022</h4>
              </div>
              <div class="post-body">
                <div v-html="item.post_content"></div>
              </div>
              <div
                v-show="showInputReply"
                class="reply-section"
              >
                write a nice reply
              </div>

              <div class="post-footer">
                <a @click="openReply(key)">Reply</a>
              </div>
            </form-list-layer>
          </div>
        </template>

        <template #footer>
          <!-- <button class="btn-default">
            <span>
              asdas
            </span>
          </button> -->
        </template>
      </form-list>
    </div>

    <modal
      v-if="modals.addPost.$status"
      v-model="modals.addPost.$status"
      :title="('Add new post')"
      class="add-post-modal"
    >
      <div class="main__contents">
        <form-list>
          <template slot="body">
            <QuillPosts
              ref="content"
              v-model="modals.addPost.data.content"
              type="content"
              :placeholder="translate('Write a nice post here...')"
              :value="modals.addPost.data.content"
            />
          </template>
        </form-list>
      </div>

      <template slot="footer">
        <button
          class="btn-save"
          @click="sendPost"
        >
          <i class="ico-save"> </i>

          <span>
            {{ translate("save") }}
          </span>
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
// vuex || sockets
import { mapActions, mapState } from 'vuex'

// translations || dictionary
import translations from '@/assets/js/translations/common/home'

// components
import { FormList, FormListLayer, FormListItem } from '@/components/base/form-list'
import swal from '@/assets/js/mixins/base/Swal'

// mixins
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
// lib
const _isEmpty = require('lodash/isEmpty')
const _isUndefined = require('lodash/isUndefined')

const SearchBar = () => import('@/components/base/SearchBar')
const TextArea = () => import('@/components/base/TextArea')
const DateTimePicker = () => import('@/components/base/DateTimePicker')
const TagInput = () => import('@/components/base/TagInput')
const QuillPosts = () => import('@/components/base/QuillPosts')
const AttachImage = () => import('@/components/base/AttachImage')
const Tooltip = () => import('@/components/base/Tooltip')

export default {
  name: 'Home',

  components: {
    SearchBar,
    TextArea,
    DateTimePicker,
    QuillPosts,
    FormList,
    FormListLayer,
    FormListItem,
    TagInput,
    AttachImage,
    Tooltip
  },

  mixins: [swal],

  data () {
    const params = Object.assign({
      page: 1,
      rows: '',
      filter_by: '',
      q: '',
      sort_by: 'order',
      sort: 'desc',
      status: 'all'
    }, this.$route.query
    )
    return {
      translations,
      params,

      modals: {
        addPost: new this.ModalData({
          content: ''
        })
      },

      errors: {
        url: null,
        all: null
      },

      searchFor: null,

      attachImage: {
        // image: require('@/assets/images/favicon/default.png'),
        image: null,
        existing: null
      },

      userId: null,

      showInputReply: false,

      searchParams: {
        main: this.$_defaultSearchParams()
      },

      searchbarConfig: {
        hasRefresh: true,
        hasClear: true,
        dateConfig: {
          dateBy: [
            {
              value: 'created_at',
              display: 'created date'
            },
            {
              value: 'updated_at',
              display: 'updated date'
            },
            {
              value: 'deleted_at',
              display: 'deleted date'
            }
          ],
          dateType: 'datetime',
          dateRange: true
        },
        filterBy: [
          {
            value: 'login_id',
            display: 'login id'
          },
          {
            value: 'login_name',
            display: 'login name'
          }
        ]
      },

      status: null
    }
  },

  computed: {
    ...mapState('posts', [
      'posts',
      'count'
    ])
  },

  async mounted () {
    await this.fetchUserId()
    await this.handleFetchPosts()
  },

  methods: {
    ...mapActions('posts', [
      'createPost',
      'fetchPost'
    ]),

    async handleSearch (data) {
      const path = '/'
      const query = data ? data.query : this.searchParams

      this.$router.push({ path, query: query })

      if (data && data.type === 'clear') {
        await this.$nextTick()
        this.$router.push({ path })
      }
    },

    async sendPost () {
      const postContent = this.modals.addPost.data
      const data = {
        user_id: this.userId,
        post_content: postContent.content
      }

      if (_isEmpty(data.post_content) || _isUndefined(data.post_content)) {
        const error = () => {
          this.errors.all = 'Error'
        }

        this.errors.all = 'Error'
        return this.$_swal({
          type: 'error',
          message: 'Error creating post',
          title: 'Error',
          callback: {
            error
          }
        })
      }

      await this.createPost(data)

      const success = () => {
        this.errors.all = null
      }

      this.$_swal({
        type: 'success',
        message: 'Post successful',
        title: 'Sucess',
        callback: {
          success
        }
      })

      this.clear()
      this.handleFetchPosts()
    },

    async fetchUserId () {
      this.userId = await vueLocalStorage.getItem('userId')
    },

    async handleFetchPosts (data) {
      try {
        const query = data && data.query ? data.query : this.params
        await this.fetchPost({
          params: query
        })
      } catch (error) {
        console.log(error)
        throw error
      }
    },

    clear () {
      this.postDetails.postContent = ''
    },

    logout () {
      window.setTimeout(() => {
        this.$router.push({ name: 'logout' })
      }, 500)
    },

    openReply (id) {
      this.showInputReply = !this.showInputReply
    },

    showModal () {
      this.modals.addPost.$status = true
    }
  }
}
</script>
