<?php
namespace plugin\teaching\app\common\logic;

use plugin\teaching\app\common\model\ExaminationPaperClassModel;
use plugin\teaching\app\common\validate\ExaminationPaperClassValidate;
use support\Cache;
use support\think\Db;

/**
 * 试卷 逻辑层
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ExaminationPaperClassLogic
{

    /**
     * 列表
     * */
    public static function getList()
    {
        $list = Cache::get('ExaminationPaperClass');
        if (is_null($list)) {
            $list = ExaminationPaperClassModel::order('sort desc,id desc')
                ->select()
                ->toArray();
            Cache::set('ExaminationPaperClass', $list, 86400);
        }
        return $list;
    }

    /**
     * 新增
     * @param array $params
     */
    public static function create(array $params)
    {
        Db::startTrans();
        try {
            think_validate(ExaminationPaperClassValidate::class)->check($params);

            ExaminationPaperClassModel::create($params);
            Cache::delete("ExaminationPaperClass");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 获取数据
     * @param int $id 数据id
     */
    public static function findData(int $id)
    {
        $data = Cache::get("ExaminationPaperClass{$id}");
        if (is_null($data)) {
            $data = ExaminationPaperClassModel::find($id);
            Cache::set("ExaminationPaperClass{$id}", $data, 86400);
        }
        return $data;
    }

    /**
     * 更新
     * @param array $params
     */
    public static function update(array $params)
    {
        Db::startTrans();
        try {
            think_validate(ExaminationPaperClassValidate::class)->check($params);

            ExaminationPaperClassModel::update($params);
            Cache::delete("ExaminationPaperClass");
            Cache::delete("ExaminationPaperClass{$params['id']}");
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 删除
     * @param int|array $id 要删除的id
     */
    public static function delete(int|array $id)
    {
        ExaminationPaperClassModel::destroy($id);

        Cache::delete("ExaminationPaperClass");
        if (is_array($id)) {
            foreach ($id as $v) {
                Cache::delete("ExaminationPaperClass{$v}");
            }
        } else {
            Cache::delete("ExaminationPaperClass{$id}");
        }
    }

    /**
     * 更改排序
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
        (new ExaminationPaperClassModel())->saveAll($updateData);
        Cache::delete("ExaminationPaperClass");
    }
}