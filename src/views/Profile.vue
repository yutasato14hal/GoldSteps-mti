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
      <h3>User Status</h3>
    <p><strong>UserId: </strong>{{ user.userId }}</p>
    <p><strong>Volume: </strong>{{ user.volume }}</p>
    <p><strong>Experience: </strong>{{ user.exp }}</p>
    </div> 

     <!-- Upgrade to Paid Plan -->
    <div class="ui segment">
      <h3>Upgrade to Paid Plan</h3>
      <form class="ui form" @submit.prevent="upgradePlan">
        <div class="field">
          <label>Plan</label>
          <select v-model="user.plan">
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <button class="ui button green" type="submit">Upgrade</button>
      </form>
    </div>

    <!-- Edit Settings -->
    <div class="ui segment">
      <h3>Edit Settings</h3>
      <form class="ui form" @submit.prevent="updateSettings">
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="user.username" />
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" v-model="user.password" />
        </div>
        <div class="field">
          <label>Strength</label>
          <select v-model="user.strength">
            <option value="松">松</option>
            <option value="竹">竹</option>
            <option value="梅">梅</option>
          </select>
        </div>
        <button class="ui button blue" type="submit">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/assets/config.js';

const headers = { 'Authorization': 'mtiToken' };

export default {
  name: 'Profile',
  data() {
    return {
      user: {
        userId: window.localStorage.userId,
        volume: '',
        exp: '',
        plan: 'free'
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
      const userId = window.localStorage.userId;  // userIdを設定。この値は適切な方法で取得または設定します。
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
    } catch (e) {
      this.errorMsg = `ユーザーステータス取得時にエラーが発生しました: ${e}`;
    } finally {
      this.isCallingApi = false;
    }
  }
};
</script>

<style scoped>
.ui.main.container {
  margin-top: 20px;
}
</style>
