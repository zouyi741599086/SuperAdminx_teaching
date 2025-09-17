<?php
namespace plugin\teaching\app\common\logic;

use plugin\teaching\app\common\model\QuestionClassModel;
use plugin\teaching\app\common\validate\QuestionClassValidate;
use support\Cache;
use support\think\Db;

/**
 * 题库分类
 *
 * @ author zy <741599086@qq.com>
 * */

class QuestionClassLogic
{

    /**
     * 获取列表，是返回所有的分类数据，并且是多维数组
     * */
    public static function getList()
    {
        $list = Cache::get('QuestionClass');
        if (! $list) {
            $list = QuestionClassModel::order('sort desc,id desc')
                ->select()
                ->toArray();
            Cache::set('QuestionClass', $list, 86400);
        }
        return $list;
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        $data = Cache::get("QuestionClass{$id}");
        if (! $data) {
            $data = QuestionClassModel::where('id', $id)->find()->toArray();
            Cache::set("QuestionClass{$id}", $data, 86400);
        }
        return $data;
    }

    /**
     * 添加
     * @param array $params
     */
    public static function create(array $params)
    {
        Db::startTrans();
        try {
            think_validate(QuestionClassValidate::class)->check($params);
            QuestionClassModel::create($params);
            Cache::delete('QuestionClass');
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
            think_validate(QuestionClassValidate::class)->check($params);
            QuestionClassModel::update($params);
            Cache::delete('QuestionClass');
            Cache::delete("QuestionClass{$params['id']}");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 删除
     * @param int $id
     */
    public static function delete(int $id)
    {
        QuestionClassModel::destroy($id);
        Cache::delete("QuestionClass");
        Cache::delete("QuestionClass{$id}");
    }

    /**
     * 修改排序
     * @param array $params
     * */
    public static function updateSort(array $params)
    {
        $updateData = [];
        foreach ($params as $k => $v) {
            $updateData[] = [
                'id'   => $v['id'],
                'sort' => $v['sort']
            ];
        }
        (new QuestionClassModel())->saveAll($updateData);
        Cache::delete("QuestionClass");
    }
}