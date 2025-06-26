<script setup>
    import { useUserStore } from '@/stores/user';
    import { ref, computed } from 'vue'

    const userStore = useUserStore()
</script>

<template>
  <div class="form-container">
    <div class="form-group">
      <label for="name" class="form-label">姓名</label>
      <input type="text" id="name" class="form-input" placeholder="请输入您的姓名">
    </div>
    <div class="form-group">
      <label for="age" class="form-label">年龄</label>
      <input type="number" id="age" class="form-input" placeholder="请输入您的年龄">
    </div>
    <RouterLink  class="form-label sure" to="/welcome">确定</RouterLink >
    </div>
    <div>
      <RouterView></RouterView>
    </div>
</template>

<style scoped>
    @import '@/assets/form-style.css';
</style>