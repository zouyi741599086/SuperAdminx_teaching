import { http } from '@/common/axios.js'

export const gradeApi = {
	// 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/Grade/getList',params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/teaching/admin/Grade/create',params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/Grade/findData',params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/teaching/admin/Grade/update',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/Grade/delete',params);
    },
	// 修改排序
	updateSort: (params = {}) => {
	    return http.post('/app/teaching/admin/Grade/updateSort',params);
	},
}