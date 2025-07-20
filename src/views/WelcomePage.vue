<template>
  <div class="welcome-container">
    <!-- 背景元素 -->
    <div class="bg-elements">
      <div v-for="i in 30" :key="i" class="particle" :style="particleStyle(i)"></div>
      <div class="light-effect"></div>
      <div class="film-strip"></div>
    </div>
    
    <!-- 电影海报轮播区（上层） -->
    <div class="movie-carousel">
      <div class="carousel-container">
        <button class="nav-btn left-btn" @click="prevMovie" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
          &lt;
        </button>
        
        <div class="carousel-track">
          <div 
            v-for="(movie, index) in visibleMovies" 
            :key="movie.id" 
            class="carousel-item"
            :class="getCarouselItemClass(index)"
          >
            <img 
              :src="movie.poster" 
              :alt="movie.name" 
              class="poster"
              @error="handleImageError($event, movie)"
            >
            <div class="movie-info">
              <h3>{{ movie.name }}</h3>
              <p>{{ movie.rating }} · {{ movie.genre }}</p>
            </div>
          </div>
        </div>
        
        <button class="nav-btn right-btn" @click="nextMovie" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
          &gt;
        </button>
      </div>
      
      <div class="gradient-overlay"></div>
    </div>

    <!-- 内容区（下层） -->
    <div class="content">
      <h1 class="title glitch" data-text="狗眼电影">狗眼电影</h1>
      <p class="subtitle">发现不一样的光影世界</p>
      
      <button 
        class="start-btn"
        @click="navigate"
        @mouseenter="hoverEffect"
        @mouseleave="resetEffect"
      >
        <span class="btn-text">开始我的电影之旅</span>
        <span class="btn-effect"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { useMovieStore } from '@/stores/movies'; 

