import { defineStore } from 'pinia';
import { hallType, Movie, MovieCollection } from '@/utils/film';
import { fetchMovies } from '@/utils/Get_film';
// 定义 Pinia store
export const useMovieStore = defineStore('movie', {
    state: () => ({
        movieCollection: new MovieCollection(),
        isLoading: false,
        error: null
    }),
    actions: {
        async fetchMovies() {
            try {
                // 1. 发送请求获取完整数据
                const response = await fetch('https://apis.netstart.cn/maoyan/index/movieOnInfoList');
                if (!response.ok) {
                    throw new Error(`请求失败，状态码：${response.status}`);
                }
                
                // 2. 解析 JSON 数据（与你提供的格式对应）
                const fullData = await response.json();
                
                // 3. 提取核心的电影列表（movieList 数组）
                const movieList = fullData.movieList || [];
            
                // 5. 处理每部电影，提取需要的字段
                const parsedMovies = movieList.map(movie => {
                    // 匹配该电影对应的导演/演员信息（从 chiefBonus 中）
                    
                    return {
                        id: movie.id, // 电影ID
                        name: movie.nm, // 电影名称
                        poster: movie.img, // 海报图片URL
                        genre: movie.genre || '未知类型', // 类型（如果接口返回中有的话，这里假设字段名）
                        rating: movie.sc > 0 ? movie.sc : '暂无评分', // 评分（0分显示“暂无评分”）
                        releaseDate: movie.rt, // 上映日期
                        releaseDateText: movie.comingTitle, // 上映日期文字描述（如“7月5日 周六”）
                        actors: movie.star ? movie.star.split(' / ') : [], // 主演（假设接口返回中有 star 字段）
                        showInfo: movie.showInfo, // 放映信息（如“今天254家影院放映1245场”）
                        version: movie.version || '普通版', // 版本（如“v3d imax”）
                        
                    };
                });
                
                this.movieCollection.addMoviesFromApiData(movieList);    
                console.log('电影数据已成功获取并解析:', parsedMovies);
                
            } catch (error) {
                console.error('获取或解析电影数据失败：', error.message);
                throw error; // 抛出错误供调用方处理
            }
        }
    },
    getters: {
        allMovies: (state) => state.movieCollection.getAllMovies()
    }
});