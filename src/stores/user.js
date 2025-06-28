import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    showSize: 0, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0,
    isGroup: false,
    hasInput: false,
    autoSelect: false,

    groupMember: [], // 仅在isGroup为true的时候有效
    singleMember: { name:"",
                    age:-1,
                    seat:{row:-1,col:-1,angle:-1},
                    size:-1, // 放映厅大小
                    // 现在这个movie对象还用不上，但是考虑到我们之后会列很多电影，我先在这里加上
                  },

    allTickets: [],  // 成员是singleMember

    // 考虑到会有很多个电影，添加如下结构
    movies: [] ,
    // 里面成员是movie对象 
    movie:{
      // 这些内容由电影界面传递
      name:"", 
      startTime:-1,
      endTime:-1,
      size: 1,

      allTickets: [] // 该电影的所有购票人
    }
  }),
  actions: {
    reset() {
      console.log("Reset")
      this.groupMember = []
      console.log(this.groupMember)
      this.singleMember = {
        name: "",
        age: -1,
        seat: { row: -1, col: -1, angle: -1 },
        movie: { name: "", size: -1, showTime: -1 }
      }
      this.isGroup = false
      this.hasInput = false
      this.autoSelect = false
    }
  }
})