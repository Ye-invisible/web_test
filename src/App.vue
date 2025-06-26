<script setup>
    import Seats from './views/Seats.vue';
    import Header from './views/Header.vue';
    import Buttons from './components/Buttons.vue';
</script>

<template>
    <div id="all">
        <header id="header">
            <Header></Header>
        </header>
        <div id="leftAside">
            <div id="movie"></div>
            <div id="tickets"></div>
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