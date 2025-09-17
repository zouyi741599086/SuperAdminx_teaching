<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\ExaminationPaperClassLogic;

/**
 * 试卷分类 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ExaminationPaperClass
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
        $list = ExaminationPaperClassLogic::getList();
        return success($list);
    }

    /**
     * @log 新增试卷分类
     * @method post
     * @auth examinationPaperClassCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        ExaminationPaperClassLogic::create($request->post());
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
        $data = ExaminationPaperClassLogic::findData($id);
        return success($data);
    }

    /**
     * @log 修改试卷分类
     * @method post
     * @auth examinationPaperClassUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        ExaminationPaperClassLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除试卷分类
     * @method post
     * @auth examinationPaperClassDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        ExaminationPaperClassLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 更改试卷分类排序
     * @method post
     * @auth examinationPaperClassUpdateSort
     * @param array $list 
     * @return Response
     * */
    public function updateSort(array $list) : Response
    {
        ExaminationPaperClassLogic::updateSort($list);
        return success();
    }
}