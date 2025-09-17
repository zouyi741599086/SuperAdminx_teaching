<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\QuestionClassLogic;

/**
 * 题库分类
 *
 * @ author zy <741599086@qq.com>
 * */
class QuestionClass
{
    //此控制器是否需要登录
    protected $onLogin = true;
    //不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * 获取列表
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getList(Request $request) : Response
    {
        $list = QuestionClassLogic::getList();
        return success($list);
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function findData(Request $request) : Response
    {
        $data = QuestionClassLogic::findData($request->get('id'));
        return success($data);
    }

    /**
     * @log 添加题库分类
     * @method get
     * @auth questionClassCreate
     * @param Request $request 
     * @return Response
     * */
    public function create(Request $request) : Response
    {
        QuestionClassLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改题库分类
     * @method get
     * @auth questionClassUpdate
     * @param Request $request 
     * @return Response
     * */
    public function update(Request $request) : Response
    {
        QuestionClassLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除题库分类
     * @method get
     * @auth questionClassDelete
     * @param Request $request 
     * @return Response
     * */
    public function delete(Request $request) : Response
    {
        QuestionClassLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * @log 修改题库分类排序
     * @method get
     * @param Request $request 
     * @param array $list
     * @return Response
     * */
    public function updateSort(Request $request, array $list) : Response
    {
        QuestionClassLogic::updateSort($list);
        return success([], '操作成功');
    }

}
