<script setup>
  import { useUserStore } from '@/stores/user';
  import { watch } from 'vue';

    const userStore = useUserStore()

  watch(() => userStore.groupSize, () => {
    if(userStore.groupSize > 20) {
      alert('团体购票人数不得超过20')
    }
  })
</script>

<template>
    <div class="form-container">
    <div class="form-group">
      <label for="number" class="form-label">请输入人数</label>
      <input type="number" id="number" v-model="userStore.groupSize" class="form-input" placeholder="请输入人数">
    </div>
    <RouterLink class="form-label sure" to="/groupTable" v-show="userStore.groupSize <= 20" @click="userStore.isGroup=true">确定</RouterLink>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
</template>

<style>
    @import '@/assets/form-style.css'; 
</style>