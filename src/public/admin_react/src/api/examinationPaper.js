import { http } from '@/common/axios.js'

export const examinationPaperApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationPaper/getList',params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaper/create',params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationPaper/findData',params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaper/update',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaper/delete',params);
    },
	// 修改排序
	updateSort: (params = {}) => {
	    return http.post('/app/teaching/admin/ExaminationPaper/updateSort',params);
	},
    // 上下架
    updateStatus: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaper/updateStatus', params);
    },
	
}