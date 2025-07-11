<script setup>
    import { useUserStore } from '@/stores/user';
    import { onMounted, onUnmounted } from 'vue';

    const userStore = useUserStore()

    let timer = null;

    // 格式化时间的函数
    const formatTime = (date) => {
        // if (!date || !(date instanceof Date)) {
        //     return '未设置'
        // }
        
        // const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        
        return `${month}-${day} ${hours}:${minutes}`
    }

    const cancelBuyOrBook = (item,flag) => {
        // flag 为false代表不是预定票
        // 从 allTickets 数组中删除指定的票务项目
        const index = userStore.allTickets.findIndex(ticket => 
            ticket.name === item.name && 
            ticket.seat.row === item.seat.row && 
            ticket.seat.col === item.seat.col
        )
        
        userStore.allTickets.splice(index, 1)
        if(!flag) alert("退款成功！")
        else alert("取消预定成功!")

    }

    const deleteOverTime = () => {
        // userStore.isCleanupOperation = true
        // 定时的删除超时未支付的票
        const currentDate = new Date()
        // console.log("current Time")
        // console.log(currentDate)
        const startTime = userStore.movie.startTime
        // console.log("start Time")
        // console.log(startTime)
        // console.log(currentDate > startTime)

        // console.log(userStore.allTickets)
        // 过滤掉过期的预订票
        userStore.allTickets = userStore.allTickets.filter(p => {
            if (p.isBooking && currentDate > startTime) {
                // 如果预订票过期，返回 false（不保留）               
                return false
            }
            return true // 保留其他票
        })
        // userStore.isCleanupOperation = false
        // console.log(userStore.allTickets)
    }

    function bookToBuy(item) {
        const index = userStore.allTickets.findIndex(ticket => 
            ticket.name === item.name && 
            ticket.seat.row === item.seat.row && 
            ticket.seat.col === item.seat.col
        )
        
        userStore.allTickets[index].isBooking = false
        alert("付款成功!")
    }

    onMounted(() => {
        console.log("In timer")
        userStore.isBuying = false
        timer = setInterval(deleteOverTime,1000)
    })

    onUnmounted(() => {
        userStore.isBuying = true
        clearInterval(timer)
    })
</script>

<template>
    <div id="tableOuter">
        <table id="inputTable">
            <thead id="tableHead">
                <tr>
                    <th>姓名</th>                 
                    <th>电影</th>
                    <th>上映时间</th>
                    <th>座位号</th>
                    <th>退票/取消预定</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <tr v-for="(item, index) in userStore.allTickets" :key="index" class="form-group">
                    <td class="ticket">{{ item.name }}</td>
                    <td class="ticket">{{ userStore.movie.name }}</td>
                    <td class="ticket">{{ formatTime(userStore.movie.startTime) }}</td>
                    <td class="ticket">{{ item.seat.row + '-' + item.seat.col }}</td>
                    <td class="ticket">
                        <button class="button" v-if="item.isBooking" @click="cancelBuyOrBook(item,true)">取消预定</button>
                        <button class="button" v-else @click="cancelBuyOrBook(item,false)">退票</button>
                        <button class="button" v-show="item.isBooking" @click="bookToBuy(item)">付款</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- <RouterLink class="form-label sure" to="/welcome" @click.prevent="storeInfo">确定</RouterLink >
    <div>
      <RouterView></RouterView>
    </div>  -->
</template>

<style>
    @import '@/assets/form-style.css';
    #inputTable {
        width: 150%;
        overflow-x: scroll;
    }

    .ticket {
        color: black;
        text-align: center;
        padding-right: 1%;
    }

    .button {
        border: transparent;
        border-radius: 5px;
        opacity: 0.8;
        /* box-shadow: 1px 2px 3px gray; */
    }
    /* #tableOuter {
        height: 600px;
        overflow-y: scroll;
        overflow-x: scroll;
        text-align: center;
    }

    #inputTable {
        margin: auto;
    }

    #tableHead {
        color: black;
    }

    .button {
        width: 100%;
        height: 40px;
    } */
</style>