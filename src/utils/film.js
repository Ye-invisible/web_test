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
        this.tickets = [];   // 已售座位
    }

    // 添加放映场次
    addShowtime(time, hall, showSize) {
        const showtime = {
            id: this.showtimes.length + 1,
            time,
            hall,
            showSize,
            tickets: [] // 该场次的座位情况
        };
        this.showtimes.push(showtime);
        return showtime;
    }

    changeState(showtimeId, state) {
        const showtime = this.showtimes.find(s => s.id === showtimeId);
        if (showtime) {
            showtime.tickets = state; // 更新作为状态、传入完整数组
        }
    }

    changebyseat(showtimeId, row, col, angle) {
        const showtime = this.showtimes.find(s => s.id === showtimeId); 
    }

    // 获取指定场次的已售座位
    getSoldSeats(showtimeId) {
        const showtime = this.showtimes.find(s => s.id === showtimeId);
        return showtime ? showtime.tickets : [];
    }
}

export class MovieCollection {
    constructor() {
        this.movies = [];
    }

    // 从API数据批量添加电影
    addMoviesFromApiData(movieList) {
        const parsedMovies = movieList.map(movie => {
            return new Movie(
                movie.id,
                movie.nm,
                movie.img,
                movie.genre || '未知类型',
                movie.sc > 0 ? movie.sc : '暂无评分',
                movie.rt,
                movie.comingTitle,
                movie.showInfo,
                movie.version || '普通版',
                movie.star ? movie.star.split(' / ') : []
            );
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