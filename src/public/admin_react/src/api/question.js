import { http } from '@/common/axios.js'
import { config } from '@/common/config';

export const questionApi = {
	// 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/Question/getList',params);
    },
    // 获取列表
    getInList: (params = {}) => {
        return http.post('/app/teaching/admin/Question/getInList',params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/teaching/admin/Question/create',params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/Question/findData',params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/teaching/admin/Question/update',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/Question/delete',params);
    },
	// 下载题库导入模板
    downloadImportExcel: (params = {}) => {
        return http.get('/app/teaching/admin/Question/downloadImportExcel',params);
    },
    // 批量导入题库
    importData: `${config.url}/app/teaching/admin/Question/importData`,
    // 批量修改分类
    updateQuestionClass: (params = {}) => {
        return http.post('/app/teaching/admin/Question/updateQuestionClass', params);
    },
    // 批量修改年级
    updateGrade: (params = {}) => {
        return http.post('/app/teaching/admin/Question/updateGrade', params);
    },
}