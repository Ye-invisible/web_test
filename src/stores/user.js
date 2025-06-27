import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    showSize: 0, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0,
    isGroup: false,
    hasInput: false,

    groupMember: [], // 仅在isGroup为true的时候有效
    singleMember: {name:"",age:-1,seat:{row:-1,col:-1,angle:-1}},

    allTickets: [],  // 成员是singleMember
  }),
  actions: {
  }
})