<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <!-- loading表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <!-- エラーメッセージ用-->
      <p class="ui negative message" v-if="errorMsg">
        <i class="close icon" @click="clearMsg('error')"></i>
        <span class="header">エラーが発生しました！</span>
        {{ errorMsg }}
      </p>

      <!-- 成功メッセージ用-->
      <p class="ui positive message" v-if="successMsg">
        <i class="close icon" @click="clearMsg"></i>
        <span class="header">成功！</span>
        {{ successMsg }}
      </p>

      <!-- 入力ボックス -->
      <div class="ui segment">
        <form>
          <div class="inline field">
            <!-- for="article-category"をtimeに -->
            <h1>運動タスク</h1>
            <ul>
              <li>散歩をしましょう！</li>
              <li>30分を目安に運動をしましょう！</li>
              <li>心拍数は80を目指しましょう！</li>
            </ul>
            <hr />
            <label for="stretch_time">時間(分)</label>
            <input v-model.number="stretch_time" type="number" id="time" />
            <label for="vital">心拍数（回／分）</label>
            <input v-model.number="vital_sign" type="number" id="vital" />
          </div>
          <div class="right-align">
            <button class="ui green button" @click="checkResult" type="submit">
              送信
            </button>
          </div>
        </form>
      </div>

      <!-- 投稿一覧-->
      <h3 class="ui dividing header">みんなの運動一覧</h3>
      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(team2_user, index) in team2_user" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ team2_user.userId }}</span>
                <div class="metadata">
                  <span class="date">{{
                    convertToLocaleString(team2_user.timestamp)
                  }}</span>
                </div>
                <button v-if="isMyArticle(team2_user.userId)" class="ui negative mini button right floated" @click="deleteArticle(team2_user)">
                  削除
                </button>
                <p class="age">
                  {{ team2_user.age }}
                </p>
                <span v-if="team2_user.exp" class="ui green label">{{
                  team2_user.exp
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
  import { baseUrl } from '@/assets/config.js';

  const headers = { Authorization: 'mtiToken' };

  export default {
    name: 'Home',

    components: {
      // 読み込んだコンポーネント名をここに記述する
    },

    data() {
      // Vue.jsで使う変数はここに記述する
      return {
        team2_user: [],
        post: {
          age: null,
          exp: null,
        },
        search: {
          userId: null,
          age: null,
          start: null,
          end: null,
        },

        articles: [],
        iam: null,
        userId: null,
        age: null,
        exp: 0,
        start: 0,
        end: 100,
        successMsg: '',
        errorMsg: '',
        isCallingApi: false,
      };
    },

    computed: {
      // 計算した結果を変数として利用したいときはここに記述する

      //入力された心拍数を基準値と比べ、完了の可否を決定

    },

    created: async function() {
      // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
      // apiからarticleを取得する

      if (
        window.localStorage.getItem('userId') &&
        window.localStorage.getItem('token')
      ) {
        this.iam = window.localStorage.getItem('userId');
        await this.getArticles();
      }
      else {
        window.localStorage.clear();
        this.$router.push({ name: 'Login' });
      }
    },

    methods: {
      // Vue.jsで使う関数はここで記述する
      checkResult() {
        let weight;
        if (this.volume === 'matu') {
          weight = 0.5;
        }
        else if (this.volume === 'take') {
          weight = 0.6;
        }
        else {
          weight = 0.7;
        }

        if (
          (220 - this.age) * weight <=
          this.vital <=
          (220 - this.age) * (weight + 0.1)
        ) {
          return '合格です！経験値を100獲得しました！';
          this.exp += 100;
        }
        else {
          return '残念！不合格です。つぎはがんばりましょう! ';
        }
      },
      clearMsg(target) {
        if (target === 'error') {
          this.errorMsg = '';
        }
        else {
          this.successMsg = '';
        }
      },

      isMyArticle(id) {
        return this.iam === id;
      },

      async getArticles() {
        this.isCallingApi = true;

        try {
          /* global fetch */
          const res = await fetch(baseUrl + '/articles', {
            method: 'GET',
            headers,
          });

          const jsonData = await res.json();
          console.log(jsonData)

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage =
              jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }

          // 記事がなかった場合undefinedとなり、記事追加時のunshiftでエラーとなるため、空のarrayを代入
          this.team2_user = jsonData.team2_user ?? [];
        }
        catch (e) {
          this.errorMsg = `運動一覧取得時にエラーが発生しました: ${e}`;
        }
        finally {
          this.isCallingApi = false;
        }
      },

      async postArticle() {
        if (this.isCallingApi) {
          return;
        }
        this.isCallingApi = true;

        const reqBody = {
          userId: this.iam,
          age: this.post.age,
          exp: this.post.exp,
        };
        try {
          /* global fetch */
          const res = await fetch(baseUrl + '/team2_user', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers,
          });

          const age = await res.age();
          const jsonData = age ? JSON.parse(age) : {};

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage =
              jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }

          this.team2_user.unshift({ ...reqBody, timestamp: Date.now() });
          this.successMsg = '運動情報が投稿されました！';
          this.post.age = '';
          this.post.exp = '';
        }
        catch (e) {
          console.error(e);
          this.errorMsg = e;
        }
        finally {
          this.isCallingApi = false;
        }
      },

      async deleteArticle(team2_user) {
        if (this.isCallingApi) {
          return;
        }
        this.isCallingApi = true;

        const { userId, timestamp } = team2_user;
        try {
          /* global fetch */
          const res = await fetch(
            `${baseUrl}/team2_user?userId=${userId}&timestamp=${timestamp}`, {
              method: 'DELETE',
              headers,
            }
          );

          const jsonData = await res.json(); // JSON形式でレスポンスボディを取得
          const age = jsonData.age; // JSONオブジェクトからageプロパティを取得


          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage =
              jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }

          const deleted = this.team2_user.findIndex(
            (a) => a.userId === userId && a.timestamp === timestamp
          );
          this.team2_user.splice(deleted, 1);
          this.successMsg = '運動情報が削除されました！';
        }
        catch (e) {
          console.error(e);
          this.errorMsg = e;
        }
        finally {
          this.isCallingApi = false;
        }
      },

      convertToLocaleString(timestamp) {
        return new Date(timestamp).toLocaleString();
      },
    },
  };
</script>

<style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
  .article-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 100%;
  }

  .right-align {
    text-align: right;
  }

  ul {
    list-style-type: none;
  }

  li {
    font-size: 20px;
    position: relative;
    line-height: 1.8;
  }

  li::after {
    content: '';
    display: block;
    position: absolute;
    top: 0.5em;
    left: -1.5em;
    width: 10px;
    height: 5px;
    border-left: 3px solid #9c9c9c;
    border-bottom: 3px solid #9c9c9c;
    transform: rotate(-45deg);
  }

  hr {
    border-top: 1px dashed #000;
    /* 破線 */
    margin: 30px;
  }
</style>
