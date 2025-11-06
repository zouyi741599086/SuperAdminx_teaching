<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;
use plugin\user\app\common\model\UserModel;
use plugin\teaching\app\common\model\ExaminationResultQuestionModel;
use plugin\teaching\app\common\model\ExaminationPaperClassModel;

/**
 * 试卷测评结果
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationResultModel extends BaseModel
{
    /**
     * 模型参数
     * @return array
     */
    protected function getOptions() : array
    {
        return [
            'name'               => 'examination_result',
            'autoWriteTimestamp' => true,
            'type'               => [],
            'fileField'          => [ // 包含附件的字段，''代表直接等于附件路劲，'array'代表数组中包含附件路劲，'editor'代表富文本中包含附件路劲
            ],
        ];
    }

    // 所属用户
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

    // 试卷测评的的题
    public function ExaminationResultQuestion()
    {
        return $this->hasMany(ExaminationResultQuestionModel::class);
    }

    // 所属试卷分类
    public function ExaminationPaperClass()
    {
        return $this->belongsTo(ExaminationPaperClassModel::class);
    }

    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }

    // 查询字段
    public function searchUserIdAttr($query, $value, $data)
    {
        $query->where('user_id', $value);
    }

    // 查询字段
    public function searchExaminationPaperClassIdAttr($query, $value, $data)
    {
        $query->where('examination_paper_class_id', $value);
    }

    // 查询字段
    public function searchCreateTimeAttr($query, $value, $data)
    {
        $query->where('create_time', 'between', ["{$value[0]} 00:00:00", "{$value[1]} 23:59:59"]);
    }

}