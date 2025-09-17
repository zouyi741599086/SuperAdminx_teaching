<?php
namespace plugin\teaching\app\common\logic;

use plugin\teaching\app\common\model\GradeModel;
use plugin\teaching\app\common\validate\GradeValidate;
use support\Cache;
use support\think\Db;

/**
 * 年级管理
 *
 * @ author zy <741599086@qq.com>
 * */

class GradeLogic
{

    /**
     * 获取列表
     * */
    public static function getList()
    {
        $list = Cache::get('Grade');
        if (! $list) {
            $list = GradeModel::order('sort desc,id desc')
                ->select()
                ->toArray();
            Cache::set('Grade', $list, 86400);
        }
        return $list;
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        $data = Cache::get("Grade{$id}");
        if (! $data) {
            $data = GradeModel::where('id', $id)->find()->toArray();
            Cache::set("Grade{$id}", $data, 86400);
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
            think_validate(GradeValidate::class)->check($params);
            GradeModel::create($params);
            Cache::delete('Grade');
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
            think_validate(GradeValidate::class)->check($params);
            GradeModel::update($params);
            Cache::delete('Grade');
            Cache::delete("Grade{$params['id']}");
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
        GradeModel::destroy($id);
        Cache::delete("Grade");
        Cache::delete("Grade{$id}");
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
        (new GradeModel())->saveAll($updateData);
        Cache::delete("Grade");
    }
}