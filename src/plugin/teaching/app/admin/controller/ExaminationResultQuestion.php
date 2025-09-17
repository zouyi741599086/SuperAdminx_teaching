<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationResultQuestionLogic;

/**
 * 考试结果 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ExaminationResultQuestion
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * 列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = ExaminationResultQuestionLogic::getList($request->get());
        return success($list);
    }

}