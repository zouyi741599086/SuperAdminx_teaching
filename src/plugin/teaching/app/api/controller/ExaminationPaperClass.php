<?php
namespace plugin\teaching\app\api\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationPaperClassLogic;
/**
 * 试卷分类
 *
 * @author zy <741599086@qq.com>
 * */
class ExaminationPaperClass
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];

    /**
     * 获取列表
     * @param Request $request
     * @return Response
     * */
    public function getList(Request $request): Response
    {
        $list = ExaminationPaperClassLogic::getList();
        return success($list);
    }
}
