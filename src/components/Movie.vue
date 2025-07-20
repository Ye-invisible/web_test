<script setup>
    import { defineProps,computed } from 'vue';
    import { useRouter } from 'vue-router';

    const SHOWSIZE = ["小型放映厅","中型放映厅","大型放映厅"]
    const router = useRouter()

    const props = defineProps({
      movie: Object
    });
    const isUpcoming = computed(() => {
      return props.movie.category === '即将上映';
    });
    const selectMovieShowtime = (movie, showtime) => {
      // alert(`选择场次: ${movie.name} - ${formatTime(showtime.startTime)} @ ${showtime.hall}`)
      if (isUpcoming.value) {
        alert(`电影未上映，预计上映时间为 ${movie.releaseDate}`);
        return;
      }
      localStorage.setItem("chosenMovie", JSON.stringify(movie))
      localStorage.setItem("chosenMovieShowTime", JSON.stringify(showtime))
      // console.log(movie)
      // console.log(showtime)
      router.push("/seats")
    }

    const formatTime = (timeStr) => {
        const date = new Date(timeStr)
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    // const handleMovieClick = (movie) => {
    //   // console.log("click!")
    //   // console.log(movie.showtimes)    
    //   localStorage.setItem("chosenMovie", JSON.stringify(movie))
    //   // let newValue = JSON.parse(localStorage.getItem("chosenMovie"))
    //   // console.log("before jump")
    //   // console.log(newValue.id);
    //   router.push("/seats")
    // }
</script>

<template>
    <div id="movieContainer" :style="{ backgroundImage: `url(${movie.poster})`}">
        <!-- <div class="overlay"></div>  -->
        <div class="movie-rating">{{ movie.rating }}</div>

        <div class="movie-info">
            <h3 class="movie-title">{{ movie.name }}</h3>
            <p class="movie-genre">{{ movie.showInfo }}</p>
            <div class="movie-details">
              <!-- 好像movie类中没有duration这个属性? -->
              <!-- <span class="movie-duration">{{ movie.duration }}分钟</span> -->
              <span class="movie-duration"> 60 分钟</span>
              <span class="movie-release">{{ movie.releaseDate }}</span>
            </div>
            <div class="movie-showtimes">
              <div 
                v-for="showtime in movie.showtimes" 
                :key="showtime.id"
                class="showtime-item"
                @click.stop="selectMovieShowtime(movie, showtime)"
              >
                <span class="showtime">{{ showtime.formattedTime }}</span>
                <span class="hall">{{ showtime.hall }}</span>
                <span class="price">{{ SHOWSIZE[showtime.showSize] }}</span>
              </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #movieContainer {
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        height: 450px;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(254, 254, 254, 0.2); 
        z-index: 1; 
    }   
  
  .movie-rating {
    position: absolute;
    top: 3%;
    right: 3%;

    background: #ff6b6b;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
    font-size: 0.9rem;
  }
  
  .movie-info {
    position: absolute;
    top: 40%;
    width: 100%;
    padding: 15px;
    height: 100%;
    background-color: #eee9e9;
    opacity: 0.8;
  }

  .movie-title {
    font-size: 1.3rem;
    margin-bottom: 8px;
    color: #0b0b0b;
    font-weight: 600;
  }
  
  .movie-genre {
    color: #3e3e3e;
    margin-bottom: 10px;
  }
  
  .movie-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #464646;
  }
  
  .movie-showtimes {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .showtime-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .showtime-item:hover {
    background: #e9ecef;
  }
  
  .showtime {
    font-weight: bold;
    color: #333;
  }
  
  .hall {
    color: #383737;
    font-size: 0.9rem;
  }
  
  .price {
    color: #e3c0c0;
    font-weight: bold;
  }
</style>