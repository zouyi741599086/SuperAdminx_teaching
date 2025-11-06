<?php
namespace plugin\teaching\app\common\model;

use think\Model\Pivot;

/**
 * 测评试卷-题库-中间表
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationPaperQuestionModel extends Pivot
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'examination_paper_question',
            'autoWriteTimestamp' => false,
            'type'               => [],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }
}