import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    showSize: 0, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0,
    isGroup: false,

    groupMember: [], // 仅在isGroup为true的时候有效
    singleMember: {name:"",age:-1,row:-1,col:-1},

    allTickets: [],  // 格式大概是这样，一个对象：{name:"kk",tickets:["1-2","2-19"],size:2，age:10} size代表是放映厅大小
  }),
  actions: {
  }
})