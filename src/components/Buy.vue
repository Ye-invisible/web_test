<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore()
</script>

<template>
    <div id="buyTickets">
        <div id="buy">
        <div id="types">
            <RouterLink to="/buy/single" class="routerlink" >个人票</RouterLink>
            <RouterLink to="/buy/group" class="routerlink">团体票</RouterLink>
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
        height: 30%;
        text-align: center;
    }

    #types .router-link-exact-active {
        background: linear-gradient(45deg, #7f87e7, #94caf6);
        transition: 1s;
    }
    
    #rules {
        position: absolute;
        top: 86%;
        width: 90%;
        height: 10%;   
        color:  rgb(87, 85, 85);

        margin-left: 10%;
    }

    #ruleTitle {
        font-size: medium;
    }

    #ruleLists {
        font-size: small;
    }
</style>