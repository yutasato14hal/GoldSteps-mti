<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postArticle">
          <div class="field">
            <textarea v-model="post.text" name="article-content" placeholder="whats up！" />
          </div>
          <div class="field">
            <label for="article-category">category</label>
            <input v-model="post.category" type="text" id="article-category" name="article-category" />
          </div>
          <div class="right-align">
            <button class="ui black button" v-bind:disabled="PostButton" type="submit">
              POST
            </button>
          </div>
        </form>
      </div>
       検索ボックス 
      <div class="ui segment">
        <form class="ui form" @submit.prevent="">
          <div class="field">
            <label for="userId">userId</label>
            <input v-model="search.userId" type="text" id="userId" name="userId" placeholder="userId" />
          </div>

          <div class="field">
            <label for="category">category</label>
            <input v-model="search.category" type="text" id="category" name="category" placeholder="category" />
          </div>

          <div class="field">
            <label>timestamp</label>
            <div class="inline fields">
              <div class="field">
                <input v-model="search.start" type="datetime-local" id="timestampstart" name="timestampstart" />
                <label for="timestampstart">～</label>
              </div>

              <div class="field">
                <input v-model="search.end" type="datetime-local" id="timestampend" name="timestampend" />
              </div>
            </div>
          </div>
          <div class="right-align">
            <button class="ui black button" type="submit" v-bind:disabled="isSearchButtonDisabled">
              search
            </button>
          </div>
        </form>
      </div>
      <h3 class="ui dividing header">articles</h3>
      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(article, index) in articles" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ article.userId }}</span>
                <div class="metadata">
                  <span class="date">{{
                    convertToLocaleString(article.timestamp)
                  }}</span>
                </div>
                <button v-if="isMyArticle(article.userId)" class="ui negative mini button right floated" @click="deleteArticle(article)">
                  delete
                </button>
                <p class="text">
                  {{ article.text }}
                </p>
                <span v-if="article.category" class="ui black label">{{
                  article.category
                }}</span>
                <div class="ui divider"></div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // 必要なものはここでインポートする
  // @は/srcと同じ意味です
  // import something from '@/components/something.vue';
  import { baseUrl } from "@/assets/config.js";

  const headers = { Authorization: "mtiToken" };

  export default {
    name: "Home",

    components: {
      // 読み込んだコンポーネント名をここに記述する
    },

    data() {
      // Vue.jsで使う変数はここに記述する
      return {
        post: {
          text: null,
          category: null,
        },
        search: {
          userId: null,
          category: null,
          start: null,
          end: null,
        },
        articles: [],
        iam: null,
        okMsg: "",
        errMsg: "",
        isCallingApi: false,
      };
    },

    computed: {
      // 計算した結果を変数として利用したいときはここに記述する
      PostButton() {
        return !this.post.text;
      }
    },

    created: async function() {
      // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
      // apiからarticleを取得する

      if (
        window.localStorage.getItem("userId") &&
        window.localStorage.getItem("token")
      ) {
        this.me = window.localStorage.getItem("userId");
        await this.getArticles();
      }
      else {
        window.localStorage.clear();
        this.$router.push({ name: "Login" });
      }
    },

    methods: {
      // Vue.jsで使う関数はここで記述する
      clearMsg(target) {
        if (target === "error") {
          this.errMsg = "";
        }
        else {
          this.okMsg = "";
        }
      },

      isMyArticle(id) {
        return this.me === id;
      },



      async postArticle() {
        if (this.isCallingApi) {
          return;
        }
        this.isCallingApi = true;

        const req = {
          userId: this.me,
          text: this.post.text,
          category: this.post.category,
        };
        try {
          /* global fetch */
          const res = await fetch(baseUrl + "/article", {
            method: "POST",
            body: JSON.stringify(req),
            headers,
          });

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};
          if (!res.ok) {
            const errMsg =
              jsonData.message ?? "エラーメッセージがありません";
            throw new Error(errMsg);
          }

          this.articles.unshift({ ...req, timestamp: Date.now() });
          this.okMsg = "記事が投稿されました！";
          this.post.text = "";
          this.post.category = "";
        }
        catch (e) {
          console.error(e);
          this.errMsg = e;
        }
        finally {
          this.isCallingApi = false;
        }
      },


      async deleteArticle(article) {
        if (this.isCallingApi) {
          return;
        }
        this.isCallingApi = true;

        const { userId, timestamp } = article;
        try {
         
          const res = await fetch(
            `${baseUrl}/article?userId=${userId}&timestamp=${timestamp}`, {
              method: "DELETE",
              headers,
            }
          );

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};
          if (!res.ok) {
            const errMsg =
              jsonData.message ?? "no ms";
            throw new Error(errMsg);
          }

          const deleted = this.articles.findIndex(
            (a) => a.userId === userId && a.timestamp === timestamp
          );
          this.articles.splice(deleted, 1);
          this.oksMsg = "deleteOk";
        }
        catch (e) {
          console.error(e);
          this.errMsg = e;
        }
        finally {
          this.isCallingApi = false;
        }
      },

      convertToLocaleString(timestamp) {
        return new Date(timestamp).toLocaleString();
      },
    }
  };
</script>

<style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
</style>
