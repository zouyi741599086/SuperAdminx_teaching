import {http} from '@/common/axios.js'

export const examinationResultQuestionApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/teaching/admin/ExaminationResultQuestion/getList', params);
    },
}