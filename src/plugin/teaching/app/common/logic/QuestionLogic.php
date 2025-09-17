<?php
namespace plugin\teaching\app\common\logic;

use plugin\teaching\app\common\model\QuestionModel;
use plugin\teaching\app\common\model\QuestionOptionsModel;
use plugin\teaching\app\common\model\QuestionClassModel;
use plugin\teaching\app\common\model\GradeModel;
use plugin\teaching\app\common\validate\QuestionValidate;
use support\think\Db;

/**
 * 题库
 *
 * @ author zy <741599086@qq.com>
 * */

class QuestionLogic
{
    /**
     * 获取列表
     * @param array $params get参数
     * */
    public static function getList(array $params = [])
    {
        // 排序
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        return QuestionModel::withSearch(['title', 'type', 'grade_id', 'question_class_id', 'create_time'], $params, true)
            ->with(['QuestionClass', 'Grade', 'QuestionOptions'])
            ->order($orderBy)
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public static function findData(int $id)
    {
        return QuestionModel::where('id', $id)
            ->with(['Grade', 'QuestionOptions'])
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
            think_validate(QuestionValidate::class)->check($params);
            $result = QuestionModel::create($params);
            self::questionOptionsUpdate($result->id, $params['QuestionOptions']);
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
            think_validate(QuestionValidate::class)->check($params);
            QuestionModel::update($params);
            self::questionOptionsUpdate($params['id'], $params['QuestionOptions']);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 添加修改共用，更新问题的选择项
     * @param int $question_id 问题的id
     * @param array $options 选择项数据
     */
    public static function questionOptionsUpdate(int $question_id, array $options)
    {
        //先删除
        QuestionOptionsModel::where('question_id', $question_id)->delete();
        //在插入
        $arr = [];
        foreach ($options as $v) {
            $arr[] = [
                'question_id' => $question_id,
                'title'       => $v['title'],
                'is_answer'   => $v['is_answer']
            ];
        }
        $arr = array_reverse($arr);
        (new QuestionOptionsModel())->saveAll($arr);
    }

    /**
     * 删除
     * @param int|array $id
     */
    public static function delete(int|array $id)
    {
        QuestionModel::destroy($id);
    }

    /**
     * 下载题库导入模板
     */
    public static function downloadImportExcel()
    {
        try {
            // 表格头
            $tableData = [
                ['类型', '题目', '分数', '题库分类', '所属年级', '问题解析文字', '正确选项填字母如A或AB', '选择项A', '选择项B', '选择项C', '选择项D', '选择项E', '选择项F', '选择项G', '选择项H', '选择项I', '选择项J', '选择项K']
            ];

            // 生成数据
            for ($i = 3; $i <= 1000; $i++) {
                $tableData[] = [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                ];
            }

            // 开始生成表格导出
            $config = [
                'path' => public_path() . '/tmp_file',
            ];

            $excel      = new \Vtiful\Kernel\Excel($config);
            $fileObject = $excel->fileName(rand(1, 10000) . time() . '.xlsx')
                ->header([])
                ->data($tableData);
            $fileHandle = $fileObject->getHandle();

            // 第一行合并单元格
            $fileObject->mergeCells("A1:L1", "1：请按照表格录入题目\n2：类型、题目、正确答案、正确选项这几列为必填项，否则导入失败\n3：正确选项直接写字母即可，如A 或 ACD，不区分大小写\n4：选择项有几个就写几个，后面可留空");
            // 第一行样式
            $format1 = new \Vtiful\Kernel\Format($fileHandle);
            $fileObject->setRow("A1", 60, $format1
                ->wrap()
                ->bold()
                ->fontColor(\Vtiful\Kernel\Format::COLOR_RED)
                ->align(\Vtiful\Kernel\Format::FORMAT_ALIGN_VERTICAL_CENTER)
                ->toResource()
            );
            // 标题第二行样式
            $format2 = new \Vtiful\Kernel\Format($fileHandle);
            $fileObject->setRow("A2", 22, $format2
                ->bold()
                ->fontColor(\Vtiful\Kernel\Format::COLOR_RED)
                ->align(\Vtiful\Kernel\Format::FORMAT_ALIGN_VERTICAL_CENTER)
                ->toResource()
            );

            // 设置列的宽度
            $fileObject->setColumn('A1:A1000', 10)
                ->setColumn('B1:B1000', 30)
                ->setColumn('C1:C1000', 10)
                ->setColumn('D1:D1000', 10)
                ->setColumn('E1:E1000', 10)
                ->setColumn('F1:F1000', 30)
                ->setColumn('G1:G1000', 25)
                ->setColumn('H1:H1000', 30)
                ->setColumn('I1:I1000', 30)
                ->setColumn('J1:J1000', 30)
                ->setColumn('K1:K1000', 30)
                ->setColumn('L1:L1000', 30)
                ->setColumn('M1:M1000', 30)
                ->setColumn('N1:N1000', 30)
                ->setColumn('O1:O1000', 30)
                ->setColumn('P1:P1000', 30)
                ->setColumn('Q1:Q1000', 30)
                ->setColumn('R1:R1000', 30);
            // 设置高度
            $format3 = new \Vtiful\Kernel\Format($fileHandle);
            $fileObject->setRow("A3:F1000", 22, $format3
                ->align(\Vtiful\Kernel\Format::FORMAT_ALIGN_VERTICAL_CENTER)
                ->toResource()
            );


            // 类型选择
            $typeArr    = ['单选', '多选'];
            $validation = new \Vtiful\Kernel\Validation();
            $validation->validationType(\Vtiful\Kernel\Validation::TYPE_LIST)->valueList($typeArr);
            $fileObject->validation('A3:A1000', $validation->toResource());

            // 题库分类选择
            $gradeArr   = QuestionClassModel::order('sort desc,id desc')->column('title');
            $validation = new \Vtiful\Kernel\Validation();
            $validation->validationType(\Vtiful\Kernel\Validation::TYPE_LIST)->valueList($gradeArr);
            $fileObject->validation('D3:D1000', $validation->toResource());

            // 年级选择
            $gradeArr   = GradeModel::order('sort desc,id desc')->column('title');
            $validation = new \Vtiful\Kernel\Validation();
            $validation->validationType(\Vtiful\Kernel\Validation::TYPE_LIST)->valueList($gradeArr);
            $fileObject->validation('E3:E1000', $validation->toResource());


            $filePath = $fileObject->output();
            $filePath = str_replace(public_path(), '', $filePath);
            $excel->close();

            return [
                'filePath' => export_path($filePath, 'public'),
                'fileName' => "题库导入模板.xlsx"
            ];

        } catch (\Exception $e) {
            return abort($e->getMessage());
        }
    }

    /**
     * 导入数据
     * @param string $file 上传表格文件的路劲
     */
    public static function importData(string $file)
    {
        // 题目类型
        $type = [
            '单选' => 1,
            '多选' => 2
        ];
        // 题库分类
        $questionClass = QuestionClassModel::order('sort desc,id desc')
            ->column('id', 'title');
        // 年级
        $grade = GradeModel::order('sort desc,id desc')
            ->column('id', 'title');


        $config = ['path' => './public'];
        $excel  = new \Vtiful\Kernel\Excel($config);

        Db::startTrans();
        try {

            // 读取文件
            $tableData = $excel->openFile($file)
                ->openSheet()
                ->getSheetData();

            // 选择项
            $optionsAll  = [];
            $createCount = 0;
            foreach ($tableData as $k => $v) {
                if ($k < 2) {
                    continue;
                }
                // 去除里面的空格
                foreach ($v as $ks => $vs) {
                    $v[$ks] = trim($vs);
                }
                // 正确的数据，必须要有题目类型、题目、正确选择、包含一个答案
                if (
                    isset($v[0]) &&
                    $v[0] &&
                    isset($v[1]) &&
                    $v[1] &&
                    isset($v[6]) &&
                    $v[6] &&
                    isset($v[7]) &&
                    $v[7]
                ) {

                    $question = [
                        'type'              => $type[$v[0]] ?? null,
                        'title'             => $v[1],
                        'points'            => intval($v[2]) > 0 ? intval($v[2]) : 0,
                        'question_class_id' => $v[3] ? ($questionClass[$v[3]] ?? null) : null,
                        'grade_id'          => $v[4] ? ($grade[$v[4]] ?? null) : null,
                        'answer_content'    => $v[5],
                    ];
                    // 再次检查数据，只检查题目类型
                    if ($question['type']) {
                        // 插入题库
                        $result      = QuestionModel::create($question);
                        $createCount += 1;

                        // 正确选项转小写
                        $v[6] = strtolower($v[6]);

                        foreach ($v as $ks => $vs) {
                            if ($ks < 7 || ! trim($vs)) {
                                continue;
                            }
                            $optionsAll[] = [
                                'question_id' => $result->id,
                                'title'       => trim($vs),
                                'is_answer'   => strpos($v[6], self::numberToLetter($ks)) !== false ? 2 : 1,
                            ];
                        }
                    }
                }
            }

            // 插入选择项
            $optionsAll = array_reverse($optionsAll);
            (new QuestionOptionsModel())->saveAll($optionsAll);

            $excel->close();
            // 提交事务
            Db::commit();
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
            abort($e->getMessage());
        }
        return $createCount;
    }

    /**
     * 导入的时候把数字转字母，看是否是正确的选项
     */
    private static function numberToLetter($number)
    {
        $arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        return $arr[$number - 7] ?? '-';
    }

    /**
     * 批量修改分类
     * @param array $params
     * */
    public static function updateQuestionClass(array $params)
    {
        if (! $params['question_class_id'] || ! $params['ids']) {
            abort('参数错误');
        }

        QuestionModel::where('id', 'in', $params['ids'])
            ->update([
                'question_class_id' => $params['question_class_id']
            ]);
    }

    /**
     * 批量修改年级
     * @param array $params
     * */
    public static function updateGrade(array $params)
    {
        if (! $params['grade_id'] || ! $params['ids']) {
            abort('参数错误');
        }

        QuestionModel::where('id', 'in', $params['ids'])
            ->update([
                'grade_id' => $params['grade_id']
            ]);
    }

}