<script setup>
    import { defineProps } from 'vue';
    import { onMounted } from 'vue';

    const props = defineProps({
      item: Object,
      cancelBuyOrBook: Function,
      bookToBuy: Function,
    });

    onMounted(() => {
        console.log(props.item)
    })
</script>

<template>
    <!-- <tr v-for="(item, index) in allMovieTickets" :key="index" class="form-group"> -->
    <div class="singleTicket">
        <div class="singleTicketInfo">
            <img :src="item.imageURL" class="ticketImage"/>                        
            <div class="singleTicketTitle">{{ item.moviename }}</div>
            <div class="singleTicketInfoWords"> 
                <div>{{ item.name }}</div>
                <div>{{ item.startTime }}</div>
                <div>座位号 {{ item.seat.row + '-' + item.seat.col }}</div>
            </div>    
        </div> 
        <div class="singleTicketButtons">
            <button class="singleTicketButton btn btn-danger" type="button" v-if="item.isBooking" @click="cancelBuyOrBook(item,true)">取消预定</button>
            <button class="singleTicketButton btn btn-danger" type="button" v-else @click="cancelBuyOrBook(item,false)">退票</button>
            <button class="singleTicketButton btn btn-primary" type="button" v-show="item.isBooking" @click="bookToBuy(item)">付款</button>
        </div>
    </div>
        <!-- <div class="ticket ticketImage"><img :src="item.imageURL"/></div>
        <td class="ticket">{{ item.name }}</td>
        <td class="ticket">{{ item.moviename }}</td>
        <td class="ticket">{{ item.startTime }}</td>
        <td class="ticket">{{ item.seat.row + '-' + item.seat.col }}</td>
        <td class="ticket">
            <button class="ticketButton" v-if="item.isBooking" @click="cancelBuyOrBook(item,true)">取消预定</button>
            <button class="ticketButton" v-else @click="cancelBuyOrBook(item,false)">退票</button>
            <button class="ticketButton" v-show="item.isBooking" @click="bookToBuy(item)">付款</button>
        </td> -->
    <!-- </tr> -->
</template>

<style>
    .singleTicket {
        position: relative;
        width: 80%;
        height: 20%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        background-color: rgb(254, 254, 254);
        border-radius: 15px;
        /* border-color: transparent; */
        opacity: 0.9;

        margin-bottom: 10px;
        box-shadow: 5px 5px 5px rgb(4, 4, 4);
    }

    .singleTicketInfo {
        width: 60%;
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .ticketImage {
        width: 20%;  
        height: 100%; 
        object-fit: cover; 
        border-radius: 15px;
    }

    .singleTicketTitle {
        position: relative;
        width: 30%;
        
        font-family: 'ZCOOL';
        font-size: 2rem;
        margin-top: 8%;
        margin-left: 12%;
    }

    .singleTicketInfoWords {
        color: rgb(164, 161, 161);
        font-size: 1rem;
        width: 15%;
        height: 30%;
        margin-left: 15%;
        margin-top: 8%;
        text-align: center;
    }  

    .singleTicketButtons {
        position: relative;
        width: 40%;
    }

    .singleTicketButton {
        width: 30%;
        height: 30%;
        margin-left: 10%;
        margin-top: 13%;
    }
    /* .ticket {
        color: black;
        text-align: center;
        padding-right: 1%;
    }

    .ticketButton {
        width: 40%;
        border: transparent;
        border-radius: 5px;
        opacity: 0.8;
        margin-left: 10%;
        box-shadow: 1px 2px 3px gray;
    } */

</style>