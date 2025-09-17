CREATE TABLE `sa_examination_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_id` int(11) DEFAULT NULL COMMENT '所属年级',
  `examination_paper_class_id` int(11) DEFAULT NULL COMMENT '分类',
  `title` varchar(300) DEFAULT NULL COMMENT '标题',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态，1》上架，2》下架',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sa_examination_paper_sa_examination_paper_class1_idx` (`examination_paper_class_id`),
  KEY `fk_sa_examination_paper_sa_grade1_idx` (`grade_id`),
  CONSTRAINT `fk_sa_examination_paper_sa_examination_paper_class1` FOREIGN KEY (`examination_paper_class_id`) REFERENCES `sa_examination_paper_class` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_sa_examination_paper_sa_grade1` FOREIGN KEY (`grade_id`) REFERENCES `sa_grade` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='试卷';

CREATE TABLE `sa_examination_paper_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL COMMENT '标题',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='试卷-分类';

CREATE TABLE `sa_examination_paper_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examination_paper_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sa_examination_paper_question_sa_examination_paper1_idx` (`examination_paper_id`),
  KEY `fk_sa_examination_paper_question_sa_question1_idx` (`question_id`),
  CONSTRAINT `fk_sa_examination_paper_question_sa_examination_paper1` FOREIGN KEY (`examination_paper_id`) REFERENCES `sa_examination_paper` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_sa_examination_paper_question_sa_question1` FOREIGN KEY (`question_id`) REFERENCES `sa_question` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COMMENT='试卷-题库-中间表';

CREATE TABLE `sa_examination_result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '哪个学生做的试卷',
  `examination_paper_class_id` int(11) DEFAULT NULL COMMENT '试卷分类',
  `title` varchar(300) DEFAULT NULL COMMENT '试卷的名称',
  `points` int(11) DEFAULT NULL COMMENT '分数',
  `points_sum` int(11) DEFAULT NULL COMMENT '总分',
  `percent` decimal(10,2) DEFAULT NULL COMMENT '正确率，百分比',
  `question_count` int(11) DEFAULT NULL COMMENT '题的数量',
  `examination_start_time` int(11) DEFAULT NULL COMMENT '考试开始时间',
  `examination_end_time` int(11) DEFAULT NULL COMMENT '考试结束时间',
  `examination_minutes` int(11) DEFAULT NULL COMMENT '考试用时，分钟',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sa_examination_sa_examination_paper_class1_idx` (`examination_paper_class_id`),
  KEY `fk_sa_examination_paper_result_sa_user1_idx` (`user_id`) USING BTREE,
  CONSTRAINT `fk_sa_examination_paper_result_sa_user1` FOREIGN KEY (`user_id`) REFERENCES `sa_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_sa_examination_sa_examination_paper_class1` FOREIGN KEY (`examination_paper_class_id`) REFERENCES `sa_examination_paper_class` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COMMENT='试卷-考试结果';

CREATE TABLE `sa_examination_result_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examination_result_id` int(11) NOT NULL,
  `type` tinyint(1) DEFAULT NULL COMMENT '类型，1》单选，2》多选',
  `title` varchar(300) DEFAULT NULL COMMENT '问题名称',
  `points` int(11) DEFAULT NULL COMMENT '此题得分',
  `imgs` text COMMENT '问题中包含的图片',
  `answer_content` text COMMENT '问题解析',
  `is_correct` tinyint(1) DEFAULT '1' COMMENT '此题用户是否做正确了，1》错误，2》正确',
  PRIMARY KEY (`id`),
  KEY `fk_sa_examination_paper_result_question_sa_examination_pape_idx` (`examination_result_id`),
  CONSTRAINT `fk_sa_examination_paper_result_question_sa_examination_paper_1` FOREIGN KEY (`examination_result_id`) REFERENCES `sa_examination_result` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='试卷-考试结果-做的题';

CREATE TABLE `sa_examination_result_question_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examination_result_question_id` int(11) NOT NULL,
  `title` varchar(300) DEFAULT NULL COMMENT '选择项',
  `is_answer` tinyint(1) DEFAULT NULL COMMENT '是否是正确选择，1》否，2》是',
  `user_is_answer` tinyint(1) DEFAULT NULL COMMENT '用户是否选择了此项，1》否，2》是',
  PRIMARY KEY (`id`),
  KEY `fk_sa_examination_question_options_sa_examination_question1_idx` (`examination_result_question_id`),
  CONSTRAINT `fk_sa_examination_question_options_sa_examination_question1` FOREIGN KEY (`examination_result_question_id`) REFERENCES `sa_examination_result_question` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='试卷-考试结果-做的题的选择项';

CREATE TABLE `sa_grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL COMMENT '年级名称',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COMMENT='年级';

CREATE TABLE `sa_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_class_id` int(11) NOT NULL COMMENT '题库分类',
  `type` tinyint(1) DEFAULT NULL COMMENT '类型，1》单选，2》多选',
  `title` varchar(300) DEFAULT NULL COMMENT '问题名称',
  `points` int(11) DEFAULT NULL COMMENT '此题得分',
  `imgs` text COMMENT '问题中包含的图片',
  `grade_id` int(11) DEFAULT NULL COMMENT '问题所属年级',
  `answer_content` text COMMENT '问题解析',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sa_question_sa_grade1_idx` (`grade_id`),
  KEY `fk_sa_question_sa_question_class1_idx` (`question_class_id`),
  CONSTRAINT `fk_sa_question_sa_grade1` FOREIGN KEY (`grade_id`) REFERENCES `sa_grade` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_sa_question_sa_question_class1` FOREIGN KEY (`question_class_id`) REFERENCES `sa_question_class` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COMMENT='题库';

CREATE TABLE `sa_question_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL COMMENT '分类名称',
  `sort` int(11) DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='题库分类';

CREATE TABLE `sa_question_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `title` varchar(300) DEFAULT NULL COMMENT '选择项',
  `is_answer` tinyint(1) DEFAULT NULL COMMENT '是否是正确选择，1》否，2》是',
  PRIMARY KEY (`id`),
  KEY `fk_sa_question_options_sa_question1_idx` (`question_id`),
  CONSTRAINT `fk_sa_question_options_sa_question1` FOREIGN KEY (`question_id`) REFERENCES `sa_question` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8mb4 COMMENT='题库-选择项';
