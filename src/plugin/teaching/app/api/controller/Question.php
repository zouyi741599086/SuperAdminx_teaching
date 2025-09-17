<?php
namespace plugin\teaching\app\api\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\QuestionLogic;

/**
 * 题库
 *
 * @author zy <741599086@qq.com>
 * */
class Question
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];

    /**
     * 获取题目详情
     * @param Request $request 
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data                   = QuestionLogic::findData($id)->toArray();
        $data['imgs']           = file_url($data['imgs']);
        $data['answer_content'] = file_url($data['answer_content']);
        return success($data);
    }
}
