<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const activeTab = ref(0)
const decorationStyle = ref({
  width: '0px',
  transform: 'translateX(0px)'
})

const tabs = [
  { name: '购票', route: '/buy' },
  { name: '今日放映', route: '/movie' },
  { name: '我的票夹', route: '/tickets' }
]

const updateDecoration = () => {
  nextTick(() => {
    const navItems = document.querySelectorAll('.tabs__nav-item')
    if (navItems[activeTab.value]) {
      const activeItem = navItems[activeTab.value]
      const width = activeItem.offsetWidth - 1
      const offsetLeft = activeItem.offsetLeft
      
      decorationStyle.value = {
        width: `${width}px`,
        transform: `translateX(${offsetLeft}px)`
      }
    }
  })
}

const setActiveTab = (index) => {
  activeTab.value = index
  updateDecoration()
}

onMounted(() => {
  updateDecoration()
})
</script>

<template>
  <div id="aside">
      <!-- 标签导航 -->
      <div class="tabs_nav">
        <ul class="tabs_nav-list">
          <li 
            v-for="(tab, index) in tabs" 
            :key="tab.name"
            :class="['tabs__nav-item']">
            <RouterLink 
                :to="tab.route"
                @click="setActiveTab(index)">
                {{ tab.name }}
            </RouterLink>
          </li>
        </ul>
        <!-- 滑动装饰条 -->
        <div id="scroll" :style="decorationStyle"></div>
      </div>
      
      
      <div>
          <RouterView />
      </div>
  </div>
</template>

<style scoped>
#aside {
  /* border: 1px solid #ddd; */
  border: transparent;
  border-radius: 8px;
  width: 35%;
  height: 75%;
  position: fixed;
  top: 20%;
  left: 5%;
  background-color: rgb(255, 255, 255);
  opacity: 0.8;
  /* background: linear-gradient(10deg,#f6d6c5,#5407e3); */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 10px;
}

/* 标签导航样式 */
.tabs_nav {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  height: 7.5%;
  z-index: 0;
}

#scroll {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  transition: width 0.3s linear 0s, transform 0.2s ease-out 0s;
  background-color: #119DA4;
  border-radius: 5px;
  z-index: 1;
}

.tabs_nav-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  background-color: transparent;
  border-radius: 5px;
  padding: 5px;
  z-index: 2;
}

.tabs__nav-item {
  transition: all 0.2s linear 0s;
  padding: 10px 15px;
  cursor: pointer;
  color: #343232;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.router-link-exact-active {
  transition: all 0.2s linear 0.05s;
  color: #fff;
}

</style>