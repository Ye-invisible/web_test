<script setup>
    import { useUserStore } from '@/stores/user';
    import { onMounted, onUnmounted } from 'vue';

    const userStore = useUserStore()

    let timer = null;

    const deleteOverTime = () => {
        // 定时的删除超时未支付的票
        const currentDate = new Date()
        const startTime = userStore.movie.startTime

        // 过滤掉过期的预订票
        userStore.allTickets = userStore.allTickets.filter(p => {
            if (p.isBooking && currentDate > startTime) {
                // 如果预订票过期，返回 false（不保留）
                return false
            }
            return true // 保留其他票
        })
    }

    onMounted(() => {
        timer = setInterval(deleteOverTime,1000)
    })

    onUnmounted(() => {
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
                    <td class="ticket">{{ userStore.movie.startTime }}</td>
                    <td class="ticket">{{ item.seat.row + '-' + item.seat.col }}</td>
                    <td class="ticket">
                        <button class="button" v-if="item.isBooking">取消预定</button>
                        <button class="button" v-else>退票</button>
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