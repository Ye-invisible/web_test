<template>
  <div class="movies-container">
    <!-- 标题和电影分类筛选按钮 -->
    <div class="movies-header">
      <h1>选择电影</h1>
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
          <p class="movie-genre">{{ movie.genre }}</p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const selectedCategory = ref('正在热映')
const categories = ['正在热映', '即将上映', '经典电影']
const movies = ref([])
// TODO：利用api得到真实数据
const mockMovies = [
  {
    id: 1,
    name: '流浪地球2',
    genre: '科幻/灾难',
    duration: 173,
    rating: 9.1,
    releaseDate: '2023-01-22',
    category: '正在热映',
    showtimes: [
      { id: 1, startTime: '2025-07-30T14:30:00', hall: '1号厅', price: 45, size: 1 },
      { id: 2, startTime: '2025-07-30T17:20:00', hall: '2号厅', price: 50, size: 2 },
      { id: 3, startTime: '2025-07-30T20:10:00', hall: '3号厅', price: 55, size: 0 }
    ]
  },
  {
    id: 2,
    name: '满江红',
    genre: '剧情/古装',
    duration: 159,
    rating: 8.9,
    releaseDate: '2023-01-22',
    category: '正在热映',
    showtimes: [
      { id: 4, startTime: '2025-07-30T15:45:00', hall: '4号厅', price: 42, size: 1 },
      { id: 5, startTime: '2025-07-30T18:30:00', hall: '5号厅', price: 48, size: 2 }
    ]
  },
  {
    id: 3,
    name: '深海',
    genre: '动画/奇幻',
    duration: 112,
    rating: 8.7,
    releaseDate: '2023-01-22',
    category: '正在热映',
    showtimes: [
      { id: 6, startTime: '2025-07-30T16:15:00', hall: '6号厅', price: 40, size: 0 },
      { id: 7, startTime: '2025-07-30T19:45:00', hall: '7号厅', price: 45, size: 1 }
    ]
  },
  {
    id: 4,
    name: '阿凡达：水之道',
    genre: '科幻/冒险',
    duration: 192,
    rating: 9.2,
    releaseDate: '2022-12-16',
    category: '经典电影',
    showtimes: [
      { id: 8, startTime: '2025-07-30T13:30:00', hall: '8号厅', price: 60, size: 2 },
      { id: 9, startTime: '2025-07-30T21:00:00', hall: '9号厅', price: 65, size: 2 }
    ]
  }
]

const filteredMovies = computed(() => {
  return movies.value.filter(movie => movie.category === selectedCategory.value)
})

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
  loading.value = false
}

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
.movies-container {
  padding: 20px;
  width: 100%;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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