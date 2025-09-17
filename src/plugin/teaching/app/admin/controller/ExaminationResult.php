<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationResultLogic;

/**
 * 考试结果 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ExaminationResult
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
     * @auth examinationResultGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request): Response
    {
        $list = ExaminationResultLogic::getList($request->get());
        return success($list);
    }

    /**
     * 获取数据
     * @method get
	 * @param Request $request 
     * @param int $id 
     * @return Response
     */
    public function findData(Request $request, int $id): Response
    {
        $data = ExaminationResultLogic::findData($id);
        return success($data);
    }

    /**
     * @log 删除考试结果
     * @method post
     * @auth examinationResultDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request): Response
    {
        ExaminationResultLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 导出考试结果数据
     * @method get
     * @auth examinationResultExportData
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request): Response
    {
        $data = ExaminationResultLogic::exportData($request->get());
        return success($data);
    }

}