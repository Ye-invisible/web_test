<script setup>
    import { ref, onMounted, onUnmounted, watch } from 'vue'
    import { getCircleCenterAndRadius, getCentralAngle,rotatePointAroundCenter } from '@/utils/geometry'
    import { useUserStore } from '@/stores/user'

    const userStore = useUserStore()

    const seats = ref(null)
    const seatList = ref([])
    const selectedList = ref([])  // 选中：黄色
    // const soldList = userStore.allTickets // 卖出：红色
    let ctx = null
    let timer = null

    // 下面是一些canvas绘制电影院布局时的固定参数，尽量别修改
    let rowNums = 6
    let colNums = 17
    let midSeatWidth = 34
    let bigSeatWidth = 26
    let smallSeatWidth = 34
    let seatWidth = 34 // 200个座位时的最合适座位大小
    let A = [150,220]
    let B = [950,240]
    let M = [400,195]

    const resetShowSizeParam = () => {
        // 监视用户选择的放映厅大小的变化
        clearCanvas()
        // 按照用户选择的放映厅大小赋值不同的固定值
        let size = userStore.showSize
        if(size == 0){
            seatWidth = smallSeatWidth
            rowNums = 6 
            colNums = 17
            A = [150,220]
            B = [950,240]
            M = [400,195]
        } else if(size == 1) {
            seatWidth = midSeatWidth
            rowNums = 10 
            colNums = 20
            A = [80,80]  
            B = [890,80]
            M = [400,50]
        } else if(size == 2){
            seatWidth = bigSeatWidth
            rowNums = 12 
            colNums = 26
            A = [80,80]  
            B = [890,80]
            M = [400,50]
        }

        reDrawAll()
        selectedList.value = []
    }

    watch(() => userStore.showSize, resetShowSizeParam)

    watch(() => userStore.allTickets.length, () => {
        // console.log("allTickets Changed!")
        // console.log(userStore.isCleanupOperation)
        
        // 如果是清理操作，不执行团体选座检查
        // if (userStore.isCleanupOperation) {
        //     console.log("Cleanup operation detected, skipping group seating check")
        //     return
        // } else
        
        // 监视用户是否确认购买票
        // 如果是团体购票，因为我没有在welcome.vue中写存储团体座位的逻辑，放在这里写，使用selectedList数组
        if(userStore.isBuying && !checkSameLineAndAdjacent()){
            alert("团体选座必须在同一排且无间隔!")
            return
        } else {
            // 符合条件，保存座位内容
            let length = selectedList.value.length
            let allLength = userStore.allTickets.length
            for(let i = 0; i < length; i++){
                userStore.allTickets[allLength - 1 - i].seat = selectedList.value[i]
            }
        }

        // 如果确认，把座位变成红色
        // console.log(userStore.allTickets)
        reDrawAll()
        selectedList.value = [] // 清空选取的座位数组
    }, { deep: true })

    watch(() => userStore.autoSelect, () => {
        if (userStore.autoSelect == false)return
        // 监视用户是否要求自动选票
        // 这里其实只要操作两个数组，分别是selectedList(团体购票)，singleMember(个人购票)
        // 因为老师说没有特别要求，我就自己规定一个自动选票的规则了
        // 首先取中间位置，如果中间位置没有，向同一排两边找，
        // 同一排没有，在相邻上下两排重复此操作
        const horizontalWidth = Math.ceil(colNums/2)  // 两边找范围
        const verticalHeight = Math.ceil(rowNums/2)    // 上下找范围

        const size = userStore.groupSize
        let [row,col] = getShowSize(userStore.showSize)
        // 首先处理个人购票的情况
        if (!userStore.isGroup) {
            let [selRow,selCol] = autoSingleSelect(row,col,horizontalWidth,verticalHeight)
            for(let seat of seatList.value){
                if(seat.row == selRow && seat.col == selCol){
                    selectedList.value.push(seat)
                    userStore.singleMember.seat.col = selCol
                    userStore.singleMember.seat.row = selRow
                    break
                }
            }
        } else {
            // 设置groupMember的值
            let selRow = autoGroupSelect(row,col,horizontalWidth,verticalHeight) 
            console.log("out autoGroupSelect return ", selRow)
            if(selRow == -1) {
                alert("没有符合要求的座位,无法自动选座。请手动选座。") 
                return
            }
            // console.log("selRow: " + selRow)
            let edge = Math.floor((col - size) / 2)
            // console.log("edge " + edge)
            // console.log("col " + col)
            // console.log("size " + size)
            // console.log(userStore.groupMember)
            for (let i = 0; i < userStore.groupMember.length; i++) {
                userStore.groupMember[i].seat.row = selRow
                userStore.groupMember[i].seat.col = edge + i + 1
                for(let seat of seatList.value){
                    if(seat.row == selRow && seat.col == edge + i + 1) selectedList.value.push(seat)
                }
            }
        }
        // console.log("Out autoselect")
        reDrawAll()
    })   

    const autoGroupSelect = (row,col,horizontalWidth,verticalHeight) => {
        let [hasYoung, hasOld] = calGroupAge()
        console.log("get in autoselect")
        console.log("hasYoung", hasYoung, "hasOld", hasOld)

        // 自动选团体位置
        let cenRow = Math.floor(row / 2)
        console.log("cenRow " + cenRow)
        console.log("verticalHeight" + verticalHeight)
        for (let i = 0; i <= verticalHeight; i++){
            // console.log("i" + i)
            // console.log("hasYoung" + hasYoung)
            // if (hasYoung && (cenRow + i) <= 3 || hasOld &&  (cenRow - i) >= row - 4){
            //     // alert("团队里有青年人,不能选前三排!")
            //     continue
            // } 
            if (cenRow + i <= row && !(hasOld && (cenRow + i) >= row - 2 || hasYoung && (cenRow + i) <= 3)) {
                console.log("in 1")
                if(!isLineTaken(cenRow + i,col)) return cenRow + i
                // continue
            }

            if (cenRow - i > 0 && !(hasYoung && (cenRow - i) <= 3 || hasOld && (cenRow - i) >= row - 2)) {
                console.log("in 2")
                if(!isLineTaken(cenRow - i,col)) return cenRow - i
                // continue
            }
            
        }
        return -1
    }

    const isLineTaken = (row,col) => {
        // 帮助函数，判断某行有没有已经售出的座位
        // 如果有，判断是否足够边缘，以至于可以使团体所有人居中坐
        // 参数：row 要判断的行数 size 是团体的购票人数
        // 先判断要团体整体居中坐至少要什么范围内没有被占用
        let size = userStore.groupSize
        console.log("In isLineTaken")
        console.log("size: " + userStore.groupSize)
        let edge = Math.floor((col - size) / 2) 
        console.log("edge: " + edge)
        for (let p of userStore.allTickets){
            if(p.seat.row == row && (p.seat.col > edge && p.seat.col < col - edge)){
                console.log("isLineTaken return true")
                return true
            }
        }
        console.log("isLineTaken return false")
        return false
    }

    const autoSingleSelect = (row,col,horizontalWidth,verticalHeight) => {
        // 自动选个人位置
        let hasYoung = userStore.singleMember.age < 15
        let hasOld = userStore.singleMember.age > 60

        let cenCol = Math.floor(col / 2)
        let cenRow = Math.floor(row / 2)
        // console.log("cenRow " + cenRow)
        // console.log("cenCol " + cenCol)
        for (let i = 0; i < verticalHeight; i++){
            // let flag = false
            // if (hasYoung && (cenRow - i) <= 3 || hasOld && (cenRow + i) >= row - 4){
            //     alert("团队里有青年人,不能选前三排!")
            //     continue
            // } 

            for (let j = 0; j < horizontalWidth; j++){
                if (hasOld && (cenRow + i) >= row - 4 || hasYoung && (cenRow + i) <= 3) {
                    // console.log("cenRow + i  out i = " + i)
                    break
                }
                if(!isSingleTaken(cenRow + i,cenCol+j)) return [cenRow + i,cenCol+j]
                if(!isSingleTaken(cenRow + i,cenCol-j)) return [cenRow + i,cenCol-j]
            }
            for (let j = 0; j < horizontalWidth; j++){
                if (hasYoung && (cenRow - i) <= 3 || hasOld && (cenRow - i) > row - 3) {
                    // console.log("cenRow - i  out i = " + i)
                    break
                }
                if(!isSingleTaken(cenRow - i,cenCol+j)) return [cenRow - i,cenCol+j]
                if(!isSingleTaken(cenRow - i,cenCol-j)) return [cenRow - i,cenCol-j]
            }
        }
    }

    const reDrawAll = () => {
        clearCanvas()
        drawScreen()
        drawSeats()
        drawChangedSeats()

        if(userStore.showSize == 0)drawSmallBackGround()
        else drawBackGround()
    }

    const isSingleTaken = (row,col) => {
        // 确认这个椅子有没有被选(在不在userStore的allTickets里面)
        // 传一个椅子的位置，判断有没有被占用
        return userStore.allTickets.some(s => s.seat.row === row && s.seat.col === col)
    }

    const getShowSize = (size) => {
        // 这个函数返回一些关于不同大小放映厅的参数：行数和列数，
        if (size == 0){
            // 小放映厅
            return [6,17]
        } else if (size == 1){
            return [10,20]
        } else {
            return [12,26]
        }
    }
    
    const clearCanvas = () => {
        // 清理整个画布
        if (ctx) {
            ctx.clearRect(0, 0, seats.value.width, seats.value.height)
        }
    }

    const checkSameLineAndAdjacent = () => {
        if(selectedList.value.length == 0) return false
        let list = selectedList.value
        // 检查团体选座是否在同一排     
        let row = list[0].row
        for (let seat of list) {
            if (seat.row != row) return false
        }
        // 检查座位是不是挨着的
        list.sort((p1,p2) => p1.col - p2.col)
        for (let i = 0; i < list.length - 1; i++) {
            if(!(list[i].col == list[i+1].col - 1)){
                return false
            }
        }
        return true
    }

    const drawSeats = () => {
        // clearCanvas()
        // 大放映厅最佳: rowNums = 12 colNums = 26
        // 中放映厅最佳: rowNums = 10 colNums = 20
        // 小放映厅最佳: rowNums = 6 colNums = 17
        // 该函数绘制初始所有座位
        seatList.value = [] // 每次重绘前清空
        // 小型放映厅采用
        // let A = [150,220]
        // let B = [950,240]
        // let M = [400,195]
        // 中型和大型放映厅采用
        // let A = [80,80]  
        // let B = [890,80]
        // let M = [400,50]
        let {cx, cy, r} = getCircleCenterAndRadius(A,B,M)
        let angleAll = getCentralAngle(A,B,[cx,cy])
        let angleStep = (angleAll / 19) * (seatWidth / 34) // 按比例缩放行间距
        let leanStep = 50 * (seatWidth / 34) // 按比例缩放座位间距

        for (let i = 0; i < colNums; i++) {
            let angle = angleAll / 2 - angleStep * i    // 计算每个座位按照中心旋转的角度
            let [topX, topY] = rotatePointAroundCenter(A[0],A[1],cx,cy,angleStep*i)
            
            for (let j = 0; j < rowNums; j++) {              
                let x = topX + Math.sin(angle) * leanStep * j
                let y = topY + Math.cos(angle) * leanStep * j
                // const seatNumber = `${j + 1}-${i + 1}` // 座位号格式：行-列
                const seatNumber = `${rowNums - j}-${i+1}` // 座位号格式：行-列
                seatList.value.push({x, y, angle, row: rowNums - j, col: i + 1}) // 记录选取的座位
                drawSingleSeat(x, y, -angle, 0, seatNumber)
            }
        }
    }

    const drawChangedSeats = () => {
        // 重新绘制被选中的座位为黄色
        for(let seat of selectedList.value){
            // const seatNumber = `${seat.row + 1}-${seat.col + 1}`
            const seatNumber = `${seat.row}-${seat.col}`
            drawSingleSeat(seat.x, seat.y, -seat.angle, 1, seatNumber)
        }
        // 重新绘制被选中的座位为红色
        for(let p of userStore.allTickets){
            // console.log("drawing red!")
            const seatNumber = `${p.seat.row}-${p.seat.col}`
            drawSingleSeat(p.seat.x, p.seat.y, -p.seat.angle, 2, seatNumber)
        }
    }

    const drawSingleSeat = (x, y, angle, status, seatNumber = '') => {
        // 绘制单个座位的函数

        // status 如果是1 就是选中 黄色
        // 如果是 2 就是售出 红色

        // 计算缩放比例，基于seatWidth
        const scale = seatWidth / 34 // 原始宽度是34
        const seatHeight = 28 * scale // 原始高度是28
        
        // 绘制单个座位
        const seat = new Path2D();
        // 以(0,0)为中心绘制座位，所有尺寸都乘以scale
        seat.moveTo(-13 * scale, -10 * scale);
        seat.lineTo(-13 * scale, -14 * scale);
        seat.lineTo(13 * scale, -14 * scale);
        seat.lineTo(13 * scale, -10 * scale);
        seat.moveTo(9 * scale, -6 * scale);
        seat.arc(13 * scale, -6 * scale, 4 * scale, Math.PI, 0, false);
        seat.lineTo(17 * scale, 14 * scale);
        seat.lineTo(-17 * scale, 14 * scale);
        seat.lineTo(-17 * scale, -6 * scale);
        seat.arc(-13 * scale, -6 * scale, 4 * scale, Math.PI, 0, false);
        seat.lineTo(-9 * scale, 9 * scale);
        seat.lineTo(9 * scale, 9 * scale);
        seat.lineTo(9 * scale, -6 * scale);

        ctx.save();
        ctx.translate(x + 17 * scale, y + 14 * scale); // 调整中心点位置
        ctx.rotate(angle);
        if (status == 1) {
            ctx.fillStyle = '#FF0' // 选中为黄色
        } else if(status == 2){
            ctx.fillStyle = '#F00' // 售出为红色
        } else {
            ctx.fillStyle = '#0F0'
        }
        ctx.fill(seat)
        ctx.stroke(seat);
        
        // 绘制座位号
        if (seatNumber) {
            ctx.fillStyle = '#000' // 文字颜色为黑色
            ctx.font = `${10 * scale}px Arial` // 字体大小按比例缩放
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(seatNumber, 0, 20 * scale) // 在座位下方绘制文字
        }
        
        ctx.restore();
    }

    const drawScreen = () => {
        // 绘制底部的屏幕，固定位置
        ctx.moveTo(280,580)
        ctx.lineTo(280,600)
        ctx.lineTo(720,580)
        ctx.lineTo(720,600)
        ctx.fillStyle = '#BBB'
        ctx.fill()
    }

    const drawBackGround = () => {
        // 绘制背景框
        // 中大型放映厅，固定值，尽量不修改，可以试着改一下样式，让它好看一点
        let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560]) 
        // 中大型放映厅
        // let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560]) 
        // 绘制上面那个圆弧
        let startAngle = Math.atan2(590 - cy, 140 - cx)
        let endAngle = Math.atan2(590 - cy, 860 - cx)
        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, endAngle, false) // false: 顺时针, true: 逆时针
        ctx.stroke()
        // 绘制下面那个圆弧
        let {cx: cx1, cy: cy1, r: r1} = getCircleCenterAndRadius([60,60],[940,60],[500,30])
        // console.log(cx1,cy1,r1)
        startAngle = Math.atan2(60 - cy1, 60 - cx1)
        endAngle = Math.atan2(60 - cy1, 940 - cx1)
        ctx.beginPath()
        ctx.arc(cx1, cy1, r1, startAngle, endAngle, false) 
        ctx.stroke()

        ctx.lineWidth = 0.8
      
        ctx.beginPath()
        ctx.moveTo(60,60)
        ctx.lineTo(140,590)
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(940,60)
        ctx.lineTo(860,590)
        // ctx.lineTo(500,20)
        ctx.stroke()
    }

    const drawSmallBackGround = () => {
        // 绘制背景框
        // 小型放映厅，固定值
        let {cx,cy,r} = getCircleCenterAndRadius([220,530],[820,540],[500,500]) 
        // 绘制下面那个圆弧
        let startAngle = Math.atan2(540 - cy, 178 - cx)
        let endAngle = Math.atan2(540 - cy, 830 - cx)
        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, endAngle, false) // false: 顺时针, true: 逆时针
        ctx.stroke()
        // 绘制上面那个圆弧
        let {cx: cx1, cy: cy1, r: r1} = getCircleCenterAndRadius([200,180],[800,180],[500,150])
        // console.log(cx1,cy1,r1)
        startAngle = Math.atan2(60 - cy1, 60 - cx1)
        endAngle = Math.atan2(60 - cy1, 940 - cx1)
        ctx.beginPath()
        ctx.arc(cx1, cy1, r1, startAngle, endAngle, false) 
        ctx.stroke()

        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(100,200)
        ctx.lineTo(180,540)
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(900,200)
        ctx.lineTo(830,543)
        // ctx.lineTo(500,20)
        ctx.stroke()
    }

    const handleCanvasClick = (e) => {
        // 检查是否输入了信息
        if(!userStore.hasInput){
            alert("请先输入购票信息!")
            return 
        }
        // 检查已选座位和人数是否一致
        // if (userStore.isGroup && selectedList.value.length >= userStore.groupSize){
        //     alert("选取座位数不能超过购票人数!")
        //     return 
        // } else if (selectedList.value.length >= 1){
        //     alert("单人票同时只能选取一个座位!")
        //     return
        // }
        const rect = seats.value.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // 检查是否按下了Ctrl键
        const isCtrlPressed = e.ctrlKey
        const scale = seatWidth / 34 // 计算缩放比例

        for (let seat of seatList.value) {
            let dx = mouseX - (seat.x + 17 * scale)
            let dy = mouseY - (seat.y + 14 * scale)
            let angle = -seat.angle
            let localX = dx * Math.cos(angle) - dy * Math.sin(angle)
            let localY = dx * Math.sin(angle) + dy * Math.cos(angle)
            if (
                localX >= -17 * scale && localX <= 17 * scale &&
                localY >= -14 * scale && localY <= 14 * scale
            ) {
                // console.log("Seat clicked:", seat)
                if(selectedList.value.some(s => s.row === seat.row && s.col === seat.col)){
                    selectedList.value.splice(selectedList.value.findIndex(s => s.row === seat.row && s.col === seat.col), 1)

                } else if (userStore.isGroup && selectedList.value.length >= userStore.groupSize){
                    // 检查已选座位和人数是否一致
                    alert("选取座位数不能超过购票人数!")
                    return 
                } else if (!userStore.isGroup && selectedList.value.length >= 1){
                    // 检查已选座位和人数是否一致
                    alert("单人票同时只能选取一个座位!")
                    return
                }else if(selectedList.value.length > 0 && !isCtrlPressed){
                    alert("要同时选取多个座位,按下ctrl键")
                    return
                } else{
                    if(userStore.isGroup){
                        if(checkGroupChoose(seat.row, seat.col))selectedList.value.push(seat)
                    } else {
                        if(checkSingleChoose(seat))selectedList.value.push(seat)
                    }
                    // selectedList.value.push(seat)
                }
                // 重绘
                // clearCanvas()
                // drawSeats()
                // drawChangedSeats()
                // if(userStore.showSize == 0){
                //     drawSmallBackGround()
                // } else {
                //     drawBackGround()
                // }
                // drawScreen()
                reDrawAll()
                break
            }
        }
    }

    const checkSingleChoose = (seat) => {
        // 检查单人手动选座
        // 要求：小孩不在前三排，老人不在后三排
        const age = userStore.singleMember.age
        if (age < 15 && seat.row < 4){
            alert("小于15岁不能选择前三排!")
            return false
        } else if (age > 60 && seat.row > rowNums - 3){
            alert("大于60岁不能选择后三排!")
            return false
        }
        userStore.singleMember.seat = seat
        return true
    }

    const checkGroupChoose = (row,col) => {
        // 检查团体选座
        // 要求：首先所有成员必须在同一排，且挨着 其次遵守小孩不在前三排，老人不在后三排的规则
        //检查是否在同一排且相邻
        // console.log("In checkGroupChoose")
        // console.log(selectedList.value)
        let selectedColList = selectedList.value.map(seat => seat.col)
        // console.log("selectedColList")
        // console.log(selectedColList)
        let leftMostCol = Math.min(...selectedColList)
        let rightMostCol = Math.max(...selectedColList) 
        // console.log("leftMostCol" + leftMostCol)
        // console.log("rightMostCol" + rightMostCol)
        if(selectedList.value.length > 0){
            let groupRow = selectedList.value[0].row
            let groupCol = selectedList.value[0].col
            // console.log("groupCol" + groupCol)
            // console.log("col" + col)
            if(!(row == groupRow && (col == leftMostCol - 1 || col == rightMostCol + 1))) {
                alert("团体成员必须在同一排且相邻!")
                return false
            }
        }
        // 检查是否有年龄限制，不符合要求的
        let [haveYoung,haveOld] = calGroupAge()
        if(haveYoung && row < 3){
            alert("小于15岁不能选择前三排!")
            return false
        } else if (haveOld && row > rowNums - 4){
            alert("大于60岁不能选择后三排!")
            return false
        }
        return true
    }

    const calGroupAge = () => {
        // 计算一下团体里是否有特殊年龄段的人群
        // console.log("in calGroupAge")
        // console.log("groupMember")
        // console.log(userStore.groupMember)
        let haveYoung = false
        let haveOld = false

        for (const p of userStore.groupMember) {
            // console.log(p)
            if (p.age < 15) {
                haveYoung = true
            } else if(p.age > 60){
                haveOld = true
            }
        }

        return [haveYoung,haveOld]
    }

    onMounted(() => {
        ctx = seats.value.getContext('2d')
        resetShowSizeParam()
        // drawGround()
        // seats.value.addEventListener('click', handleCanvasClick)
        // timer = setInterval(drawChangedSeats,1000)
    })

    watch(() => userStore.halfQuit, (newValue) => {
        console.log("in halfQuit watch!")
        if(newValue == true){
            userStore.halfQuit = false
            selectedList.value = []
            console.log(userStore.halfQuit)
        }
        
        reDrawAll()
    })
    onUnmounted(() => {
        // clearInterval(timer)
    })

</script>

<template>
    <div id="seat">
        <canvas ref="seats" width="950" height="650" @click="handleCanvasClick"></canvas>
    </div>
</template>

<style scoped>
    #seat {
        position: fixed;
        width: 55%;
        height: 60%;
        top: 30%;
        left: 42%;
    }

    canvas {
      background-color: transparent;
      position: absolute;
      top: -3%;
      left: -2%;
    }

    /* #buttons {
        display: flex;

        position: absolute;
        top: 5%;
        left: 40%;
    }

    #buttons button {
        width: 70%;
        margin-right: 20%;
    } */
</style>
