import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 专门用来实现用户选了座没买就返回主界面
    hasLogin: false,
    username: "",
    scale: -1,
    halfQuit: false,
    // singleHasChoose: false,
    // hasChosen: false,
    // 获取用户屏幕尺寸
    screenWidth: 0,
    hasChoose: 0, // 已经选取的座位数
    screenHeight: 0,
    originScreenWidth: 1707,
    originScreenHeight: 979,

    showSize: 2, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0,
    // 选座界面用来控制的一些布尔值，不用管
    isGroup: false,
    hasInput: false,
    autoSelect: false,
    isBooking: false,
    // isCleanupOperation: false, // 标记是否为清理操作
    isBuying: false,

    groupMember: [], // 仅在isGroup为true的时候有效
    singleMember: { name:"",
                    age:-1,
                    movieId: -1,
                    showtimeId: -1,
                    moviename: "",
                    startTime: -1,
                    seat:{row:-1,col:-1,angle:-1},
                    imageURL: "",
                    isBooking: false // 是否为预定票，如果不是预定票则为直接购买，点击购买时要弹出付款成功界面，否则不弹出
                  },
  
    // 考虑到会有很多个电影，添加如下结构
    movies: [] , // 里面成员是movie对象 
    // 下面这两个变量应该在由电影选择界面跳转到选座界面时设置好
    allTickets: [],  // 成员是singleMember
    movie:{
      // 这些内容由电影界面传递
      startTime: new Date(2025, 6, 30, 22, 50, 0), // 应该为一个date对象
      // endTime:-1,
      size: 2,
      name: "",
      movieId: -1,
      showtimeId: -1,
      imageURL: "",

      allTickets: [] // 该电影的所有购票人
    }
  }),
  actions: {
    reset() {
      console.log("Reset")
      this.groupMember = []
      this.isBooking = false // 是否为预定票
      this.hasChoose = 0
      // console.log(this.groupMember)
      this.singleMember = {
        name: "",
        age: -1,
        seat: { row: -1, col: -1, angle: -1 },
        movie: { name: "", size: -1, showTime: -1 }
      }
      this.isGroup = false
      this.hasInput = false
      this.autoSelect = false
      this.isBuying = false
    }
  }
})