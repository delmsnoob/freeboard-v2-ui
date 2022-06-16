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
      <!-- <accordion>
        <template #title>
          Lorem ipsum
        </template>

        <template #body>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </template>
      </accordion> -->

      <form-list @submit.prevent="">
        <template #header>
          <!-- <form-list-layer
            max-width="300px"
            position="right"
          >
            <form-list-item label="created date">
              <DateTimePicker
                mode="date"
                type="datetime"
              />
            </form-list-item>

            <form-list-item label="deleted date">
              <DateTimePicker
                mode="date"
                type="datetime"
              />
            </form-list-item>

            <form-list-item
              label="can't edit data"
              is-display
            >
              lorem
            </form-list-item>

            <tooltip position="left">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu.
            </tooltip>
          </form-list-layer> -->
          <form-list-layer label="">
            <h2 class="freeboard-header">
              Welcome to Freeboard {{ loginId }}
            </h2>
          </form-list-layer>
        </template>

        <template #body>
          <form-list-layer>
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

            <button class="btn-default post-action__btn">
              <span>
                CANCEL
              </span>
            </button>
            {{ loginId }}
          </div>

          <div class="posts-body">
            <form-list-layer
              v-for="(item, key) in posts"
              :key="key"
              class="post-wrapper"
            >
              <div class="post-header">
                @{{ item.user_id }}
                <!-- <timeago
                  :datetime="item.created_at"
                  :auto-update="60"
                /> -->
              </div>
              <div class="post-body">
                <div v-html="item.post_content"></div>
              </div>

              <div class="post-footer">
                <span>12 likes</span>
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
      v-if="modals.test.$status"
      v-model="modals.test.$status"
      title="Modal"
      close-on-outside-click
      close-on-escape
      use-max-height
      :max-width="500"
      width="60%"
      @close="modals.test.$reset"
    >
      <p v-for="a in 1">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </modal>
  </div>
</template>

<script>
// vuex || sockets
import { mapActions, mapState } from 'vuex'
// lib

// translations || dictionary
import translations from '@/assets/js/translations/common/home'

// components
import Accordion from '@/components/base/Accordion'
import { FormList, FormListLayer, FormListItem } from '@/components/base/form-list'

const SearchBar = () => import('@/components/base/SearchBar')
const TextArea = () => import('@/components/base/TextArea')
const DateTimePicker = () => import('@/components/base/DateTimePicker')
const TagInput = () => import('@/components/base/TagInput')
const Quill = () => import('@/components/base/Quill')
const AttachImage = () => import('@/components/base/AttachImage')
const Tooltip = () => import('@/components/base/Tooltip')

export default {
  name: 'Home',

  components: {
    SearchBar,
    TextArea,
    DateTimePicker,
    Quill,
    FormList,
    FormListLayer,
    FormListItem,
    TagInput,
    AttachImage,
    Accordion,
    Tooltip
  },

  // eslint-disable-next-line vue/require-prop-types
  props: ['loginId'],

  data () {
    const params = Object.assign({
      page: 1,
      rows: 10,
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

      userId: this.loginId,

      modals: {
        test: new this.ModalData({ name: 'asd' })
      },

      searchFor: null,

      attachImage: {
        // image: require('@/assets/images/favicon/default.png'),
        image: null,
        existing: null
      },

      postDetails: {
        loginId: null,
        postContent: ''
      },

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
      }
    }
  },

  computed: {
    ...mapState('posts', [
      'posts',
      'count'
    ])
  },

  async mounted () {
    await this.fetchPost()
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
      const data = {
        user_id: this.loginId,
        post_content: this.postDetails.postContent
      }

      await this.createPost(data)
      this.clear()
      this.handleFetchPosts()
    },

    async handleFetchPosts (data) {
      console.log(data, 'home data')
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
    }
  }
}
</script>