export default {
  data() {
    return {
      movies: [],
      activeIndex: 0,
      autoPlayInterval: null,
      isAutoPlaying: true
    };
  },
  computed: {
    // 获取当前可见的5部电影
    visibleMovies() {
      const count = this.movies.length;
      if (count === 0) return [];
      
      const indices = [];
      for (let i = -2; i <= 2; i++) {
        const index = (this.activeIndex + i + count) % count;
        indices.push(this.movies[index]);
      }
      return indices;
    }
  },
  async created() {
    const movieStore = useMovieStore();
    
    try {
      if (movieStore.allMovies.length === 0) {
        await movieStore.fetchMovies();
      }
      
      this.movies = this.processMovieData(movieStore.allMovies);
      
      if (this.movies.length === 0) {
        this.movies = this.getLocalMovies();
      }
      
      this.startAutoPlay();
    } catch (error) {
      console.error('加载电影数据失败:', error);
      this.movies = this.getLocalMovies();
      this.startAutoPlay();
    }
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    // 获取轮播项类名
    getCarouselItemClass(index) {
      const positions = ['far-left', 'left', 'center', 'right', 'far-right'];
      return positions[index];
    },
    
    navigate() {
      this.$router.push('/films'); 
    },
    
    processMovieData(movies) {
      return movies.map(movie => {
        if (!movie.poster || !movie.poster.includes('.')) {
          return {
            ...movie,
            poster: this.getRandomLocalPoster()
          };
        }
        return movie;
      });
    },
    
    getRandomLocalPoster() {
      const randomNum = Math.floor(Math.random() * 12) + 1;
      return `/rollingPic/movies (${randomNum}).jpeg`;
    },
    
    getLocalMovies() {
      return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `电影 ${i + 1}`,
        poster: `/rollingPic/movies (${i + 1}).jpeg`,
        rating: (Math.random() * 2 + 8).toFixed(1),
        genre: ['动作', '喜剧', '科幻', '爱情'][Math.floor(Math.random() * 4)],
        version: '普通版'
      }));
    },
    
    handleImageError(event, movie) {
      console.warn(`海报加载失败: ${movie.poster}`);
      event.target.src = this.getRandomLocalPoster();
    },
    
    nextMovie() {
      this.activeIndex = (this.activeIndex + 1) % this.movies.length;
    },
    
    prevMovie() {
      this.activeIndex = (this.activeIndex - 1 + this.movies.length) % this.movies.length;
    },
    
    startAutoPlay() {
      this.stopAutoPlay();
      this.isAutoPlaying = true;
      this.autoPlayInterval = setInterval(this.nextMovie, 3000);
    },
    
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
    
    pauseAutoPlay() {
      this.isAutoPlaying = false;
      this.stopAutoPlay();
    },
    
    resumeAutoPlay() {
      if (!this.isAutoPlaying) {
        this.startAutoPlay();
      }
    },
    
    hoverEffect(e) {
      const x = e.pageX - e.target.getBoundingClientRect().left;
      const y = e.pageY - e.target.getBoundingClientRect().top;
      
      e.target.querySelector('.btn-effect').style.transform = `translate(${x}px, ${y}px)`;
      e.target.querySelector('.btn-effect').style.opacity = '1';
    },
    
    resetEffect(e) {
      e.target.querySelector('.btn-effect').style.opacity = '0';
    },
    
    particleStyle(i) {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 8 + 2}px`,
        height: `${Math.random() * 8 + 2}px`,
        animationDelay: `${Math.random() * 5}s`,
        backgroundColor: `rgba(150, ${Math.random() * 50}, ${Math.random() * 30}, ${Math.random() * 0.5 + 0.3})`
      };
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+KuaiLe&display=swap');

/* 基础布局 */
.welcome-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0000 0%, #3a0000 50%, #1a0000 100%);
  display: flex;
  flex-direction: column;
  color: #ff4d4d;
  font-family: 'Arial', sans-serif;
}

/* 背景元素 */
.bg-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 15s infinite linear;
  filter: blur(1px);
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

.light-effect {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 50, 50, 0.2) 0%, rgba(255, 50, 50, 0) 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 4s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.6;
  }
}

.film-strip {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 50px,
      rgba(255, 50, 50, 0.05) 50px,
      rgba(255, 50, 50, 0.05) 52px
    );
  opacity: 0.5;
}

/* ============== 电影轮播区关键修复 ============== */
.movie-carousel {
  position: relative;
  height: 50vh; /* 减小高度 */
  width: 100%;
  overflow: visible; /* 允许海报超出容器 */
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 1500px; /* 限制最大宽度 */
  position: relative;
}

.carousel-track {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.carousel-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  z-index: 1;
  top:50%;
  left:50%;
}

/* 不同位置的海报样式 - 关键调整 */
.carousel-item.far-left {
  transform: translate(-50%, -50%) translateX(-400px) scale(0.8);
  opacity: 0.25;
  z-index: 1;
}

.carousel-item.left {
  transform: translate(-50%, -50%) translateX(-200px) scale(1);
  opacity: 0.5;
  z-index: 2;
}

.carousel-item.center {
  transform: translate(-50%, -50%) scale(1.3); /* 修正为双重translate */
  opacity: 1;
  z-index: 5;
}

.carousel-item.right {
  transform: translate(-50%, -50%) translateX(200px) scale(1);
  opacity: 0.5;
  z-index: 2;
}

.carousel-item.far-right {
  transform: translate(-50%, -50%) translateX(400px) scale(0.8);
  opacity: 0.25;
  z-index: 1;
}

.poster {
  max-height: 35vh; /* 减小海报高度 */
  max-width: 200px;   /* 减小海报宽度 */
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  background-color: #3a0000;
  background-image: 
    linear-gradient(45deg, #1a0000 25%, transparent 25%, transparent 75%, #1a0000 75%, #1a0000),
    linear-gradient(45deg, #1a0000 25%, transparent 25%, transparent 75%, #1a0000 75%, #1a0000);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.movie-info {
  text-align: center;
  color: white;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 0.9rem;
  max-width: 80%;
}

.carousel-item.center .movie-info {
  opacity: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px; /* 减小按钮尺寸 */
  height: 40px;
  background: rgba(255, 50, 50, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 50, 50, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.left-btn {
  left: 10px;
}

.right-btn {
  right: 10px;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(to bottom, transparent, rgba(26, 0, 0, 0.8));
  z-index: 3;
}

/* 内容区（下层） */
.content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 内容从顶部开始 */
  align-items: center;
  text-align: center;
  padding: 20px 20px 50px; /* 增加底部内边距 */
  z-index: 3;
  margin-top: -5vh; /* 上移内容区 */
}

.title {
  font-family: 'Ma Shan Zheng', cursive; 
  font-size: 4rem; /* 减小标题大小 */
  margin: 2rem 0 0.5rem;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
  position: relative;
  animation: glitch-anim 2s infinite alternate;
}

.subtitle {
  font-size: 1.2rem; /* 减小副标题大小 */
  margin-bottom: 2rem;
  color: #ff9999;
  text-shadow: 0 0 5px #ff0000;
  animation: subtitle-anim 3s infinite;
}

/* 按钮样式 */
.start-btn {
  position: relative;
  padding: 12px 30px; /* 减小按钮尺寸 */
  background: transparent;
  color: #ff4d4d;
  border: 2px solid #ff4d4d;
  font-size: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  border-radius: 30px;
  z-index: 1;
}

/* ============== 响应式调整 ============== */
@media (max-width: 1600px) {
  .carousel-item.far-left {
    transform: translate(-50%, -50%) translateX(-350px) scale(0.8);
  }
  
  .carousel-item.left {
    transform: translate(-50%, -50%) translateX(-175px) scale(1);
  }
  
  .carousel-item.center {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  .carousel-item.right {
    transform: translate(-50%, -50%) translateX(175px) scale(1);
  }
  
  .carousel-item.far-right {
    transform: translate(-50%, -50%) translateX(350px) scale(0.8);
  }
}
@media (max-width: 1200px) {
  .carousel-item.far-left {
    transform: translate(-50%, -50%) translateX(-280px) scale(0.7);
  }
  
  .carousel-item.left {
    transform: translate(-50%, -50%) translateX(-140px) scale(0.9);
  }
  
  .carousel-item.center {
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  .carousel-item.right {
    transform: translate(-50%, -50%) translateX(140px) scale(0.9);
  }
  
  .carousel-item.far-right {
    transform: translate(-50%, -50%) translateX(280px) scale(0.7);
  }
}
@media (max-width: 992px) {
  .carousel-item.far-left {
    transform: translate(-50%, -50%) translateX(-220px) scale(0.6);
  }
  
  .carousel-item.left {
    transform: translate(-50%, -50%) translateX(-110px) scale(0.8);
  }
  
  .carousel-item.center {
    transform: translate(-50%, -50%) scale(1.0);
  }
  
  .carousel-item.right {
    transform: translate(-50%, -50%) translateX(110px) scale(0.8);
  }
  
  .carousel-item.far-right {
    transform: translate(-50%, -50%) translateX(220px) scale(0.6);
  }
}

@media (max-width: 768px) {
  .carousel-item.far-left,
  .carousel-item.far-right {
    display: none;
  }
  
  .carousel-item.left {
    transform: translateY(-50%) translateX(-80px) scale(0.7);
  }
  
  .carousel-item.right {
    transform: translateY(-50%) translateX(80px) scale(0.7);
  }
  
  .poster {
    max-width: 100px;
  }
}

@media (max-width: 576px) {
  .carousel-item.left {
    transform: translateY(-50%) translateX(-60px) scale(0.6);
  }
  
  .carousel-item.right {
    transform: translateY(-50%) translateX(60px) scale(0.6);
  }
  
  .poster {
    max-width: 80px;
  }
}
/* 保持其他样式不变 */
@keyframes subtitle-anim {
  0%, 100% {
    opacity: 0.8;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
  }
}

/* 故障文字效果 */
.glitch {
  position: relative;
}

.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #00ffff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #ffff00;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim-2 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% {
    text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
  }
  20% {
    text-shadow: 0 0 10px #ff0000, 5px 5px 20px #ff0000, -5px -5px 30px #ff0000;
  }
  40% {
    text-shadow: 0 0 10px #ff0000, -5px 5px 20px #ff0000, 5px -5px 30px #ff0000;
  }
  60% {
    text-shadow: 0 0 10px #ff0000, 5px -5px 20px #ff0000, -5px 5px 30px #ff0000;
  }
  80% {
    text-shadow: 0 0 10px #ff0000, -5px -5px 20px #ff0000, 5px 5px 30px #ff0000;
  }
  100% {
    text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
  }
}

@keyframes glitch-anim-1 {
  0% {
    clip: rect(32px, 9999px, 28px, 0);
    transform: translate(0px, -5px);
  }
  10% {
    clip: rect(12px, 9999px, 59px, 0);
    transform: translate(0px, 10px);
  }
  20% {
    clip: rect(54px, 9999px, 41px, 0);
    transform: translate(-5px, -10px);
  }
  30% {
    clip: rect(23px, 9999px, 85px, 0);
    transform: translate(5px, 0px);
  }
  40% {
    clip: rect(73px, 9999px, 20px, 0);
    transform: translate(-5px, 10px);
  }
  50% {
    clip: rect(42px, 9999px, 78px, 0);
    transform: translate(0px, -10px);
  }
  60% {
    clip: rect(14px, 9999px, 32px, 0);
    transform: translate(5px, 0px);
  }
  70% {
    clip: rect(65px, 9999px, 47px, 0);
    transform: translate(0px, 10px);
  }
  80% {
    clip: rect(82px, 9999px, 29px, 0);
    transform: translate(-5px, 0px);
  }
  90% {
    clip: rect(11px, 9999px, 62px, 0);
    transform: translate(0px, -5px);
  }
  100% {
    clip: rect(53px, 9999px, 39px, 0);
    transform: translate(0px, 0px);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip: rect(65px, 9999px, 99px, 0);
    transform: translate(5px, 0px);
  }
  10% {
    clip: rect(25px, 9999px, 15px, 0);
    transform: translate(-5px, -5px);
  }
  20% {
    clip: rect(87px, 9999px, 70px, 0);
    transform: translate(10px, 5px);
  }
  30% {
    clip: rect(33px, 9999px, 19px, 0);
    transform: translate(-5px, 0px);
  }
  40% {
    clip: rect(11px, 9999px, 82px, 0);
    transform: translate(5px, -5px);
  }
  50% {
    clip: rect(76px, 9999px, 42px, 0);
    transform: translate(-10px, 10px);
  }
  60% {
    clip: rect(99px, 9999px, 54px, 0);
    transform: translate(5px, 0px);
  }
  70% {
    clip: rect(22px, 9999px, 89px, 0);
    transform: translate(0px, -5px);
  }
  80% {
    clip: rect(44px, 9999px, 31px, 0);
    transform: translate(-5px, 5px);
  }
  90% {
    clip: rect(77px, 9999px, 13px, 0);
    transform: translate(10px, 0px);
  }
  100% {
    clip: rect(19px, 9999px, 66px, 0);
    transform: translate(-5px, 0px);
  }
}


</style>