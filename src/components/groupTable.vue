<script setup>
    import { useUserStore } from '@/stores/user';
    import { ref, computed } from 'vue'

    const userStore = useUserStore()
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
                <tr v-for="(item, index) in rows" :key="index" class="form-group">
                    <th><input
                        type="text"
                        class="form-input"
                        placeholder="请输入成员姓名"
                        >
                    </th>
                    <th>
                        <input
                        type="number"
                        class="form-input"
                        placeholder="请输入成员年龄"
                        >
                    </th>
                </tr>
            </tbody>
        </table>
    </div>

    <RouterLink  class="form-label sure" to="/welcome">确定</RouterLink >
    <div>
      <RouterView></RouterView>
    </div> 
    
</template>

<style>
    @import '@/assets/form-style.css';
    #tableOuter {
        height: 600px;
        overflow-y: scroll;
    }

    #inputTable {
        margin: auto;
    }

    #tableHead {
        color: black;
    }
</style>