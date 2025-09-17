import {http} from '@/common/axios.js'

export const examinationResultApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationResult/getList', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationResult/findData', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/teaching/admin/ExaminationResult/delete', params);
    },
    // 导出
    exportData: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationResult/exportData', params);
    },
}