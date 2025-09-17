import { http } from '@/common/axios.js'

export const questionClassApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/QuestionClass/getList',params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/teaching/admin/QuestionClass/create',params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/QuestionClass/findData',params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/teaching/admin/QuestionClass/update',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/QuestionClass/delete',params);
    },
	// 修改排序
	updateSort: (params = {}) => {
	    return http.post('/app/teaching/admin/QuestionClass/updateSort',params);
	},
}