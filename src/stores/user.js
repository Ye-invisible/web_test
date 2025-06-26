import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    showSize: 0, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0
  }),
  actions: {
  }
})