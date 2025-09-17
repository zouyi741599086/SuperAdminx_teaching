<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;
use plugin\user\app\common\model\UserModel;
use plugin\teaching\app\common\model\GradeModel;
use plugin\teaching\app\common\model\ExaminationPaperClassModel;
use plugin\teaching\app\common\model\QuestionModel;
use plugin\teaching\app\common\model\ExaminationPaperQuestionModel;

/**
 * 测评试卷
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationPaperModel extends BaseModel
{
    // 表名
    protected $name = 'examination_paper';

    // 字段类型转换
    protected $type = [
    ];

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
    ];

    // 所属年级
    public function Grade()
    {
        return $this->belongsTo(GradeModel::class);
    }

    // 所属年级
    public function User()
    {
        return $this->belongsTo(UserModel::class);
    }

    // 所属试卷分类
    public function ExaminationPaperClass()
    {
        return $this->belongsTo(ExaminationPaperClassModel::class);
    }
    // 试卷包含的题库
    public function ExaminationPaperQuestion()
    {
        return $this->belongsToMany(QuestionModel::class, ExaminationPaperQuestionModel::class, 'question_id', 'examination_paper_id');
    }

    // 查询字段
    public function searchTitleAttr($query, $value, $data)
    {
        $query->where('title', 'like', "%{$value}%");
    }

    // 查询字段
    public function searchGradeIdAttr($query, $value, $data)
    {
        $query->where('grade_id', $value);
    }

    // 查询字段
    public function searchStatusAttr($query, $value, $data)
    {
        $query->where('status', $value);
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