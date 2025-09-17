<?php
namespace plugin\teaching\app\api\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationResultLogic;

/**
 * 测评试卷结果
 *
 * @author zy <741599086@qq.com>
 * */
class ExaminationResult
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];

    /**
     * 测评记录
     * @param Request $request
     * @return Response
     * */
    public function getList(Request $request) : Response
    {
        $list = ExaminationResultLogic::getList($request->get(), true, true);
        return success($list);
    }

    /**
     * 提交试卷测评
     * @param Request $request
     * @return Response
     * */
    public function create(Request $request) : Response
    {
        $data = ExaminationResultLogic::create($request->post(), $request->post('is_create'));
        return success($data);
    }

    /**
     * 详情
     * @param Request $request
     * @param int $id
     * @return Response
     * */
    public function findData(Request $request, int $id) : Response
    {
        $data = ExaminationResultLogic::findData($id);
        return success($data);
    }
}
