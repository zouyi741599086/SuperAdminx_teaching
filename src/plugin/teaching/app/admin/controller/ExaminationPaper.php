<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationPaperLogic;

/**
 * 试卷 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ExaminationPaper
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
    public function getList(Request $request) : Response
    {
        $list = ExaminationPaperLogic::getList($request->get());
        return success($list);
    }

    /**
     * @log 新增试卷
     * @method post
     * @auth examinationPaperCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        ExaminationPaperLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * 获取数据
     * @method get
     * @param Request $request 
     * @param int $id 
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = ExaminationPaperLogic::findData($id);
        return success($data);
    }

    /**
     * @log 修改试卷
     * @method post
     * @auth examinationPaperUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        ExaminationPaperLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除试卷
     * @method post
     * @auth examinationPaperDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        ExaminationPaperLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 更改试卷排序
     * @method post
     * @auth examinationPaperUpdateSort
     * @param Request $request 
     * @param array $list 
     * @return Response
     * */
    public function updateSort(Request $request, array $list) : Response
    {
        ExaminationPaperLogic::updateSort($list);
        return success();
    }

    /**
     * @log 修改试卷状态
     * @method post
     * @auth examinationPaperUpdateStatus
     * @param Request $request 
     * @param int $id 数据id
     * @param int $status 数据状态 
     * @return Response
     */
    public function updateStatus(Request $request, int $id, int $status) : Response
    {
        ExaminationPaperLogic::updateStatus($id, $status);
        return success();
    }
}