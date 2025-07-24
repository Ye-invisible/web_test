export const hallType = {
    0: 'IMAX1号厅',
    1: 'IMAX2号厅',
    2: 'DOLBY3号厅',
    3: 'DOLBY4号厅',
    4: 'STD5号厅',
    5: 'STDD6号厅'
};
const genres = ['正在热映', '即将上映', '经典电影', '其他'];
// 定义 Movie 类
export class Movie {
    constructor(id, name, poster, genre, rating, releaseDate, version) {
        this.id = id;
        this.name = name;
        this.poster = poster;
        this.genre = genre;
        this.rating = rating;
        this.releaseDate = releaseDate;
        // this.releaseDateText = releaseDateText;
        // this.showInfo = showInfo;
        this.version = version;
        // this.actors = actors;
        this.showtimes = []; // 放映场次
        // this.tickets = [];   // 已售座位
        this.category = '正在热映'; // 默认分类
    }
    // 在组件的 methods 中定义转换函数
    // 修复日期转换函数（添加完整验证）
    convertToDate(dateStr) {
        // 1. 提取月和日（正则匹配“数字月数字日”）
        const match = dateStr.match(/(\d+)月(\d+)日/);
        if (!match) {
            if (dateStr.match(/待定/)) { this.category = '即将上映'; }
            return null; // 解析失败返回 null
        }
        const month = parseInt(match[1], 10); // 提取“月”（如 8）
        const day = parseInt(match[2], 10);   // 提取“日”（如 8）
        if(month>=9 ){
            this.category = '经典电影'; // 如果月份小于5，设置为即将上映
        }
        // 2. 补充年份（默认使用当前年份）
        const year = new Date().getFullYear(); // 如 2024

        // 3. 生成 Date 对象（注意：月份在 Date 中是 0 开始，需减 1）
        const date = new Date(year, month - 1, day);
        date.setHours(9, 0, 0, 0);
       

        return date; // 返回 valid 的 Date 对象
    }
    randomCreateshowtimes() {
        const releaseDate = this.convertToDate(this.releaseDate);
        if(!releaseDate) {return }
        console.log("releaseDate:", releaseDate);
        
        const startTime = new Date();
        if(releaseDate < startTime) {
            releaseDate=startTime
            const minutes = now.getMinutes();
            const roundedMinutes = Math.ceil(minutes / 30) * 30;
            releaseDate.setTime(now.getTime() + (roundedMinutes - minutes) * 60 * 1000);
        }
        for (let i = 0; i < 3; i++) {
            const time = new Date(releaseDate.getTime() + i * 2 * 60 * 60 * 1000); // 每隔2小时
            var t = Math.floor(Math.random() * 6)
            const hall = hallType[t]; // 循环使用不同的厅
            const showSize = t % 3; // 随机放映规模
            this.addShowtime(time, hall, showSize);
        }
    }

    // 修复场次生成函数（正确处理日期计算）
    // randomCreateShowtimes() {
    //     // 1. 先将上映日期转换为 Date 对象
    //     const releaseDate = this.convertToDate(this.releaseDate);
    //     if (!releaseDate) {
    //         console.error("无法生成场次：上映日期无效");
    //         return;
    //     }
    //     console.log("releaseDate:", releaseDate);
    //     // // 2. 设置场次的起始时间（例如：上映日的 9:00 开始）
    //     const baseTime = new Date(releaseDate);
    //     baseTime.setHours(9, 0, 0, 0); // 设定当天最早场次时间
    //     const now = new Date();
    //     if (baseTime < now) {
    //         this.category = '正在热映'; 
    //         const minutes = now.getMinutes();
    //         const roundedMinutes = Math.ceil(minutes / 30) * 30; // 向上取整到最近的30分钟
    //         baseTime.setTime(now.getTime() + (roundedMinutes - minutes) * 60 * 1000);
    //     }

    //     // 3. 生成3个场次，每隔2小时一场
    //     for (let i = 0; i < 3; i++) {
    //         // 正确的日期计算：使用 getTime() 获取时间戳后相加
    //         const time = new Date(baseTime.getTime() + i * 2 * 60 * 60 * 1000);

    //         // 调试输出：格式化显示时间（便于查看）
    //         console.log(`场次 ${i + 1} 时间: ${time.toLocaleString()}`);

    //         // 随机选择影厅（假设 hallType 是已定义的影厅类型数组）
    //         const t = Math.floor(Math.random() * hallType.length);
    //         const hall = hallType[t];
    //         const showSize = t % 3;

    //         // 添加场次
    //         this.addShowtime(time, hall, showSize);
    //     }
    // }


    randomCreatecategory() {
        var t = Math.floor(Math.random() * 4);
        switch (t) {
            case 0:
                this.category = '正在热映';
                break;
            case 1:
                this.category = '即将上映';
                break;
            case 2:
                this.category = '经典电影';
                break;
            case 3:
                this.category = '其他';
                break
        }
    }
    // 添加放映场次
    addShowtime(time, hall, showSize) {
        const formattedTime = `${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

        const showtime = {
            id: this.showtimes.length + 1,
            formattedTime,
            hall,
            showSize,
            tickets: [] // 该场次的座位情况
        };
        this.showtimes.push(showtime);
        return showtime;
    }

    changeState(showtimeId, state) {
        const showtimeIndex = this.showtimes.findIndex(s => s.id === showtimeId);
        const showtime = this.showtimes[showtimeIndex]
        if (showtime) {
            showtime.tickets = state; // 更新作为状态、传入完整数组
        }
        this.showtimes[showtimeIndex] = showtime;
        // console.log("change movie tickets");
        // console.log(this.showtimes[showtimeIndex])
    }

    // changebyseat(showtimeId, row, col, angle) {
    //     const showtime = this.showtimes.find(s => s.id === showtimeId); 
    // }

    // 获取指定场次的已售座位
    getSoldSeats(showtimeId) {
        const showtime = this.showtimes.find(s => s.id === showtimeId);
        return showtime ? showtime.tickets : [];
    }
}

// 定义 MovieCollection 类
export class MovieCollection {
    constructor() {
        this.movies = [];
        this.counter = 0;
    }

    // 从API数据批量添加电影
    addMoviesFromApiData(movieList) {
        let newMovieList = this.filterRepitiveMovie(movieList)
        const parsedMovies = newMovieList.map(movie => {
            const newMovie = new Movie(
                this.counter++,
                movie.nm,
                movie.img,
                genres[Math.floor(Math.random() * 4)],
                movie.score ?? '暂无评分',
                movie.comingTitle,
                // // movie.comingTitle,
                // movie.showInfo,
                movie.version || '普通版',
                // movie.star ? movie.star.split(' / ') : []
            );
            // newMovie.randomCreatecategory();

            newMovie.randomCreateshowtimes();
            return newMovie
        });

        this.movies.push(...parsedMovies);
        return parsedMovies;
    }

    filterRepitiveMovie(movieList) {
        // 防止添加重复的电影
        let newMovieList = []
        for (let movie of movieList) {
            if (this.movies.every(mo => mo.name !== movie.name)) {
                newMovieList.push(movie)
            }
        }
        return newMovieList
    }

    // 根据ID查找电影
    findMovieById(id) {
        return this.movies.find(movie => movie.id === id);
    }

    // 获取所有电影
    getAllMovies() {
        return this.movies;
    }
}
