<script setup>
import { onMounted, ref, watch } from 'vue';
import Movie from './Movie.vue';

const chosenMovie = ref()
chosenMovie.value = JSON.parse(localStorage.getItem("chosenMovie"));
// console.log(chosenMovie.value.name);
// onMounted(() => {
//     const movieData = localStorage.getItem("chosenMovie");
//     if (movieData) {
//         chosenMovie.value = JSON.parse(movieData); // 直接赋值，无需 await
//         // console.log("jump");
//         // console.log(chosenMovie.value); // 打印完整对象以检查结构
//         // console.log(chosenMovie.value.name);     
//     } else {
//         console.error("没有找到 chosenMovie 的数据");
//     }
// });
</script>

<template>
    <div id="content" v-if="chosenMovie">
        <div id="imageBox">
            <img :src="chosenMovie.poster" id="movieImage">
        </div>     
        <div id="wordBox">
            <h1 id="title">{{ chosenMovie.name }}</h1>
            <!-- <h3 id="titleEn">Mission: Impossible - The Final Reckoning</h3> -->
            <ul id="desc">
                <li>{{ chosenMovie.releaseDateText }} 上映</li>
                <li>演员: {{ chosenMovie.actors.join(" ") }}</li>
                <li>评分: {{ chosenMovie.rating }}</li>
                <li>{{ chosenMovie.category }}</li>
            </ul>
        </div>
    </div>
    <div v-else>
        <p>加载中...</p> <!-- 或者其他占位内容 -->
    </div>
</template>

<style>
    #content {
        display: flex;
        flex-direction: row;
        /* align-items: center; */
/*  
        border: 1px solid white; */
        /* border-radius: 100px; */
    }

    #imageBox {
        position: absolute;
        width: 50%;
        margin-top: 6%;
        margin-left: 2%;
        display: inline-block;

        /* border: 1px solid white; */
    }

    #movieImage {
        width: 90%;
        margin-bottom: 10%;
        border-radius: 40px;
        margin-left: 2%;
        
        box-shadow: 10px 10px 100px;
    }

    #wordBox {
        position: absolute;
        top: 0%;
        right: 0%;
        width: 50%;
        display: inline-block;
        text-align: center;

        /* border: 1px solid white; */
    }

    #title {
        font-family: 'Regular', monospace;
        font-size: 70px;
        color: white;
        text-align: center;
        
        /* background: linear-gradient(45deg, hsl(0, 91%, 63%), #d40f05);
        background-color: white;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent; */

        margin-top: 40%;
    }

    #titleEn {
        font-family: 'Roboto', Courier, monospace;
        font-size: x-large;

        background: linear-gradient(45deg, hsl(0, 91%, 63%), #8e0c05);
        background-color: white;
        -webkit-background-clip: text;
        background-clip: text;
        margin-bottom: 20%;
  
        color: transparent;
    }

    #desc {
        list-style-type: none;
        text-align: center;
        color: #ffffff;
        font-size: small;
        padding-right: 10%;

        padding-top: 36%;
    }
</style>