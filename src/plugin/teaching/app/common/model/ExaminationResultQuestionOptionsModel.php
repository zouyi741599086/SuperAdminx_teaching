<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;

/**
 * 试卷测评做的题的选择项
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationResultQuestionOptionsModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'examination_result_question_options',
            'autoWriteTimestamp' => false,
            'type'               => [],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }
}