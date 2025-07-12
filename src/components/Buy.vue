<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import { useUserStore } from '@/stores/user';
    import { useRouter } from 'vue-router';

    const userStore = useUserStore()
    const router = useRouter()

    function buySingle() {
        router.push("/single")
    }

    function buyGroup() {
        router.push("/group")
    }
</script>

<template>
    <div id="buyTickets">
        <div id="buy">
            <div id="types">
                <!-- <RouterLink to="/buy/single" class="routerlink" >个人票</RouterLink>
                <RouterLink to="/buy/group" class="routerlink">团体票</RouterLink>  -->
                <button class="routerlink" @click="buySingle">个人票</button>
                <button class="routerlink" @click="buyGroup">团体票</button> 
            </div>  
        </div>

        <div id="view">
            <RouterView></RouterView>
        </div>
        <footer id="rules">
            <h1 id="ruleTitle">购票规则:</h1>
            <ol id="ruleLists">
                <li>少年(15岁以下)不能坐前三排</li>
                <li>老年人(60岁以上)不能坐最后3排</li>
                <li>选多个座位按Ctrl的同时点击</li>
            </ol>
        </footer>
    </div>
</template>

<style>
    #buyTickets {
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        width: 100%;
        height: 640px;

    }

    #types {
        position: relative;
        display: flex;

        /* justify-content: space-evenly; */
        list-style-type: none;
        background-color: transparent;
        border-radius: 5px;
        padding: 5px;
        z-index: 2;
        width: 300px;
    }

    .routerlink {
        margin-right: 10%;
        border-radius: 7px;
        width: 50%;
        height: 10%;
        text-align: center;
        text-decoration: none;
        color: black;
        padding: 4%;

        box-shadow: 5px 5px 4px;
    }
/* 
    #types .router-link-exact-active {
        background: linear-gradient(45deg, #7f87e7, #94caf6);
        transition: 1s;
    } */
    
    #rules {
        position: absolute;
        top: 80%;
        width: 100%;
        height: 10%;   
        color:  rgb(244, 243, 243);
        text-align: left;

        margin-left: 10%;
    }

    #ruleTitle {
        font-size: medium;
    }

    #ruleLists {
        font-size: small;
    }
</style>