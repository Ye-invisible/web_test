<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const navRef = ref(null)
const lineRef = ref(null)
const activeIndex = ref(0)

const menu = ['小型放映厅', '中型放映厅', '大型放映厅']

// 计算下划线位置
const updateLine = () => {
  const nav = navRef.value
  const line = lineRef.value
  if (!nav || !line) return
  const activeLi = nav.querySelectorAll('li')[activeIndex.value]
  if (activeLi) {
    const { offsetLeft, offsetWidth } = activeLi
    line.style.left = offsetLeft + 'px'
    line.style.width = offsetWidth + 'px'
  }
}

onMounted(() => {
  userStore.showSize = userStore.movie.size
  activeIndex.value = userStore.showSize
  nextTick(updateLine)
})

watch(activeIndex, () => {
  nextTick(updateLine)
})
</script>

<template>
  <nav ref="navRef" class="vue-nav">
    <ul>
      <!-- <li
        v-for="(item, idx) in menu"
        :key="item"
        :class="{ active: idx === activeIndex }"
        @click="activeIndex = idx"
      > -->
      <li
        v-for="(item, idx) in menu"
        :key="item"
        :class="{ active: idx === activeIndex }"
      >
        <!-- 改成多电影后，电影院大小应该不再能够由用户自行选择，而是我们提前定好每个电影放映厅大小 -->
        <!-- <a href="#" @click="userStore.showSize = idx">{{ item }}</a> -->
        <a href="#">{{ item }}</a>
      </li>
    </ul>
    <div ref="lineRef" class="line"></div>
  </nav>
</template>

<style scoped>
    .vue-nav {
        position: relative;
        padding-bottom: 12px;
    }
    .vue-nav .line {
        height: 2px;
        position: absolute;
        bottom: 0;
        margin: 10px 0 0 0;
        background: #FF1847;
        transition: left 0.3s, width 0.3s;
    }
    .vue-nav ul {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
    }
    .vue-nav ul li {
        margin: 0 40px 0 0;
        opacity: .4;
        transition: all 0.4s ease;
        cursor: pointer;
    }
    .vue-nav ul li.active {
        opacity: 5;
    }
    .vue-nav ul li:last-child {
        margin-right: 0;
    }
    .vue-nav ul li a {
        text-decoration: none;
        color: #7784f6;
        text-transform: uppercase;
        display: block;
        font-weight: 600;
        letter-spacing: .2em;
        font-size: 20px;
    }
</style>