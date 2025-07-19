<script setup>
  import { useUserStore } from '@/stores/user';
  import { watch, ref, onMounted } from 'vue';

  const userStore = useUserStore()
  const userInputGroupSize = ref(0)
  let curMaxCol;

  watch(userInputGroupSize, () => {   
    // console.log("in watch")
    if(userInputGroupSize.value > 20) {
      alert('团体购票人数不得超过20')
      userInputGroupSize.value = ""
    } else if(userInputGroupSize.value > curMaxCol){
      alert('团体购票人数不得超过放映厅最大列数')
      userInputGroupSize.value = ""
    } 
  })

  onMounted(() => {
    switch(userStore.showSize){
      case 0:
        curMaxCol = 17
        break
      case 1:
        curMaxCol = 20
        break
      case 2:
        curMaxCol = 26
        break
    }
    // console.log(curMaxCol)
  })

  const finishInputSize = () => {
    // console.log("Finsh inputint size!")
    userStore.isGroup = true
    userStore.groupSize = userInputGroupSize.value
    // console.log("isGroup " + userStore.isGroup)
  }
</script>

<template>
    <div class="form-container">
      <div class="form-group">
        <label for="number" class="form-label">请输入人数</label>
        <input type="number" id="number" v-model="userInputGroupSize" class="form-input" placeholder="请输入人数">
      </div>
      <RouterLink class="form-label sure" to="/groupTable" v-show="userInputGroupSize <= 20 && userInputGroupSize <= curMaxCol" @click="finishInputSize">确定</RouterLink>
      </div>
    <div>
      <RouterView></RouterView>
    </div>
</template>

<style>
    @import '@/assets/form-style.css'; 
</style>