<?php
namespace plugin\teaching\app\admin\controller;

use support\Request;
use support\Response;
use plugin\teaching\app\common\logic\QuestionLogic;
use plugin\file\app\utils\FileUtils;

/**
 * 题库
 *
 * @ author zy <741599086@qq.com>
 * */
class Question
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
        $list = QuestionLogic::getList($request->get());
        return success($list);
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
        $data = QuestionLogic::findData($id);
        return success($data);
    }

    /**
     * @log 新增题库
     * @method post
     * @auth questionCreate
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        QuestionLogic::create($request->post());
        return success([], '添加成功');
    }

    /**
     * @log 修改题库
     * @method post
     * @auth questionUpdate
     * @param Request $request 
     * @return Response
     */
    public function update(Request $request) : Response
    {
        QuestionLogic::update($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 删除题库
     * @method post
     * @auth questionDelete
     * @param Request $request 
     * @return Response
     */
    public function delete(Request $request) : Response
    {
        QuestionLogic::delete($request->post('id'));
        return success([], '删除成功');
    }

    /**
     * 下载导入题库数据的表格模板
     * @method get
     * @auth questionImportData
     * @param Request $request 
     * @return Response
     */
    public function downloadImportExcel(Request $request) : Response
    {
        $data = QuestionLogic::downloadImportExcel();
        return success($data);
    }

    /**
     * @log 导入题库数据
     * @method post
     * @auth questionImportData
     * @param Request $request 
     * @return Response
     */
    public function importData(Request $request) : Response
    {
        $result = FileUtils::uploadPublic('/tmp_file');
        if (! isset($result['file']) || ! $result['file']) {
            return error('请上传导入的表格');
        }
        $createCount = QuestionLogic::importData($result['file']);
        return success($createCount);
    }

    /**
     * @log 批量修改题库的分类
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function updateQuestionClass(Request $request) : Response
    {
        QuestionLogic::updateQuestionClass($request->post());
        return success([], '修改成功');
    }

    /**
     * @log 批量修改题库的年级
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function updateGrade(Request $request) : Response
    {
        QuestionLogic::updateGrade($request->post());
        return success([], '修改成功');
    }
}
