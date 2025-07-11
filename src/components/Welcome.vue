<script setup>
    import { useUserStore } from '@/stores/user';
    import { useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue'

    const userStore = useUserStore()
    // const isGroup = userStore.isGroup
    // const singleMember = userStore.singleMember
    // const groupMember = userStore.groupMember
    // const allTickets = userStore.allTickets
    const router = useRouter()
    
    // 防止重复执行的标志
    const isProcessing = ref(false)
    const hasBuy = false

    const storeBought = () => {
        // 发现点一次，下面的代码被执行多次，试着阻止短时间内多次调用
        if (isProcessing.value) {
            return
        }
        //   检查已选座位和人数是否一致
        if (userStore.isGroup && userStore.groupMember.length != userStore.groupSize){
            alert("选取座位数和购票人数不一致!")
            return 
        } else if (!userStore.isGroup && userStore.singleMember.seat.row == -1){
            alert("请选取一个座位!")
            return
        }
 
        isProcessing.value = true

        // 把人员加入总票夹
        if (userStore.isGroup){
            for(let p of userStore.groupMember){
                p.isBooking = userStore.isBooking
            }
            userStore.allTickets = [...userStore.allTickets,...userStore.groupMember]
        } else {
            // console.log("IN!")
            // console.log(userStore.allTickets)
            userStore.singleMember.isBooking = userStore.isBooking
            userStore.allTickets.push(userStore.singleMember)
        }
        // console.log(userStore.isGroup)
        // console.log(userStore.singleMember)
        // console.log("allTickets :")
        // console.log(userStore.allTickets)
        console.log("购买成功!")
        hasBuy = true
        if(userStore.isBooking){
            alert("预定成功,请在电影开场前完成支付,否则将自动退票!")
        } else {
            alert("付款成功!")
        }

        // 重置一些值
        userStore.reset()
        // router.push("/buy/single")
        
        // 重置标志
        setTimeout(() => {
            isProcessing.value = false
        }, 1000)
    }

    const continueBuy = () => {
        if(!hasBuy) {
            userStore.halfQuit = true
            console.log("set halfQuit true")
        }
        // 跳转回购买界面
        userStore.reset()
        router.push('/buy/single')
    }

    const autoSelected = () => {
        // console.log("autoSelected set!")
        userStore.autoSelect = true
    }

    const chooseOtherMovie = () => {
        // 完成当前电影的选座，更新当前电影的数据
        userStore.movie.allTickets = userStore.allTickets
        userStore.movie.size = userStore.showSize
        userStore.movies.push(userStore.movie)

        //跳转到电影界面--还未设计
        // router.push()
    }

    const bookTicket = () => {
        userStore.isBooking = true

        storeBought()
    }
    
</script>

<template>
    <div id="welcome">
        <p id="welcomeWord">您可以开始选座了! &#128522;&#127881;</p>
        <button class="autoButton" @click="autoSelected">帮我选座!&#128515;</button>
        <button class="autoButton" @click="bookTicket">预定,暂不付款!&#9997;</button>
        <button class="autoButton" @click="storeBought">选完了,直接购买!&#x1F44D;</button>
        <button class="autoButton" @click="continueBuy">继续购票&#9996;</button>
        <button class="autoButton" @click="chooseOtherMovie">浏览其他电影&#10004;</button>
    </div>
</template>

<style>
    #welcome {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #welcomeWord {
        font-size: xx-large;
        text-align: center;
        color: black;
        margin-top: 20%;
        margin-bottom: 20%;
    }

    .autoButton {
        padding: 15px 0;
        width: 40%;
        background: linear-gradient(45deg,rgb(182, 247, 163),rgb(24, 112, 5));
        margin: auto;
        font-size: 18px;
        border-radius: 5px;
        border: transparent;
        box-shadow: 1px 2px 16px rgb(168, 168, 169);
        margin-top: 1%;
    }
</style>