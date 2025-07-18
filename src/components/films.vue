<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useMovieStore } from '../stores/movies';
  import Movie from './Movie.vue';
  import { useRouter } from 'vue-router';
  
  const loading = ref(true)
  const selectedCategory = ref('正在热映')
  const categories = ['正在热映', '即将上映', '经典电影','其他']
  const movies = ref([])

  // TODO：利用api得到真实数据
  const movieStore = useMovieStore();
  const router = useRouter();
  const mockMovies = movieStore.allMovies;
//   console.log('mockMovies:', mockMovies);
  // const filteredMovies = computed(() => {
  //   return movies.value.filter(movie => movie.category === selectedCategory.value)
  // })
  
    const filteredMovies = computed(() => {
        const result = movies.value.filter(movie => {
      // 打印每个电影的 category 和目标分类，确认是否匹配
    //   console.log(
    //     '电影名称: ', movie.name,
    //     '电影category: ', movie.category,
    //     '目标分类: ', selectedCategory.value,
    //     '是否匹配: ', movie.category === selectedCategory.value
    //   );
        return movie.category === selectedCategory.value;
    });
    // console.log('过滤前总数量：', movies.value.length, '过滤后数量：', result.length);
    return result;
  });
  
  const fetchMovies = async () => {
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 800))
    movies.value = mockMovies
    // console.log('fetchmovies:', movies.value); // 检查 movies 数组是否有数据
  
    loading.value = false
  }
  
  onMounted(() => {
    fetchMovies()
  })

</script>

<template>
    <div class="movies-container">
        <!-- 电影分类条 -->
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
        
        <!-- 电影列表 -->
        <div class="movies-grid" v-if="!loading">
            <div 
                v-for="movie in filteredMovies" 
                :key="movie.id"
                class="movie-card"
            >
                <Movie :movie="movie" />
            </div>
        </div>
        <!-- 正在加载 -->
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>正在加载电影数据...</p>
        </div>
            
    </div>
</template>
  
<style scoped>
    .movies-container {
        position: relative;
        left: 1.3%;
        top: 33%;
        padding: 80px;

        width: 95%;
        /* margin: 0; */
        background: linear-gradient(135deg, #0f1013 0%, #740d2d 100%);
        min-height: 100vh;   /* 保证至少填满整个屏幕高度 */
        /* box-sizing: border-box; */
    }
  
    .filter-tabs {
        position: absolute;
        top: 2%;
        left: 37%;
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
        /* 滑动 */
        max-height: 70vh; 
        overflow-y: auto; 
        scrollbar-width: none;
        padding-bottom: 12%;
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

    .movie-card:hover .movie-poster img {
        transform: scale(1.05);
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