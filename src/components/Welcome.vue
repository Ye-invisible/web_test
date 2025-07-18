<script setup>
    import { useUserStore } from '@/stores/user';
    import { useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue'
    import { useMovieStore } from '@/stores/movies';
    import { Movie } from '@/utils/film';

    const userStore = useUserStore()
    const movieStore = useMovieStore()
    // const isGroup = userStore.isGroup
    // const singleMember = userStore.singleMember
    // const groupMember = userStore.groupMember
    // const allTickets = userStore.allTickets
    const router = useRouter()
    
    // 防止重复执行的标志
    const isProcessing = ref(false)
    let hasBuy = false

    const storeBought = () => {
        // 发现点一次，下面的代码被执行多次，试着阻止短时间内多次调用
        if (isProcessing.value) {
            return
        }
        //   检查已选座位和人数是否一致
        // console.log("check! groupMember.length=", userStore.groupMember.length, "groupSize= ", userStore.groupSize)
        // console.log("groupMember", userStore.groupMember)
        if (userStore.isGroup && userStore.hasChoose != userStore.groupSize){
            alert("选取座位数和购票人数不一致!")
            return 
        }
         if (!userStore.isGroup && userStore.hasChoose === 0){
            alert("请选取一个座位!")
            return
        } 
 
        isProcessing.value = true

        // console.log("movie url", userStore.movie.imageURL)
        // 把人员加入总票夹
        if (userStore.isGroup){
            for(let p of userStore.groupMember){
                p.isBooking = userStore.isBooking
                p.movieId = userStore.movie.movieId
                p.showtimeId = userStore.movie.showtimeId
                p.moviename = userStore.movie.name
                p.startTime = userStore.movie.startTime
                p.imageURL = userStore.movie.imageURL
            }
            userStore.allTickets = [...userStore.allTickets,...userStore.groupMember]
        } else {
            // console.log("IN!")
            userStore.singleMember.isBooking = userStore.isBooking
            userStore.singleMember.movieId = userStore.movie.movieId
            userStore.singleMember.showtimeId = userStore.movie.showtimeId
            userStore.singleMember.moviename = userStore.movie.name
            userStore.singleMember.startTime = userStore.movie.startTime
            userStore.singleMember.imageURL = userStore.movie.imageURL
            userStore.allTickets.push(userStore.singleMember)
        }
        // console.log(userStore.isGroup)
        // console.log(userStore.singleMember)
        // console.log("allTickets :")
        // console.log(userStore.allTickets)
        // console.log("购买成功!")
        hasBuy = true
        if(userStore.isBooking){
            alert("预定成功,请在电影开场前完成支付,否则将自动退票!")
        } else {
            alert("付款成功!")
        }

        // 重置一些值
        updateMovieStore()
        userStore.reset()
        // router.push("/buy/single")
        
        // 重置标志
        setTimeout(() => {
            isProcessing.value = false
        }, 1000)
    }

    // const checkChooseNum = () => {
    //     console.log("groupMember", userStore.groupMember)
    //     for(let p of userStore.groupMember){
    //         if(p.seat.row == -1 || p.seat.col == -1) return 0
    //     }
    //     return 1;
    // }

    const continueBuy = () => {
        if(!hasBuy) {
            userStore.halfQuit = true
            // console.log("set halfQuit true")
        }
        // 跳转回购买界面
        userStore.reset()
        router.push('/seats')
    }

    const autoSelected = () => {
        // console.log("autoSelected set!")
        
        userStore.autoSelect = true
    }

    const updateMovieStore = () => {
        // 从 localStorage 获取数据
        const storedMovie = JSON.parse(localStorage.getItem("chosenMovie"));
        // console.log("storedMovie showtimes", storedMovie.showtimes)
        let chosenMovieShowTimeId = JSON.parse(localStorage.getItem("chosenMovieShowTime")).id;

        // 发现数据结构里提供了直接修改的方法
        // 将普通对象转换回 Movie 实例
        const newChosenMovie = new Movie(
            storedMovie.id,
            storedMovie.name,
            storedMovie.poster,
            storedMovie.genre,
            storedMovie.rating,
            storedMovie.releaseDate,
            storedMovie.releaseDateText,
            storedMovie.showInfo,
            storedMovie.version,
            storedMovie.actors
        );

        // 恢复 showtimes 数据
        newChosenMovie.showtimes = storedMovie.showtimes;
        // 调用类的方法修改票
        newChosenMovie.changeState(chosenMovieShowTimeId, userStore.allTickets)
        // console.log("changed showtimes:", newChosenMovie.showtimes)
        // 修改store里该movie。这样修改就保存在movieStore里了
        let movieIndex = movieStore.movieCollection.movies.findIndex(movie => movie.id === newChosenMovie.id)
        // console.log("movieIndex",movieIndex);
        
        movieStore.movieCollection.movies[movieIndex] = newChosenMovie
        // localStorage.setItem("chosenMovie", JSON.stringify(newChosenMovie))
        // userStore.movies.push(userStore.movie)
        // userStore.isBuying = false
        // console.log("in updateMovieStore moviestore allmovies")
        // console.log(movieStore.allMovies)
    }

    const chooseOtherMovie = () => {
        // 完成当前电影的选座，更新当前电影的数据
        // userStore.movie.allTickets = userStore.allTickets
        // userStore.movie.size = userStore.showSize
        console.log("choose other movie");
        updateMovieStore()
        router.push("/films")
    }

    const bookTicket = () => {
        userStore.isBooking = true

        storeBought()
    }
    
</script>

<template>
    <div id="welcome">
        <!-- <p id="welcomeWord">您可以开始选座了! &#128522;&#127881;</p> -->
        <button class="autoButton" @click="autoSelected">帮我选座!&#128515;</button>
        <button class="autoButton" @click="bookTicket">预定,暂不付款!&#9997;</button>
        <button class="autoButton" @click="storeBought">选完了,直接购买!&#x1F44D;</button>
        <button class="autoButton" @click="continueBuy">清除购票信息&#9996;</button>
        <button class="autoButton" @click="chooseOtherMovie">浏览其他电影&#10004;</button>
    </div>
</template>

<style>
    #welcome {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    /* #welcomeWord {
        font-size: xx-large;
        text-align: center;
        color: black;
        margin-top: 20%;
        margin-bottom: 20%;
    } */

    .autoButton {
        padding: 15px 0;
        width: 16%;
        background: linear-gradient(45deg,rgb(178, 5, 2),rgb(172, 2, 2));
        margin: auto;
        font-size: 15px;
        border-radius: 5px;
        border: transparent;
        color: white;
        box-shadow: 1px 2px 16px rgb(101, 2, 2);
        opacity: 0.8;
        margin-top: 1%;
    }
</style>