<script setup>
    import { useUserStore } from '@/stores/user';
    // import { useRouter } from 'vue-router'
    import { ref, computed } from 'vue'

    const userStore = useUserStore()
    // const router = useRouter()
    const name = ref('')
    const age = ref(0)

    const storeInfo = () => {
        userStore.singleMember = {name: name.value, age: age.value, seats:-1}
        userStore.isGroup = false

        // console.log("HeyHey!")
        // console.log(userStore.singleMember)
        // router.push('/welcome')
    }
</script>

<template>
  <div class="form-container">
    <div class="form-group">
      <label for="name" class="form-label">姓名</label>
      <input type="text" id="name" class="form-input" placeholder="请输入您的姓名" v-model="name">
    </div>
    <div class="form-group">
      <label for="age" class="form-label">年龄</label>
      <input type="number" id="age" class="form-input" placeholder="请输入您的年龄" v-model="age">
    </div>
    <RouterLink  class="form-label sure" to="/welcome" @click="storeInfo">确定</RouterLink >
    <!-- <button  class="form-label sure" to="/welcome" @click="storeInfo">确定</button> -->
    </div>
    <div>
      <RouterView></RouterView>
    </div>
</template>

<style scoped>
    @import '@/assets/form-style.css';
</style>