<script setup>
    import Seats from './views/Seats.vue';
    import Header from './views/Header.vue';
    import Buttons from './components/Buttons.vue';
    import Aside from './views/Aside.vue';

    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    onMounted(() => {
        const navEntries = performance.getEntriesByType('navigation')
            if (navEntries.length > 0 && navEntries[0].type === 'reload') {
                router.replace('/buy/single')
            }
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
    #buttons {
        position: fixed;
        top: 25%;
        right: 18%;
    }
</style>