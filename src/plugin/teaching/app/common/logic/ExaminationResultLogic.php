<?php
namespace plugin\teaching\app\common\logic;

use support\think\Db;
use support\Cache;
use plugin\teaching\app\common\model\ExaminationResultModel;
use plugin\teaching\app\common\model\ExaminationPaperModel;
use plugin\teaching\app\common\model\ExaminationResultQuestionModel;
use plugin\teaching\app\common\model\ExaminationResultQuestionOptionsModel;

/**
 * 试卷测评结果
 *
 * @ author zy <741599086@qq.com>
 * */

class ExaminationResultLogic
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
        $orderBy = "id desc";
        if (isset($params['orderBy']) && $params['orderBy']) {
            $orderBy = "{$params['orderBy']},{$orderBy}";
        }

        $list = ExaminationResultModel::withSearch(['title', 'user_id', 'examination_paper_class_id', 'create_time'], $params, true)
            ->order($orderBy);

        if ($filter) {
            $list->with(['ExaminationPaperClass'])
                ->field('id,examination_paper_class_id,title,points,points_sum,percent,examination_minutes,create_time');
        } else {
            $list->with([
                'User' => function ($query)
                {
                    $query->field('id,name,tel,img');
                },
                'ExaminationPaperClass'
            ]);
        }

        return $page ? $list->paginate($params['pageSize'] ?? 20) : $list->select();
    }

    /**
     * 获取一条数据
     * @param int $id 数据id
     */
    public static function findData(int $id)
    {
        $data = Cache::get("Examination{$id}");
        if (is_null($data)) {
            $data = ExaminationResultModel::with([
                'User' => function ($query)
                {
                    $query->field('id,name,tel,img');
                },
                'ExaminationPaperClass'
            ])
                ->where('id', $id)
                ->find();
            Cache::set("Examination{$id}", $data, 86400);
        }
        return $data;
    }

    /**
     * 添加
     * @param array $params 需要包含：学生id、试卷id、考试开始时间、考试结束时间、表单信息
     * @param boolean $is_create 是否真正的插入表，或者只是试算分数 用时等数据
     */
    public static function create(array $params, bool $is_create = true)
    {
        if (
            ! isset($params['student_id']) ||
            ! isset($params['examination_paper_id']) ||
            ! isset($params['examination_start_time']) ||
            ! isset($params['examination_end_time']) ||
            ! isset($params['ExaminationPaperQuestion'])
        ) {
            abort('参数错误');
        }

        Db::startTrans();
        try {
            //试卷
            $examinationPaper = ExaminationPaperModel::where('id', $params['examination_paper_id'])->find();

            $examination = [
                'student_id'                 => $params['student_id'],
                'teacher_id'                 => request()->teacher['id'],
                'examination_paper_class_id' => $examinationPaper['examination_paper_class_id'],
                'course_class_id'            => $examinationPaper['course_class_id'],
                'title'                      => $examinationPaper['title'],
                'question_count'             => count($params['ExaminationPaperQuestion']),
                'examination_start_time'     => $params['examination_start_time'],
                'examination_end_time'       => $params['examination_end_time'],
                'examination_minutes'        => ceil(($params['examination_end_time'] - $params['examination_start_time']) / 60),
                'feedback'                   => $params['feedback'] ?? null,
            ];
            if ($is_create) {
                $result = ExaminationResultModel::create($examination);
            }

            //要更新的数组
            $update = [
                'id'         => $is_create ? $result->id : null,
                'points'     => 0, //分数
                'points_sum' => 0, //总分
                'percent'    => 0, //正确率
            ];
            //正确的题数
            $question_success = 0;
            foreach ($params['ExaminationPaperQuestion'] as $k => $v) {
                //题
                $examination_question = [
                    'examination_id' => $is_create ? $result->id : null,
                    'type'           => $v['type'],
                    'title'          => $v['title'],
                    'points'         => $v['points'],
                    'imgs'           => $v['imgs'],
                    'answer_content' => $v['answer_content'],
                    'is_correct'     => 2, //题做对了
                ];
                //题的选项
                $examination_question_options = [];
                //此题是否已经做了
                $is_question_options = false;
                foreach ($v['QuestionOptions'] as $options) {
                    $options['user_is_answer']      = $options['user_is_answer'] ?? 1;
                    $examination_question_options[] = [
                        'title'          => $options['title'],
                        'is_answer'      => $options['is_answer'],
                        'user_is_answer' => $options['user_is_answer'],
                    ];
                    //这道题是否做正确了，题一开始预设是做对了，当某一个选项错了后，此题就算做错了
                    if ($examination_question['is_correct'] == 2) {
                        $examination_question['is_correct'] = $options['is_answer'] == $options['user_is_answer'] ? 2 : 1;
                    }
                    if ($options['user_is_answer'] == 2) {
                        $is_question_options = true;
                    }
                }
                if (! $is_question_options) {
                    $tmp_k = $k + 1;
                    throw new \Exception("第{$tmp_k}道题没做~");
                }

                //插入题
                if ($is_create) {
                    $examination_question_result = ExaminationResultQuestionModel::create($examination_question);
                    //插入题的选择项，选择项里面把题的id装进去
                    $examination_question_options = array_map(function ($item) use ($examination_question_result)
                    {
                        $item['examination_question_id'] = $examination_question_result->id;
                        return $item;
                    }, $examination_question_options);
                    (new ExaminationResultQuestionOptionsModel())->saveAll($examination_question_options);
                }

                //更新主表的数据
                if ($examination_question['is_correct'] == 2) {
                    $update['points'] += $v['points']; //做对了才得分
                    $question_success += 1;
                }
                $update['points_sum'] += $v['points'];

            }
            //更新主表
            $update['percent'] = d2($question_success / count($params['ExaminationPaperQuestion']) * 100);
            if ($is_create) {
                ExaminationResultModel::update($update);
            }

            //假提交的时候，返回数据
            if (! $is_create) {
                Db::rollback();
                return array_merge($examination, $update);
            }
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
        return $result->id;
    }

    /**
     * 删除
     * @param int $id
     */
    public static function delete(int $id)
    {
        ExaminationResultModel::destroy($id);
        Cache::delete("Examination{$id}");
    }

    /**
     * 导出
     * @param array $params
     */
    public static function exportData(array $params)
    {
        try {
            $list    = self::getList($params, false)->select();
            $tmpList = [];
            foreach ($list as $v) {
                $tmpList[] = [
                    "{$v->User->name}/{$v->User->tel}",
                    $v->ExaminationPaperClass->title ?? '--',
                    $v->title,
                    $v->points,
                    $v->points_sum,
                    "{$v->percent}%",
                    $v->examination_minutes,
                    $v->create_time,
                ];
            }

            //表格头
            $header = ['用户', '试卷分类', '试卷名称', '分数', '总分', '正确率', '测评用时（分钟）', '测评时间'];

            return [
                'filePath' => export($header, $tmpList),
                'fileName' => "考试结果.xlsx",
            ];
        } catch (\Exception $e) {
            return abort($e->getMessage());
        }
    }
}