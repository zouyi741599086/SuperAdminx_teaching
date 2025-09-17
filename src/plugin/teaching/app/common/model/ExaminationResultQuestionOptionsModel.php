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
    // 表名
    protected $name = 'examination_result_question_options';

    //是否自动完成字段
    protected $autoWriteTimestamp = false;

}