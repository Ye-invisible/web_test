<script setup>
    import Seats from './views/Seats.vue';
    import Header from './views/Header.vue';
    import Buttons from './components/Buttons.vue';
    import Aside from './views/Aside.vue';

    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUserStore } from './stores/user';

    const router = useRouter()
    const userStore = useUserStore()
    const scale = ref(1); // 用于存储缩放比例

    onMounted(() => {
        userStore.screenHeight = window.innerHeight
        userStore.screenWidth = window.innerWidth

        // console.log(window.innerHeight)
        // console.log(window.innerWidth)
        // 计算缩放比例
        scale.value = Math.min(userStore.screenWidth / userStore.originScreenWidth, userStore.screenHeight / userStore.originScreenHeight);

        const navEntries = performance.getEntriesByType('navigation')
            if (navEntries.length > 0 && navEntries[0].type === 'reload') {
                router.replace('/buy/single')
            }
        
            // 应用缩放
        document.getElementById('all').style.transform = `scale(${scale.value})`;
        document.getElementById('all').style.transformOrigin = 'top left'; // 设置缩放原点
    })
</script>

<template>
    <div id="all">
        <header id="header">
            <Header></Header>
        </header>
        <div id="aside">
            <Aside></Aside>
        </div>
        <Buttons id="buttons"></Buttons>
        <div id="seats">
            <Seats />
        </div>
        <div id="buy"></div>
        <footer id="footer"></footer>
    </div>
</template>

<style>
    #all {
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
    }

    #buttons {
        position: fixed;
        top: 25%;
        right: 18%;
    }
</style>