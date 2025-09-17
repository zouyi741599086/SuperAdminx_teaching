import {http} from '@/common/axios.js'

export const examinationPaperClassApi = {
	// 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationPaperClass/getList',params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaperClass/create',params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationPaperClass/findData',params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaperClass/update',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationPaperClass/delete',params);
    },
	// 修改排序
	updateSort: (params = {}) => {
	    return http.post('/app/teaching/admin/ExaminationPaperClass/updateSort',params);
	},
}