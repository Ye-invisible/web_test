<script setup>

</script>

<template>
    <div id="content">
        <img src="../assets/images/movie.jpg" id="movieImage">
        <div id="words">
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
        flex-direction: column;
        align-items: center;
    }

    #movieImage {
        width: 40%;
        margin-bottom: 5%;
    }

    #title {
        font-family: 'Regular', monospace;
        font-size: 50px;
        color: black;
        text-align: center;
    }

    #titleEn {
        font-family: 'Roboto', Courier, monospace;
        font-size: x-large;

        background: linear-gradient(45deg, #bfc4f9, #044274);
        -webkit-background-clip: text;
        background-clip: text;
  
        color: transparent;
    }

    #desc {
        list-style-type: none;
        text-align: center;
        color: #044274;
        font-size: small;
        padding-right: 10%;
    }
</style>