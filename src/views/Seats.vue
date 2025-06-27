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

    let rowNums = 6
    let colNums = 17
    let midSeatWidth = 34
    let bigSeatWidth = 26
    let smallSeatWidth = 34
    let seatWidth = 34 // 200个座位时的最合适座位大小
    let A = [150,220]
    let B = [950,240]
    let M = [400,195]

    watch(() => userStore.showSize, () => {
        // 监视用户选择的放映厅大小的变化
        clearCanvas()
        let size = userStore.showSize
        if(size == 0){
            seatWidth = smallSeatWidth
            rowNums = 6 
            colNums = 17
            A = [150,220]
            B = [950,240]
            M = [400,195]
            drawSmallBackGround()
        } else if(size == 1) {
            seatWidth = midSeatWidth
            rowNums = 10 
            colNums = 20
            A = [80,80]  
            B = [890,80]
            M = [400,50]
            drawBackGround()
        } else if(size == 2){
            seatWidth = bigSeatWidth
            rowNums = 12 
            colNums = 26
            A = [80,80]  
            B = [890,80]
            M = [400,50]
            drawBackGround()
        }

        drawSeats()
        drawScreen()
        selectedList.value = []
    })

    watch(() => userStore.allTickets.length, () => {
        console.log("allTickets Changed!")
        // 监视用户选择的放映厅大小的变化
        drawChangedSeats()
    }, { deep: true })
    
    const clearCanvas = () => {
        // 清理整个画布
        if (ctx) {
            ctx.clearRect(0, 0, seats.value.width, seats.value.height)
        }
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
            let angle = angleAll / 2 - angleStep * i
            let [topX, topY] = rotatePointAroundCenter(A[0],A[1],cx,cy,angleStep*i)
            
            for (let j = 0; j < rowNums; j++) {              
                let x = topX + Math.sin(angle) * leanStep * j
                let y = topY + Math.cos(angle) * leanStep * j
                // const seatNumber = `${j + 1}-${i + 1}` // 座位号格式：行-列
                const seatNumber = `${rowNums - j}-${i+1}` // 座位号格式：行-列
                seatList.value.push({x, y, angle, row: rowNums - j, col: i + 1}) // 记录
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
            const seatNumber = `${p.seat.row}-${p.seat.col}`
            drawSingleSeat(p.seat.x, p.seat.y, -p.seat.angle, 2, seatNumber)
        }
    }

    const drawSingleSeat = (x, y, angle, status, seatNumber = '') => {
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
        // 绘制屏幕
        ctx.moveTo(280,580)
        ctx.lineTo(280,600)
        ctx.lineTo(720,580)
        ctx.lineTo(720,600)
        ctx.fillStyle = '#BBB'
        ctx.fill()
    }

    const drawBackGround = () => {
        
        // 绘制背景框
        // 小型放映厅
        let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560]) 
        // 中大型放映厅
        // let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560]) 
        let startAngle = Math.atan2(590 - cy, 140 - cx)
        let endAngle = Math.atan2(590 - cy, 860 - cx)
        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, endAngle, false) // false: 顺时针, true: 逆时针
        ctx.stroke()

        let {cx: cx1, cy: cy1, r: r1} = getCircleCenterAndRadius([60,60],[940,60],[500,30])
        console.log(cx1,cy1,r1)
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
        // 小型放映厅
        let {cx,cy,r} = getCircleCenterAndRadius([220,530],[820,540],[500,500]) 
        // 中大型放映厅
        // let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560]) 
        let startAngle = Math.atan2(540 - cy, 178 - cx)
        let endAngle = Math.atan2(540 - cy, 830 - cx)
        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, endAngle, false) // false: 顺时针, true: 逆时针
        ctx.stroke()

        let {cx: cx1, cy: cy1, r: r1} = getCircleCenterAndRadius([200,180],[800,180],[500,150])
        console.log(cx1,cy1,r1)
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
        // console.log('Ctrl键是否按下:', isCtrlPressed)
        // console.log(selectedList.value.length)
        // if(selectedList.value.length > 0 && !isCtrlPressed) {
        //     alert("要同时选取多个座位,按下ctrl键")
        //     return
        // }
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
                        if(checkGroupChoose(seat))selectedList.value.push(seat)
                    } else {
                        if(checkSingleChoose(seat))selectedList.value.push(seat)
                    }
                    // selectedList.value.push(seat)
                }
                // 重绘
                clearCanvas()
                drawSeats()
                drawChangedSeats()
                if(userStore.showSize == 0){
                    drawSmallBackGround()
                } else {
                    drawBackGround()
                }
                drawScreen()
                break
            }
        }
    }

    const checkSingleChoose = (seat) => {
        // 检查单人手动选座
        // 要求：小孩不在前三排，老人不在后三排
        const age = userStore.singleMember.age
        if (age < 15 && seat.row < 3){
            alert("小于15岁不能选择前三排!")
            return false
        } else if (age > 60 && seat.row > rowNums - 4){
            alert("大于60岁不能选择后三排!")
            return false
        }
        userStore.singleMember.seat = seat
        return true
    }

    const checkGroupChoose = (row,col) => {
        // 检查团体选座
        // 要求：首先所有成员必须在同一排，且挨着 其次遵守小孩不在前三排，老人不在后三排的规则
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
        let haveYoung = false
        let haveOld = false

        for (const p of userStore.groupMember) {
            if (p.age < 15) {
                haveYoung = true
                break
            } else if(p.age > 60){
                haveOld = true
                break
            }
        }

        return [haveYoung,haveOld]
    }

    onMounted(() => {
        ctx = seats.value.getContext('2d')
        
        drawScreen()
        drawSeats()
        drawSmallBackGround()
        calGroupAge()
        // drawGround()

        // seats.value.addEventListener('click', handleCanvasClick)
        // timer = setInterval(drawChangedSeats,1000)
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
