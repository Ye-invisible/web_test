<script setup>
    import { useUserStore } from '@/stores/user';
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router';

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
    <div id="tableOuter">
        <table id="inputTable">
            <thead id="tableHead">
                <tr>
                    <th>姓名</th>
                    <th>年龄</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <tr v-for="(item, index) in members" :key="index" class="form-group">
                    <th><input
                        type="text"
                        class="form-input"
                        placeholder="请输入成员姓名"
                        v-model="item.name">
                    </th>
                    <th>
                        <input
                        type="number"
                        class="form-input"
                        placeholder="请输入成员年龄"
                        v-model="item.age">
                    </th>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- <RouterLink class="form-label sure" to="/welcome" @click.prevent="storeInfo">确定</RouterLink >
    <div>
      <RouterView></RouterView>
    </div>  -->
    <button class="form-label sure button" to="/welcome" @click.prevent="storeInfo">确定</button>
</template>

<style>
    @import '@/assets/form-style.css';
    #tableOuter {
        height: 600px;
        overflow-y: scroll;
    }

    #inputTable {
        width: 100%;
        margin: auto;
    }

    #tableHead {
        color: black;
    }

    .button {
        width: 100%;
        height: 40px;
    }
</style>