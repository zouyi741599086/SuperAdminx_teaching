<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;

/**
 * 年级管理
 *
 * @ author zy <741599086@qq.com>
 * */

class GradeModel extends BaseModel
{
    // 表名
    protected $name = 'grade';

    //包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
    ];

}