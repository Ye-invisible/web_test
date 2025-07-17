export const hallType = {
    0: 'IMAX1号厅',
    1: 'IMAX2号厅',
    2: 'DOLBY3号厅',
    3: 'DOLBY4号厅',
    4: 'STD5号厅',
    5: 'STDD6号厅'
};
// 定义 Movie 类
export class Movie {
    constructor(id, name, poster, genre, rating, releaseDate, releaseDateText, showInfo, version, actors = []) {
        this.id = id; 
        this.name = name;
        this.poster = poster;
        this.genre = genre;
        this.rating = rating;
        this.releaseDate = releaseDate;
        this.releaseDateText = releaseDateText;
        this.showInfo = showInfo;
        this.version = version;
        this.actors = actors;
        this.showtimes = []; // 放映场次
        // this.tickets = [];   // 已售座位
        this.category = '正在热映'; // 默认分类
    }

    randomCreateshowtimes() {  
        const startTime = new Date();
        for (let i = 0; i < 3; i++) {
            const time = new Date(startTime.getTime() + i * 2 * 60 * 60 * 1000); // 每隔2小时
            var t = Math.floor(Math.random() * 6)
            const hall = hallType[t]; // 循环使用不同的厅
            const showSize = t % 3; // 随机放映规模
            this.addShowtime(time, hall, showSize);
        }
    }

    randomCreatecategory(){
        var t=Math.floor(Math.random() * 3);
        switch(t){
            case 0:
                this.category = '正在热映';
                break;
            case 1:
                this.category = '即将上映';
                break;
            case 2:
                this.category = '经典电影';
                break;
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
        console.log("change movie tickets");
        console.log(this.showtimes[showtimeIndex])
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
        const parsedMovies = movieList.map(movie => {
            const newMovie = new Movie(
                this.counter++,
                movie.nm,
                movie.img,
                movie.genre || '其他',
                movie.sc > 0 ? movie.sc : '暂无评分',
                movie.rt,
                movie.comingTitle,
                movie.showInfo,
                movie.version || '普通版',
                movie.star ? movie.star.split(' / ') : []
            );
            newMovie.randomCreateshowtimes();
            newMovie.randomCreatecategory();
            return newMovie
        });
        
        this.movies.push(...parsedMovies);
        return parsedMovies;
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
