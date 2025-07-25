<script setup>
    import { useMovieStore } from '@/stores/movies';
    import { useUserStore } from '@/stores/user';
    import { onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';

    const chosenMovie = ref()
    const chosenMovieShowTime = ref()
    const SHOWSIZE = ["小型放映厅","中型放映厅","大型放映厅"]
    const userStore = useUserStore()  
    const movieStore = useMovieStore()
    const router = useRouter()
    // console.log("startTime", userStore.movie)
    onMounted(async () => {
        chosenMovie.value = JSON.parse(localStorage.getItem("chosenMovie"));
        // console.log("chosenMovie",chosenMovie.value)
        chosenMovieShowTime.value = JSON.parse(localStorage.getItem("chosenMovieShowTime"));
        if(!chosenMovie.value){
            alert("请先选择电影!")
            await router.push("/films")
            return
        }
        const chosenShowTimeIndex = chosenMovie.value.showtimes.findIndex(t => chosenMovieShowTime.value.id === t.id)

        // console.log("in seatmovie")
        // console.log(chosenMovie.value.poster)
        // console.log(chosenShowTimeIndex)
        userStore.movie = {
            name: chosenMovie.value.name,
            size: chosenMovieShowTime.value.showSize,
            allTickets: movieStore.movieCollection.findMovieById(chosenMovie.value.id).showtimes[chosenShowTimeIndex].tickets,
            startTime: chosenMovieShowTime.value.formattedTime,
            movieId: chosenMovie.value.id,
            showtimeId: chosenMovieShowTime.value.id,
            imageURL: chosenMovie.value.poster
        }
        userStore.allTickets = userStore.movie.allTickets
        // console.log("on load userStore movie", chosenMovie.value.showtimes[chosenShowTimeIndex].tickets)
        console.log("on load userStore.movie", userStore.movie)
    })

</script>

<template>
    <div id="content" v-if="chosenMovie">
        <div id="imageBox">
            <img :src="chosenMovie.poster" id="movieImage">
        </div>     
        <div id="wordBox">
            <h1 id="title">{{ chosenMovie.name }}</h1>
            <!-- <h3 id="titleEn">Mission: Impossible - The Final Reckoning</h3> -->
            <ul class="desc" id="desc1">
                <li>放映时间: {{ chosenMovieShowTime.formattedTime }}</li>
                <li>{{ chosenMovieShowTime.hall }}</li>
                <li>放映厅大小: {{ SHOWSIZE[chosenMovieShowTime.showSize ]}}</li>
            </ul>
            <ul class="desc" id="desc2">
                <li>{{ chosenMovie.releaseDate }} 上映</li>
                <!-- <li>演员: {{ chosenMovie.actors.join(" ") }}</li> -->
                <li>评分: {{ chosenMovie.rating }}</li>
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
        width: 45%;
        margin-top: 6%;
        margin-left: 5%;
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
        
        background: linear-gradient(45deg, hsl(0, 88%, 74%), #f40707);
        background-color: white;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;

        margin-top: 20%;
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

    .desc {
        list-style-type: none;
        text-align: center;
        color: #ffffff;
        font-size: small;
        padding-right: 10%;
    }

    #desc1 {
        margin-top: 50%;
    }
</style>