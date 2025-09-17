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
    // 表名
    protected $name = 'examination_result';

    // 字段类型转换
    protected $type = [
    ];

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
    ];

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