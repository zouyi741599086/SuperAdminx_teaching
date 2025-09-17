<?php
namespace plugin\teaching\app\common\model;

use app\common\model\BaseModel;

/**
 * 测评试卷分类
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationPaperClassModel extends BaseModel
{
    // 表名
    protected $name = 'examination_paper_class';

    // 字段类型转换
    protected $type = [
    ];

    // 包含附件的字段，key是字段名称，value是如何取值里面的图片的路劲
    public $file = [
    ];
}