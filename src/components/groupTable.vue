<script setup>
    import { useUserStore } from '@/stores/user';
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router';
import Circle from './User.vue';

    const userStore = useUserStore()
    const router = useRouter()
    const size = userStore.groupSize
    const members = ref([])

    for(let i = 0; i < size; i++){
        members.value.push({ name: '', age: '', seat: {row:-1,col:-1,angle:-1}})
    }

    const storeInfo = () => {
        // 检查输入是否完整
        for (let i = 0; i < members.value.length; i++) {
            if (members.value[i].name === '' || members.value[i].age === '') {
                alert(`请填写第${i + 1}位成员的姓名和年龄!`)
                return
            }
        }
        
        // 检查是否有重复姓名
        const names = members.value.map(member => member.name)
        const uniqueNames = new Set(names)
        if (names.length !== uniqueNames.size) {
            alert("团体成员姓名不能重复!")
            return
        }
        
        // 检查是否有人已经买过票
        for (let member of members.value) {
            const existingTicket = userStore.allTickets.find(ticket => ticket.name === member.name)
            if (existingTicket) {
                alert(member.name + " 已经买过票了!")
                return
            }
        }
        
        // 存储值到pinia
        userStore.groupMember = members.value
        userStore.hasInput = true

        console.log("groupMember: ")
        console.log(userStore.groupMember)

        // 页面跳转
        router.push("/welcome")
    }

    const rows = computed(() => Array.from({ length: userStore.groupSize }))
</script>

<template>
    <!-- <Circle id="circle"></Circle> -->
    <div id="groupTable">
        <div id="tableOuter">
        <table id="inputTable" class="table align-middle table-borderless table-danger table-hover">
            <thead id="tableHead">
                <tr>
                    <th scope="col">姓名</th>
                    <th scope="col">年龄</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <tr v-for="(item, index) in members" :key="index" class="form-group">
                    <td scope="row"><input
                        type="text"
                        class="form-input"
                        placeholder="请输入成员姓名"
                        v-model="item.name">
                    </td>
                    <td scope="row">
                        <input
                        type="number"
                        class="form-input"
                        placeholder="请输入成员年龄"
                        v-model="item.age">
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
    

    <!-- <RouterLink class="form-label sure" to="/welcome" @click.prevent="storeInfo">确定</RouterLink >
    <div>
      <RouterView></RouterView>
    </div>  -->
    <button class="form-label sure button btn btn-light" to="/welcome" @click.prevent="storeInfo">Finish</button>
</template>

<style>
    @import '@/assets/form-style.css';
    /* #circle {
        position: absolute;
        width: 20%;
        height: 50%;
        top: 20%;
        left: 1%;
    } */
    #groupTable {
        display: flex;
        flex-direction: row;
    }

    #tableOuter {
        height: 700px;
        width: 50%;
        margin-left: 25%;
        text-align: center;
        overflow-y: scroll;
        margin-top: 1%;
        border-radius: 10px;
        scrollbar-width: none;
        /* display: flex;
        flex-direction: column; */
        box-shadow: 10px 10px 10px rgb(52, 1, 1);
    }

    #inputTable {
        width: 100%;
        margin: auto;
        /* 自定义表格样式 */
        --bs-table-bg: #8f0101; /* 表格背景色 */
        --bs-table-striped-bg: #ffcdd2; /* 条纹表格的条纹颜色 */
        --bs-table-hover-bg: #ef9a9a; /* 悬停时的背景色 */
        --bs-table-color: #ffffff; /* 文字颜色 */
        --bs-table-border-color: transparent; /* 边框颜色 */

        border-color: transparent;
        opacity: 0.9;
    }

    #tableHead {
        color: rgb(255, 255, 255);
        /* text-align: center; */
    }

    .button {
        position: absolute;
        width: 10%;
        height: 10%;
        font-family: 'Double';
        font-size: 200%;
        color: white;
        background-color: brown;
        /* margin-left: 25%; */
        top: 40%;
        left: 80%;
        border-radius: 200px;
        border-color: transparent;
        box-shadow: 10px 10px 10px black;
    }
</style>