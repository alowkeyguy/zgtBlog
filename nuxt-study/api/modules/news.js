import axios from 'axios'

export const getNewsList = (pageIndex = 1) => axios.get('http://rapapi.org/mockjsdata/35790/home/newsList', {params: {pageIndex}})

export const getNewsDetailById = (id) => axios.get('/api/home/newsDetail', {params: {id}})