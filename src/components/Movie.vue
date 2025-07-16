<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
      movie: Object
    });

    const formatTime = (timeStr) => {
        const date = new Date(timeStr)
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }
</script>

<template>
    <div id="movieContainer" :style="{ backgroundImage: `url(${movie.poster})`}">
        <!-- <div class="overlay"></div>  -->
        <div class="movie-rating">{{ movie.rating }}</div>

        <div class="movie-info">
            <h3 class="movie-title">{{ movie.name }}</h3>
            <p class="movie-genre">{{ movie.showInfo }}</p>
            <div class="movie-details">
              <span class="movie-duration">{{ movie.duration }}分钟</span>
              <span class="movie-release">{{ movie.releaseDate }}</span>
            </div>
            <div class="movie-showtimes">
              <div 
                v-for="showtime in movie.showtimes" 
                :key="showtime.id"
                class="showtime-item"
                @click.stop="selectMovieShowtime(movie, showtime)"
              >
                <span class="showtime">{{ formatTime(showtime.startTime) }}</span>
                <span class="hall">{{ showtime.hall }}</span>
                <span class="price">¥{{ showtime.price }}</span>
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
    color: #ff6b6b;
    font-weight: bold;
  }
</style>