<script setup>
    import Seats from './views/Seats.vue';
    import Header from './views/Header.vue';
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
        <div id="seats">
            <Seats />
        </div>
        <div id="buy"></div>
        <footer id="footer"></footer>
    </div>
</template>

<style>
    #all {
        background-color: rgba(153, 72, 235, 0.4);
    }
</style>