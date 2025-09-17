<?php
namespace plugin\teaching\app\common\logic;

use support\think\Db;
use plugin\teaching\app\common\model\ExaminationPaperModel;
use plugin\teaching\app\common\model\ExaminationPaperQuestionModel;

/**
 * 测评试卷
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationPaperLogic
{
    /**
     * 获取列表
     * @param array $params get参数
     * @param bool $page 是否需要翻页，不翻页返回模型
     * @param bool $filter 是否是前端在调用，需要过滤掉不应该显示的，如下架的
     * */
    public static function getList(array $params = [], bool $page = true, bool $filter = false)
    {
        // 排序
        $orderBy = "sort desc,id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = ExaminationPaperModel::withSearch(['title', 'status', 'grade_id', 'examination_paper_class_id', 'create_time'], $params, true)
            ->when($filter, function ($query)
            {
                $query->where('status', 1);
            })
            ->with(['Grade', 'ExaminationPaperClass'])
            ->withCount(['ExaminationPaperQuestion'])
            ->withSum('ExaminationPaperQuestion', 'points')
            ->order($orderBy);

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list->select();
    }

    /**
     * 获取一条数据
     * @param int $id 数据id
     * @param array $with 关联数据滤
     */
    public static function findData(int $id, ?array $with = ['Grade', 'ExaminationPaperQuestion'])
    {
        return ExaminationPaperModel::where('id', $id)
            ->with($with)
            ->find();
    }

    /**
     * 添加
     * @param array $params
     */
    public static function create(array $params)
    {
        Db::startTrans();
        try {
            think_validate($params);

            $result = ExaminationPaperModel::create($params);
            self::examinationPaperQuestionUpdate($result->id, $params['ExaminationPaperQuestion']);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改
     * @param array $params
     */
    public static function update(array $params)
    {
        Db::startTrans();
        try {
            think_validate($params);

            ExaminationPaperModel::update($params);
            self::examinationPaperQuestionUpdate($params['id'], $params['ExaminationPaperQuestion']);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 添加修改共用，更新试卷的题库
     * @param int $examination_paper_id 试卷的id
     * @param array $arr 题库的id
     */
    public static function examinationPaperQuestionUpdate(int $examination_paper_id, array $arr)
    {
        //先删除
        ExaminationPaperQuestionModel::where('examination_paper_id', $examination_paper_id)->delete();
        //在插入
        $tmp_arr = [];
        foreach ($arr as $v) {
            $tmp_arr[] = [
                'examination_paper_id' => $examination_paper_id,
                'question_id'          => $v
            ];
        }
        (new ExaminationPaperQuestionModel())->saveAll($tmp_arr);
    }

    /**
     * 删除
     * @param int $id 
     */
    public static function delete(int|array $id)
    {
        ExaminationPaperModel::destroy($id);
    }

    /**
     * 上下架修改
     * @param int $id
     * @param int $status
     */
    public static function updateStatus(int $id, int $status)
    {
        Db::startTrans();
        try {
            ExaminationPaperModel::update(['status' => $status], ['id' => $id]);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改排序
     * @param array $params
     */
    public static function updateSort(array $params)
    {
        $updateData = [];
        foreach ($params as $k => $v) {
            $updateData[] = [
                'id'   => $v['id'],
                'sort' => $v['sort']
            ];
        }
        (new ExaminationPaperModel())->saveAll($updateData);
    }
}