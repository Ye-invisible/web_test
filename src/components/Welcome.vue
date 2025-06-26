<script setup>
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore()
    // const isGroup = userStore.isGroup
    // const singleMember = userStore.singleMember
    // const groupMember = userStore.groupMember
    // const allTickets = userStore.allTickets

    const storeBought = () => {
        if (userStore.isGroup){
            userStore.allTickets = [...userStore.allTickets,...userStore.groupMember]
        } else {
            userStore.allTickets.push(userStore.singleMember)
        }
    }
</script>

<template>
    <div id="welcome">
        <p id="welcomeWord">您可以开始选座了! &#128522;&#127881;</p>
        <button class="autoButton">帮我选座!&#128515;</button>
        <button class="autoButton" @click="storeBought">选完了，购买!&#x1F44D;</button>
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
        margin-top: 10%;
    }
</style>