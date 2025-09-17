<?php
namespace plugin\teaching\app\common\validate;

use superadminx\think_validate\Validate;

class QuestionValidate extends Validate
{

    protected $rule = [
        'title'  => 'require',
        'points' => 'require|number',
        'type'   => 'require',
    ];

    protected $message = [
        'title.require'  => '请输入问题',
        'points.require' => '请输入此题分数',
        'points.number'  => '请输入正确的分数',
        'type.require'   => '请选择类型',
    ];
}


