<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;

/**
 * 题库分类
 *
 * @ author zy <741599086@qq.com>
 * */

class QuestionClassModel extends BaseModel
{

    // 表名
    protected $name = 'question_class';

    //包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
    ];

}