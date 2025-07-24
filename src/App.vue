<script setup>
    // import Seats from './components/Seats.vue';
    import Header from './views/Header.vue';
    // import Buttons from './components/Buttons.vue';
    // import Aside from './views/Aside.vue';
    // import SeatView from './views/SeatView.vue';

    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUserStore } from './stores/user'; 
    import { useMovieStore } from './stores/movies';     
    
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js';
    import LoginModal from '@/components/LoginModal.vue';
    
    const router = useRouter()
    const userStore = useUserStore()
    const movieStore = useMovieStore();
    // const scale = ref(1); // 用于存储缩放比例

    onMounted(async () => {
    if (router.currentRoute.value.path !== '/') {
      const appContainer = document.getElementById('all')
      if (appContainer) {
        appContainer.style.transform = `scale(${userStore.scale})`
        appContainer.style.transformOrigin = 'top left'
        appContainer.style.width = `${100/userStore.scale}%`
        appContainer.style.height = `${100/userStore.scale}%`
      }
    }
        userStore.screenHeight = window.innerHeight
        userStore.screenWidth = window.innerWidth

        // console.log(window.innerHeight)
        // console.log(window.innerWidth)
        // 计算缩放比例
        const scaleWidth = userStore.screenWidth / userStore.originScreenWidth
        const scaleHeight = userStore.screenHeight / userStore.originScreenHeight
        userStore.scale = Math.min(scaleWidth, scaleHeight)

        const appContainer = document.getElementById('all')
        if (appContainer) {
            appContainer.style.transform = `scale(${userStore.scale})`
            appContainer.style.transformOrigin = 'top left'
            
            // 补偿缩放后的尺寸
            appContainer.style.width = `${100/userStore.scale}%`
            appContainer.style.height = `${100/userStore.scale}%`
        }


        const navEntries = performance.getEntriesByType('navigation')
        if (navEntries.length > 0 && navEntries[0].type === 'reload') {
            // router.replace('/buy/single')
            router.replace('/')
        }
    
        // router.push('/films')
        // console.log("transform")

        if (movieStore.allMovies.length === 0) {
            await movieStore.fetchMovies();
        }

        //检测登录状态
        userStore.hasLogin = JSON.parse(sessionStorage.getItem("login"))
        userStore.username = JSON.parse(sessionStorage.getItem("username"))
    })
</script>

<template>
  <!-- <div v-if="$route.path !== '/'" id="all"> -->
  <div id="all">
    <header id="header"> 
      <!-- v-if="$route.path !== '/'"> -->
      <Header></Header>
    </header>
    <div id="content">
      <RouterView></RouterView>
    </div>   
  </div>
  
  <!-- <RouterView v-else /> -->
  
  <LoginModal/>
</template>

<style>
    /* #all {
        transform-origin: top left;
    } */

    /* #buttons {
        position: fixed;
        top: 25%;
        right: 18%;
    } */
     #content {
        position: fixed;
        width: 100%;
        height: 76%;
        top: 23%;
        left: 0.6%;
        align-items: center;
        
        /* border: 1px solid white; */
     }

    #header {
        position: fixed;
        width: 100%;
        height: 23%;
        top: 0%;
        left: 0%;
        z-index:4;
    }

    /* #modal {
        position: fixed;
        top: 30%;
    }  */
</style>