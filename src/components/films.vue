<template>
    
  <div class="movies-container">
    <!-- 标题和电影分类筛选按钮 -->
    <div id="content"></div>
    
<!-- 电影列表 -->
    <div class="movies-grid" v-if="!loading">
      <div 
        v-for="movie in filteredMovies" 
        :key="movie.id"
        class="movie-card"
      >
        <div class="movie-poster">
          <img :src="movie.poster" :alt="movie.name" />
          <div class="movie-overlay">
            <div class="movie-rating">{{ movie.rating }}</div>
          </div>
        </div>
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
    </div>
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>正在加载电影数据...</p>
    </div>
        <div id="content"></div>

    <div class="movies-header">
      <div class="filter-tabs">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovieStore } from '../stores/movies';

const loading = ref(true)
const selectedCategory = ref('正在热映')
const categories = ['正在热映', '即将上映', '经典电影','未知类型']
const movies = ref([])
// TODO：利用api得到真实数据
const movieStore = useMovieStore();
const mockMovies = movieStore.allMovies;
console.log('mockMovies:', mockMovies);
// const filteredMovies = computed(() => {
//   return movies.value.filter(movie => movie.category === selectedCategory.value)
// })

const filteredMovies = computed(() => {
  const result = movies.value.filter(movie => {
    // 打印每个电影的 category 和目标分类，确认是否匹配
    console.log(
      '电影名称：', movie.name,
      '电影category：', movie.category,
      '目标分类：', selectedCategory.value,
      '是否匹配：', movie.category === selectedCategory.value
    );
    return movie.category === selectedCategory.value;
  });
  console.log('过滤前总数量：', movies.value.length, '过滤后数量：', result.length);
  return result;
});

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const selectMovieShowtime = (movie, showtime) => {
  alert(`选择场次: ${movie.name} - ${formatTime(showtime.startTime)} @ ${showtime.hall}`)
}

const fetchMovies = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  movies.value = mockMovies
    console.log('fetchmovies:', movies.value); // 检查 movies 数组是否有数据

  loading.value = false
}

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
#content {
  position: relative;
  width: 100%;
  height: 50px;
}
.movies-container {
  padding: 100px;
  width: 100%;
  margin: 0;
  background: linear-gradient(135deg, #0f1013 0%, #740d2d 100%);
  min-height: 100vh;   /* 保证至少填满整个屏幕高度 */
  box-sizing: border-box;
}

.movies-header {
  text-align: center;
  margin-bottom: 30px;
}

.movies-header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.filter-tabs button:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.filter-tabs button.active {
  background: rgba(255,255,255,0.9);
  color: #333;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.movie-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.movie-poster {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.movie-rating {
  background: #ff6b6b;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 0.9rem;
}

.movie-info {
  padding: 15px;
}

.movie-title {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: #333;
}

.movie-genre {
  color: #666;
  margin-bottom: 10px;
}

.movie-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #888;
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
  color: #666;
  font-size: 0.9rem;
}

.price {
  color: #ff6b6b;
  font-weight: bold;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>