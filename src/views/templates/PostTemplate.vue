<template>
  <div></div>
</template>

<script>
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Template',

  data() {
    return {
    };
  },

  computed: {

  },

  methods: {
    async postRequestTemplate() {
      // headerを指定する
      const headers = {'Authorization': 'mtiToken'};
      // リクエストボディを指定する
      const requestBody = {
        value1: 'value1',
        value2: 'value2'
      };

      try {
        const res = await fetch(baseUrl + '/test',  {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers
        });
        // 成功時の処理
        const jsonData = await res.json();
        console.log(jsonData);
      } catch (e) {
        // エラー時の処理
      }
    }
  },
}
</script>

<style scoped>

</style>
