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
    // 表名
    protected $name = 'examination_result_question';

    // 是否自动完成字段
    protected $autoWriteTimestamp = false;

    // 字段类型转换
    protected $type = [
        'imgs' => 'json',
    ];

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
        'imgs'           => 'array',
        'answer_content' => 'editor',
    ];

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