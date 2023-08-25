<template>
  <div class="ui main container">
    <!-- Loading Spinner -->
    <div class="ui active inverted dimmer" v-if="isCallingApi">
      <div class="ui text loader">Loading</div>
    </div>

    <!-- Error Message -->
    <div class="ui red message" v-if="errorMsg">
      <p>{{ errorMsg }}</p>
    </div>

    <!-- User Status -->
    <div class="ui segment">
      <h3>ユーザー情報</h3>
      <p><strong>ユーザー名： </strong>{{ user.userId }}</p>
      <p><strong>運動強度（松竹梅）: </strong>{{ user.volume }}</p>
      <p><strong>経験値：</strong>{{ user.exp }}</p>
    </div>

    <!-- Upgrade to Paid Plan -->
    <div class="ui segment">
      <h3>有料プランへのアップデート</h3>
      <form class="ui form" @submit.prevent="upgradePlan">
        <div class="field">
          <label>プラン</label>
          <select v-model="user.plan">
            <option value="free">無料</option>
            <option value="premium">有料</option>
          </select>
        </div>
        <button class="ui button green" type="submit">アップデート</button>
      </form>
    </div>

    <!-- Edit Settings -->
    <div class="ui segment">
      <h3>ユーザー情報の編集</h3>
      <form class="ui form" @submit.prevent="updateSettings">
        <div class="field">
          <label>ユーザー名</label>
          <input type="text" v-model="user.username" />
        </div>
        <div class="field">
          <label>パスワード</label>
          <input type="password" v-model="user.password" />
        </div>
        <div class="field">
          <label>運動強度（松竹梅）</label>
          <select v-model="user.strength">
            <option disabled value="null">選択してください</option> <!-- 追加 -->
            <option value="matu">松</option>
            <option value="take">竹</option>
            <option value="ume">梅</option>
          </select>
        </div>
        <button class="ui button blue" type="submit">更新</button>
      </form>
    </div>
  </div>
</template>

<script>
  import { baseUrl } from '@/assets/config.js';

  const headers = {
    'Authorization': 'mtiToken',
    'Access-Control-Allow-Origin': "*"
  };

  export default {
    name: 'Profile',
    data() {
      return {
        user: {
          userId: null,
          password: null,
          volume: '',
          exp: '',
          plan: 'free',
          strength: null, // この行を追加
          username: '' // usernameも初期化（もし必要なら）
        },
        errorMsg: '',
        isCallingApi: false
      };
    },
    methods: {
      clearError() {
        this.errorMsg = ''
      },
      // Other methods (Upgrade, Settings Update)
      // (snip)
    },
    async created() {
      this.isCallingApi = true;

      try {
        const userId = window.localStorage.userId; // userIdを設定。
        const res = await fetch(`${baseUrl}/user?userId=${userId}`, {
          method: 'GET',
          headers
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }

        this.user = {
          userId: jsonData.userId ?? '',
          volume: jsonData.volume ?? '',
          exp: jsonData.exp ?? '',
          plan: jsonData.plan ?? 'free'
        };
      }
      catch (e) {
        this.errorMsg = `ユーザーステータス取得時にエラーが発生しました: ${e}`;
      }
      finally {
        this.isCallingApi = false;
      }
    },
    clearError() {
      this.errorMsg = '';
    },
    async updateSettings() {
      this.isCallingApi = true
      const requestBody = { 
        userId: this.user.userId,
        password:this.user.password,
          volume: this.user.volume,
         
        };
      try {
        const res = await fetch(baseUrl + '/user', {
          method: 'PUT',
          headers,
          body: JSON.stringify(requestBody)
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {


          const errorMessage = jsonData.message ?? 'Settings update failed';
          throw new Error(errorMessage);
        }

        // ここで何か成功時の処理を書く（例：メッセージ表示など）

      }
      catch (e) {
        this.errorMsg = `Settings update failed: ${e}`;
      }
      finally {
        this.isCallingApi = false;
      }
    },
    
    // ...その他のメソッド
  }
  
</script>

<style scoped>
  .ui.main.container {
    margin-top: 20px;
  }
</style>
