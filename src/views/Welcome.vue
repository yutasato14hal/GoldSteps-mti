<template>
  <div>
    <div class="ui main container">
      <div class="ui segment" id="exercise-level-screen">
        <h1 class="ui header">運動のレベル分け</h1>
        <p class="ui large text">自分の運動強度を選んでください！</p>
        <div class="ui divider"></div>
        <select v-model="selectedVolume" id="select" class="ui fluid dropdown huge  large">
          <option disabled value="null">選択してください</option> <!-- 追加 -->
          <option value="松">松(初級)</option>
          <option value="竹">竹(中級)</option>
          <option value="梅">梅(上級)</option>
        </select>
        <button @click="registerVolumeToDB" class="ui button  huge fluid large blue">登録</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { baseUrl } from '@/assets/config.js';

  export default {
    name: 'Welcome',
    data() {
      return {
        selectedVolume: null, // 初期値として設定
        userId : null
      };
    },
    methods: {
      async registerVolumeToDB() {
        const headers = { 'Authorization': 'mtiToken' };
        const requestBody = {
          volume: this.selectedVolume,
          userId: window.localStorage.getItem("userId"),
        };

        try {
          const res = await fetch(baseUrl + '/user/registerLevel', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers
          });

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};

          if (!res.ok) {
            const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }

          alert("あなたの運動強度が登録されました。");
          this.$router.push({ name: 'Home' })
        }
        catch (e) {
          alert("エラーが発生しました。松竹梅のいずれかを選択してください。")
        }
      }
    }
  };
</script>


<style>
  #exercise-level-screen {
    font-size: 18px;
    /* フォントサイズを大きく */
    background-color: #f9f9f9;
    /* 背景色を明るく */
    height: 80vh;
    width: 50%;
    margin: 0 auto;
    padding-top: 10%;
  }

  .ui.header {
    font-size: 3rem;
    /* ヘッダーのフォントサイズをさらに大きく */
  }
</style>
<style scoped>
  #select {
    margin-top: 4em;
    height: 3em;
    margin-bottom: 10px;
  }
</style>
