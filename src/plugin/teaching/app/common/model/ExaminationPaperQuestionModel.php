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
    // 表名
    protected $name = 'examination_paper_question';

    //是否自动完成字段
    protected $autoWriteTimestamp = false;
}