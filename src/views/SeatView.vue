<script setup>
    import Seats from '../components/Seats.vue';
    import Movie from '@/components/Movie.vue';
    import Aside from './Aside.vue';
    import Toggle from '@/components/Toggle.vue';
</script>

<template>
    <div id="seatView">
        <!-- <Aside id="seatAside"></Aside> -->
        <Toggle id="seatToggle"></Toggle>
        <Movie id="seatMovie"/>
        <Seats />
    </div>
</template>

<style>
    #all {
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
    }

    #seatView {
        position: fixed;
        width: 100%;
        height: 76%;
        top: 23%;
        left: 0.6%;
        align-items: center;
        
        /* border: 1px solid white; */
    }

    #seatMovie {
        width: 44%;
        height: 80%;
        position: absolute;
        top: 15%;
        left: 0%;
        background-color: rgba(101, 101, 100, 0.5);
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;

        /* border: 1px solid white; */
    }

    #seatToggle {
        position: absolute;
        top: 4%;
        left: -1%;
        text-align: center;
        align-items: center;
        width: 44%;
        height: 10%;

        /* border: 1px solid white; */
        /* z-index: 3; */
    }

</style>