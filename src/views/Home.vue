<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postArticle">
          <div class="field">
            <textarea v-model="post.text" name="article-content" placeholder="あなたの投稿を発信しましょう！" />
          </div>

          <div class="field">
            <label for="article-category">カテゴリー</label>
            <input v-model="post.category" type="text" id="article-category" name="article-category" />
          </div>
          <div class="right-align">
            <button class="ui black button" v-bind:disabled="PostButton" type="submit">
              投稿
            </button>
          </div>
        </form>
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

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errMessage =
              jsonData.message ?? "エラーメッセージがありません";
            throw new Error(errMessage);
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
    },
  };
</script>

<style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
  
</style>
