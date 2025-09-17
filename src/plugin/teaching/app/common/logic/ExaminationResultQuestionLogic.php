<?php
namespace plugin\teaching\app\common\logic;

use plugin\teaching\app\common\model\ExaminationResultQuestionModel;

/**
 * 试卷测评做的题
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationResultQuestionLogic
{
    /**
     * 列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * */
    public static function getList(array $params = [], bool $page = true)
    {
        // 排序
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = ExaminationResultQuestionModel::withSearch(['title', 'type', 'is_correct', 'examination_result_id'], $params, true)
            ->with(['ExaminationResultQuestionOptions'])
            ->order($orderBy);

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list;
    }

}