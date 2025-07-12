<script setup>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js';
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div id="container" class="container-fluid">
            <RouterLink class="navbar-brand" to="/app" id="siteTitle">狗眼</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <img id="icon" src="../assets/images/dog.ico"/>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav" id="tabs">
                    <li class="nav-item tab">
                        <RouterLink class="nav-link active" aria-current="page" to="/app">movie</RouterLink>
                    </li>
                    
                    <li class="nav-item tab">
                        <RouterLink class="nav-link" to="/seats">seats</RouterLink>
                    </li>
                    <li class="nav-item tab">
                        <RouterLink class="nav-link" to="/tickets">ticketList</RouterLink>
                    </li>
                    <!-- <li class="nav-item tab">
                        <img src=""/>
                    </li> -->
                </ul>
            </div>
        </div>
    </nav>
</template>

<style>
    #all {
        /* background-color: transparent; */
        width: 100%;
        /* height: 10%; */
        position: fixed;
        top: 0%;
        left: 0%;
        /* background-color: rgb(107, 106, 106); */
        background-color: #630202;
    }

    #header {
        height: 30%;
        background-image: url(../assets/images/background.jpg);
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5); /* 水平 垂直 模糊半径 扩散半径 颜色 */
    
        z-index: 1;
    }

    #container {
        background-color: transparent;
        /* z-index: 0; */
    }

    #siteTitle {
        font-family: 'Regular', monospace;
        font-size: 70px;
    }

    #tabs {
        font-size: 20px;
    }

    .tab {
        font-family: 'Double', monospace;
        font-size: 30px;
        padding-left: 20px;
        padding-right: 60px;
    }

    #icon {
        width: 80px;
        height: 60px;
        margin-left: -15px;
        margin-right: 20px;
    }
/* 

    #header {
        text-align: center;
        font-size: 100px;
        margin-top: 1%;
        font-family: 'Regular'; 
        background: linear-gradient(45deg, #bfc4f9, #044274);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent; 
    } */
</style>