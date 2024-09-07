const mongoose = require('mongoose');
const { Mentoring } = require('../models/mentorings');
const { Topic } = require('../models/topics')
const { User } = require('../models/users'); 

const getMentoring = async (req, res) => {
    try {
        const { topics, sort = 'latest', limit = 10 } = req.query;  
        const query = {}; 

        if (topics) {
            const topicList = topics.split(',');  // topic을 쉼표로 구분하여 배열로 변환
            query.topics = { $in: topicList.map(topic => mongoose.Types.ObjectId(topic)) };  // topics 필드가 주어진 topic 중 하나 이상 포함
        }

        // 정렬 기준 설정
        let sortOption = { createdAt: -1 };  // 기본값: 최신순
        if (sort === 'rating') {
            sortOption = { rating: -1 };  // 별점순 정렬
        }

        // 멘토링 데이터 조회
        const mentoringList = await Mentoring.find(query)
            .populate({
                path: 'mentor_id', 
                select: 'name temperature' 
            })
            .sort(sortOption)  
            .limit(parseInt(limit))  
            .exec();

        const response = {
            mentoring_list: mentoringList.map(mentoring => ({
                title: mentoring.title,
                mentor_name: mentoring.mentor_id ? mentoring.mentor_id.name : "해당멘토링id에 해당하는 이름 없음", 
                temperature: mentoring.mentor_id ? mentoring.mentor_id.temperature : "해당멘토링id에 해당하는 온도 없음", 
                rating: mentoring.schedule.reduce((acc, schedule) => acc + (schedule.rating || 0), 0) / mentoring.schedule.length || 0,  // 평균 별점 계산
                reviews_count: mentoring.schedule.length, 
                token: mentoring.token, 
                topic: mentoring.topics.join(', ')  
            }))
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: `멘토링 전체리스트 가져오기 실패: ${error.message}` });
    }
};

    
const detailMentoring = async (req, res) => {
    try {
        const mentoringId = req.params.id;

        // mentoring_id로 멘토링 정보 가져오기
        const mentoring = await Mentoring.findById(mentoringId)
            .populate({
                path: 'topics',  // topics 필드를 참조하여 Topic 데이터를 가져옴
                select: 'topic_name'  // Topic 모델의 topic_name 필드만 가져옴
            })
            .exec();

        if (!mentoring) {
            return res.status(404).json({ message: '해당 멘토링을 찾을 수 없습니다.' });
        }

        // mentor_id로 멘토 정보 가져오기
        const mentor = await User.findById(mentoring.mentor_id).exec();
        if (!mentor) {
            return res.status(404).json({ message: '해당 멘토를 찾을 수 없습니다.' });
        }

        const response = {
            mentoring: {
                mentoring_id: mentoring._id,
                title: mentoring.title,
                mentor_name: mentor.name,
                temperature: mentor.temperature,
                contents: mentoring.contents,
                supplies: mentoring.supplies,
                topics: mentoring.topics.map(topic => topic.topic_name), 
                token: mentoring.token,
                reviews: mentoring.schedule.map(schedule => ({
                    user: schedule.mentee_id.name,  
                    rating: schedule.rating,
                    content: schedule.reviews
                }))
            }
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: `멘토링 세부 정보 가져오기 실패: ${error.message}` });
    }
};



const applyMentoring = async (req, res) => {
    try {
        const { mentoring_id, mentee_id, date } = req.body;

        const updatedMentoring = await Mentoring.findByIdAndUpdate(
            mentoring_id,  //mentoring_id로 찾기
            { 
                $push: {  
                    schedule: {
                        date : req.date,
                        mentee_id : req.mentee_id,
                        reviews : "",
                        rating : null, 
                        iscompleted: false 
                    }
                }
            },
            { new: true, useFindAndModify: false } 
        );
        // 업데이트된 멘토링 문서가 없을 경우
        if (!updatedMentoring) {
            return res.status(404).send('해당 멘토링을 찾을 수 없습니다.');
        }
        res.status(201).json({
            message: '멘토링 신청 성공',
            mentoring_id: updatedMentoring._id  // 생성된 mentoring_id 반환
        });
    } catch (error) {
        res.status(500).send(`멘토링 스케줄 추가 실패: ${error.message}`);
    }
};

const createMentoring = async (req, res) => {
    try {
        const newMentoring = new Mentoring({ 
            mentor_id: req.body.mentor_id, 
            title: req.body.title,
            contents: req.body.contents,
            supplies: req.body.supplies,
            topics: req.body.topics, 
            available_date: req.body.available_date, 
            token: req.body.token, 
        }); 
        await newMentoring.save(); 
        res.status(201).json({
            message: '멘토링 신청 성공',
            mentoring_id: newMentoring._id  // 생성된 mentoring_id 반환
        });
    } catch (error) {
        res.status(400).send(`멘토링 신청 실패: ${error.message}`);
    }
};


module.exports = {getMentoring, detailMentoring, applyMentoring, createMentoring };
