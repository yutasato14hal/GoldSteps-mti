<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

      <!-- 発展課題のローディング表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <!-- 発展課題のエラーメッセージ用 -->
      <p class="ui negative message" v-if="errorMsg">
        <i class="close icon" @click="clearError"></i>
        <span class="header">エラーが発生しました！</span>
        {{ errorMsg }}
      </p>

      <!-- 検索ボックス -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="getSearchedArticles">
          <div class="field">
            <label for="userId">ユーザーID</label>
            <input
              v-model="search.userId"
              type="text"
              id="userId"
              name="userId"
              placeholder="ユーザーID"
            />
          </div>

          <div class="field">
            <label for="category">カテゴリー名</label>
            <input
              v-model="search.category"
              type="text"
              id="category"
              name="category"
              placeholder="カテゴリ"
            />
          </div>

          <div class="field">
            <label>投稿日時</label>
            <div class="inline fields">
              <div class="field">
                <input
                  v-model.number="search.start"
                  type="datetime-local"
                  id="timestampstart"
                  name="timestampstart"
                />
                <label for="timestampstart">から</label>
              </div>

              <div class="field">
                <input
                  v-model.number="search.end"
                  type="datetime-local"
                  id="timestampend"
                  name="timestampend"
                />
                <label for="timestampend">まで</label>
              </div>
            </div>
          </div>
          <div class="right-align">
            <button
              class="ui green button"
              type="submit"
              v-bind:abled="isSearchButtonDisabled"
            >
              検索
            </button>
          </div>
        </form>
      </div>

      <!-- 投稿一覧 -->
      <h3 class="ui dividing header">投稿一覧</h3>
      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(article, index) in filteredArticles" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ article.userId }}</span>
                <div class="metadata">
                  <span class="date">{{
                    convertToLocaleString(article.timestamp)
                  }}</span>
                </div>
                <button
                  v-if="isMyArticle(article.userId)"
                  class="ui negative mini button right floated"
                  @click="deleteArticle(article)"
                >
                  削除
                </button>
                <p class="text">
                  {{ article.text }}
                </p>
                <span v-if="article.category" class="ui green label">{{
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
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

const headers = { 'Authorization': 'mtiToken' };

export default {
  name: 'Article',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      articles: [],
      userId: null,
      category:null,
      start: 0,
      end: 100,
      errorMsg: '', // 発展課題のエラーメッセージ用
      isCallingApi: false // 発展課題のローディング表示用
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    filteredArticles() {
      return this.articles.filter(e =>
        e.userId?.match(this.userId)
        && e.category?.match(this.category)
        && e.time >= this.start
        && e.time <= this.end
      );
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    // 発展課題のエラーメッセージ用
    clearError() {
      this.errorMsg = ''
    },
  },

  created: async function() {
    this.isCallingApi = true;

    try {
      /* global fetch */
      const res = await fetch(baseUrl + '/articles', {
        method: 'GET',
        headers
      });

      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}

      // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }

      this.articles = jsonData.articles ?? [];
    } catch (e) {
      this.errorMsg = `ユーザーリスト取得時にエラーが発生しました: ${e}`;
    } finally {
      this.isCallingApi = false;
    }
  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
