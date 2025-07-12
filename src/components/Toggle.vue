<script setup>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js';
    import Buy from './Buy.vue';
</script>

<template>
    <div id="toggle">
        <!-- 按钮触发侧边栏 -->
        <button class="btn btn-danger m-3 toggleButton" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar">
        Buy
        </button>

        <!-- 侧边栏内容 -->
        <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebar" aria-labelledby="sidebarLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="sidebarLabel">Information</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <!-- <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action active">首页</a>
                <a href="#" class="list-group-item list-group-item-action">关于我们</a>
                <a href="#" class="list-group-item list-group-item-action">服务</a>
                <a href="#" class="list-group-item list-group-item-action">联系方式</a>
                </div> -->
                <Buy/>
            </div>
        </div>
    </div> 
</template>

<style>
    #toggle {
        /* position: relative; */
        /* top: 100%; */
        left: 0%;
        height: 100px;

        z-index: 7;
    }


    .offcanvas {
        position: relative;
        /* top: 50%; */

        height: 800%;
        /* height: 100%;
        width: 100%; */

        background-color: rgb(113, 3, 3);
        color: white;
        border-bottom-right-radius: 20px;
        border-top-right-radius: 20px;
    }

    .offcanvas-title {
        font-family: 'Double';
        font-size: 2rem;
    }

    .offcanvas-body {
         /* 标准属性 */
        scrollbar-width: none; 
        /* scrollbar-color: #d40404 #fefefe;  */
    }

    .toggleButton {
        position: relative;
        bottom: 0%;
        font-family: 'Double';
        font-size: 20px;
        padding-left: 20%;
        padding-right: 20%;
        opacity: 0.9;
        font-weight: 700;
        background-color: rgb(164, 22, 22);
    }
</style>