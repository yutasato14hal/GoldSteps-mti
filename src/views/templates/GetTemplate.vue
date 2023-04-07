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
    async getRequestTemplate() {
      // headerを指定する
      const headers = {'Authorization': 'mtiToken'};

      try {
        const res = await fetch(baseUrl + '/test',  {
          method: 'GET',
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
