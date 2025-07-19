## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development
在根目录下运行下面这条命令，点击产生的链接即可
```sh
npm run dev
```
#### 项目结构

只需关注`src`文件夹的内容即可

##### `App.vue `

主程序文件,该文件template的内容就是网页布局的html，所以大家开发新的选择电影界面，要使界面显示，需要在`App.vue`里挂载该界面(具体可参考我在`App.vue`里是如何挂载我的选座界面的)

##### views文件夹

主要的界面文件，现有的三个`.vue`文件分别是我的选座界面的头部，侧边栏，以及选座区。大家要开始写电影界面，只要在该目录下新建一个.vue文件就可以直接开始设计了。

##### `utils`文件夹

主要放一些工具函数，像我在`geometry.js`文件里就放了一些我绘制选座座位的时候用到的一些计算角度，坐标的函数。】

##### `stores`文件夹

`user.js`文件里存放的就是相当于全局变量的一些值，这些值在不同界面中共享，要使用这个对象中存放的值，只需要在相应的文件中首先导入，然后使用`user.js`中提供的`useUserStore`函数创建一个对象，然后这些全局变量就可以作为对象的属性引用了。(使用的是`pinia`，一个和`vue`结合的存储机制)

```javascript
import { useUserStore } from '@/stores/user'  // 先导入，@代表src目录

const userStore = useUserStore() // 然后创建对象

console.log(userStore.isBooking)  // 然后就可以直接使用了!
```

##### `router`文件夹

路由机制是实现页面跳转的机制，要实现页面跳转，需要在index.js文件中先配置路径和页面的映射关系

```javascript
const routes = [
  { path: '/buy', component: Buy, children: [
    { path: 'single', component: singleForm },
    { path: 'group', component: groupForm },
    { path: '', redirect: '/buy/single' }
  ]},
  { path: '/movie', component: Movie},
  { path: '/tickets', component: Tickets},
  { path: '/welcome', component: Welcome},
  { path: '/groupTable', component: GroupTable},
  { path: '/app', component: App},
]
```

然后要实现页面跳转，只需按如下操作

```javascript
import { useRouter } from 'vue-router';
const router = useRouter()

router.push("/buy/single") // push要跳转的路径
```

##### `assets`文件夹

是存放资源的目录，比如图片，图标，外部字体

##### `components`文件夹

一些可以复用的组件，比如大家如果要设计电影界面的话，每一个电影的展示块就可以设计成一个可以重复使用的component。像我在选座界面使用的一些组件，比如按钮，填写信息面板，就存放在components文件夹下。（就页面,或者一个页面中占比较大的板块一律放views文件夹，页面中的一小部分这样就放components）

## 重点关注

大家不用看我的座位部分的代码，因为大家提到要做可以选择不同电影的界面，所以我对一些数据结构进行了改动，以适应多电影的需要。

下面是stores/user.js里面所有的数据，很多是我座位界面用来控制逻辑或者交互的变量，不用管，大家只要看movie对象就行。需要实现的就是，用户在浏览将要设计的选电影界面的时候，当点击某个电影，就会进入到选座界面，**这时候需要编写代码，设置好`movie`对象的`name,size,startTime,endTime`值，然后把`movie`对象的`allTickets`赋值到外部的这个`allTickets`数组**，这个数组我在选座界面要使用到，来绘制座位。

```javascript
{
    showSize: 1, // 放映厅大小 0 小 1 中 2 大
    groupSize: 0,
    // 选座界面用来控制的一些布尔值，不用管
    isGroup: false,
    hasInput: false,
    autoSelect: false,
    isBooking: false,
    // isCleanupOperation: false, // 标记是否为清理操作
    isBuying: true,

    groupMember: [], // 仅在isGroup为true的时候有效
    singleMember: { name:"",
                    age:-1,
                    seat:{row:-1,col:-1,angle:-1},
                    isBooking: false // 是否为预定票，如果不是预定票则为直接购买，点击购买时要弹出付款成功界面，否则不弹出
                  },
  
    // 考虑到会有很多个电影，添加如下结构
    movies: [] , // 里面成员是movie对象 
    // 下面这两个变量应该在由电影选择界面跳转到选座界面时设置好
    allTickets: [],  // 成员是singleMember
    movie:{
      // 这些内容由电影界面传递
      name:"杀破狼", 
      startTime: new Date(2025, 6, 30, 22, 50, 0), // 应该为一个date对象
      endTime:-1,
      size: 1,

      allTickets: [] // 该电影的所有购票人
    }
  }
```

所以只需看App.vue和stores/user.js文件即可。

#### 备注

我的选座界面已经初步实现了大作业文档要求的所有功能，但是还有蛮多bug，我会继续测试和修改，大家要设计新界面可以新开一个分支，把代码推到新分支上，我这个目前的test分支就用来维护我们大作业的单电影版本吧。
