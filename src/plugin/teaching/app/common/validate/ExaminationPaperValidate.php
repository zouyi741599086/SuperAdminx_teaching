<?php
namespace plugin\teaching\app\common\validate;

use superadminx\think_validate\Validate;

class ExaminationPaperValidate extends Validate
{

    protected $rule = [
        'title' => 'require',
    ];

    protected $message = [
        'title.require' => '请输入标题',
    ];
}


