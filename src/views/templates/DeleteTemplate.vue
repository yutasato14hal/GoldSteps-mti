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
    async deleteRequestTemplate() {
      // headerを指定する
      const headers = {'Authorization': 'mtiToken'};

      const queryParam1Value = 'value1';

      try {
        await fetch(`${baseUrl}/test?$param1=${queryParam1Value}`, {
          method: 'DELETE',
          headers
        });
        // 成功時の処理
      } catch (e) {
        // エラー時の処理
      }
    }
  },
}
</script>

<style scoped>

</style>
