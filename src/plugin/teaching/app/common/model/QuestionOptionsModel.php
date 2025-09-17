<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;

/**
 * 题库的选中转
 *
 * @ author zy <741599086@qq.com>
 * */

class QuestionOptionsModel extends BaseModel
{

    // 表名
    protected $name = 'question_options';

    //是否自动完成字段
    protected $autoWriteTimestamp = false;


}