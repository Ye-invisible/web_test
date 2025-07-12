<script setup>

</script>

<template>
    <div id="content">
        <div id="imageBox">
            <img src="../assets/images/movie.jpg" id="movieImage">
        </div>     
        <div id="wordBox">
            <h1 id="title">碟中谍8:最终清算</h1>
            <h3 id="titleEn">Mission: Impossible - The Final Reckoning</h3>
            <ul id="desc">
                <li>动作 惊悚 冒险</li>
                <li>美国/170分钟</li>
                <li>2025-05-30 09:00中国大陆上映</li>
            </ul>
        </div>
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
        font-size: 50px;
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