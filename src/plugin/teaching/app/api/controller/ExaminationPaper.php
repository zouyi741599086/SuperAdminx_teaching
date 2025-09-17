<?php
namespace plugin\teaching\app\api\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationPaperLogic;

/**
 * 测评试卷
 *
 * @author zy <741599086@qq.com>
 * */
class ExaminationPaper
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
    public function getList(Request $request) : Response
    {
        $list = ExaminationPaperLogic::getList($request->get(), true, true);
        return success($list);
    }

    /**
     * 详情
     * @param Request $request
     * @param int $id
     * @return Response
     * */
    public function findData(Request $request, int $id) : Response
    {
        $data = ExaminationPaperLogic::findData($id)->toArray();
        foreach ($data['ExaminationPaperQuestion'] as &$v) {
            $v['imgs']           = file_url($v['imgs']);
            $v['answer_content'] = file_url($v['answer_content']);
        }
        return success($data);
    }
}
