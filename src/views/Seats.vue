<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { getCircleCenterAndRadius, getCentralAngle,rotatePointAroundCenter } from '@/utils/geometry'

    const seats = ref(null)
    const seatList = ref([])
    const selectedList = ref([])  // 选中：黄色
    const soldList = ref([]) // 卖出：红色
    let ctx = null
    let timer = null
    
    const drawSeats = () => {
        // 该函数绘制初始所有座位
        seatList.value = [] // 每次重绘前清空
        let A = [80,80]
        let B = [890,80]
        let M = [400,50]
        let {cx, cy, r} = getCircleCenterAndRadius(A,B,M)
        let angleAll = getCentralAngle(A,B,[cx,cy])
        let angleStep = angleAll / 19
        let leanStep = 50

        for (let i = 0; i < 20; i++) {
            let angle = angleAll / 2 - angleStep * i
            let [topX, topY] = rotatePointAroundCenter(A[0],A[1],cx,cy,angleStep*i)
            
            for (let j = 0; j < 10; j++) {              
                let x = topX + Math.sin(angle) * leanStep * j
                let y = topY + Math.cos(angle) * leanStep * j
                seatList.value.push({x, y, angle, row: i, col: j}) // 记录
                drawSingleSeat(x, y, -angle,0)
            }
        }
    }

    const drawChangedSeats = () => {
        // 重新绘制被选中的座位为黄色
        for(let seat of selectedList.value){
            drawSingleSeat(seat.x,seat.y,-seat.angle,1)
        }
        // 重新绘制被选中的座位为红色
    }

    const drawSingleSeat = (x, y, angle, status) => {
        // status 如果是1 就是选中 黄色
        // 如果是 2 就是售出 红色

        // 绘制单个座位
        const seat = new Path2D();
        // 以(0,0)为中心绘制座位
        seat.moveTo(-13, -10); // (x+4, y+4) - (centerX, centerY)
        seat.lineTo(-13, -14);
        seat.lineTo(13, -14);
        seat.lineTo(13, -10);
        seat.moveTo(9, -6);
        seat.arc(13, -6, 4, Math.PI, 0, false);
        seat.lineTo(17, 14);
        seat.lineTo(-17, 14);
        seat.lineTo(-17, -6);
        seat.arc(-13, -6, 4, Math.PI, 0, false);
        seat.lineTo(-9, 9);
        seat.lineTo(9, 9);
        seat.lineTo(9, -6);

        ctx.save();
        ctx.translate(x + 17, y + 14); // 先平移到目标中心
        ctx.rotate(angle);              // 再旋转
        if (status == 1) {
            ctx.fillStyle = '#F00' // 选中为黄色
        } else if(status == 2){
            ctx.fillStyle = '#F00' // 售出为红色
        } else {
            ctx.fillStyle = '#0F0'
        }
        ctx.fill(seat)
        ctx.stroke(seat);
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
        let {cx,cy,r} = getCircleCenterAndRadius([140,590],[860,590],[500,560])
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

        ctx.lineWidth = 1.3
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

    const handleCanvasClick = (e) => {
        const rect = seats.value.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        for (let seat of seatList.value) {
            let dx = mouseX - (seat.x + 17)
            let dy = mouseY - (seat.y + 14)
            let angle = -seat.angle
            let localX = dx * Math.cos(angle) - dy * Math.sin(angle)
            let localY = dx * Math.sin(angle) + dy * Math.cos(angle)
            if (
                localX >= -17 && localX <= 17 &&
                localY >= -14 && localY <= 14
            ) {
                console.log("Seat clicked:", seat)
                selectedList.value.push(seat)
                drawChangedSeats()
                break
            }
        }
    }

    onMounted(() => {
        ctx = seats.value.getContext('2d')
        
        drawScreen()
        drawSeats()
        drawBackGround()
        // drawGround()

        // seats.value.addEventListener('click', handleCanvasClick)
        // timer = setInterval(drawChangedSeats,1000)
    })

    onUnmounted(() => {
        clearInterval(timer)
    })
</script>

<template>
    <div>
        <canvas ref="seats" width="950" height="650" @click="handleCanvasClick"></canvas>
    </div>
</template>

<style scoped>
    canvas {
      background-color: transparent;
      position: absolute;
      top: 350px;
      left: 600px;
    }
</style>
