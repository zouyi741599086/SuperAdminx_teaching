<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;
use plugin\teaching\app\common\model\QuestionClassModel;
use plugin\teaching\app\common\model\QuestionOptionsModel;
use plugin\teaching\app\common\model\GradeModel;

/**
 * 题库
 *
 * @ author zy <741599086@qq.com>
 * */

class QuestionModel extends BaseModel
{

    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'question',
            'autoWriteTimestamp' => true,
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
    public function QuestionOptions()
    {
        return $this->hasMany(QuestionOptionsModel::class);
    }
    // 所属年级
    public function Grade()
    {
        return $this->belongsTo(GradeModel::class);
    }
    // 所属分类
    public function QuestionClass()
    {
        return $this->belongsTo(QuestionClassModel::class);
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
    public function searchGradeIdAttr($query, $value, $data)
    {
        $query->where('grade_id', $value);
    }

    // 查询字段
    public function searchQuestionClassIdAttr($query, $value, $data)
    {
        $query->where('question_class_id', $value);
    }

    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }


}