<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;
use plugin\teaching\app\common\model\ExaminationResultQuestionOptionsModel;

/**
 * 试卷测评做的题
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationResultQuestionModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'examination_result_question',
            'autoWriteTimestamp' => false,
            'type'               => [
                'imgs' => 'json',
            ],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
                'imgs'           => 'array',
                'answer_content' => 'editor',
            ],
        ];
    }

    // 题的选择项
    public function ExaminationResultQuestionOptions()
    {
        return $this->hasMany(ExaminationResultQuestionOptionsModel::class);
    }

    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }

    // 查询字段
    public function searchTypeAttr($query, $value, $data)
    {
        $query->where('type', $value);
    }

    // 查询字段
    public function searchIsCorrectAttr($query, $value, $data)
    {
        $query->where('is_correct', $value);
    }

    // 查询字段
    public function searchExaminationResultIdAttr($query, $value, $data)
    {
        $query->where('examination_result_id', $value);
    }

}