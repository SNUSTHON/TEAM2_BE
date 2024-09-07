// 마이페이지
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { isLoggedIn } = require('../middlewares/middleware');
const { User } = require('../models/users');
const { Mentoring } = require('../models/mentorings');
const { default: mongoose } = require('mongoose');

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// 프로필 조회
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.user._id;
        const user = await User.findById(userId);

        profiles = user.profiles;

        if (profiles.length === 0) {
            profiles = {message: '게시글이 없습니다.'};
        }
            
        res.json({
            username: user.username,
            token: user.token,
            temperature: user.temperature,
            user_img: user.user_img,
            description: user.description,
            about_url: user.about_url,
            profiles: profiles
        });
    } catch {
        console.error('프로필 데이터를 가져오는 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 프로필 게시글 추가
router.post('/profile/create', isLoggedIn, upload.single('photo'), async(req, res) => {
    try {
        const userId = req.user.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        
        const { content, upload_time } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: '이미지가 필요합니다.' });
        }

        const optimizedImage = await sharp(file.buffer)
            .resize({ width: 500 }) // 너비를 500px로 리사이즈
            .jpeg({ quality: 80 })  // JPEG 포맷으로 80% 품질로 압축
            .toBuffer();

        const newProfile = {
            content: content,
            photo: optimizedImage,  // 사진은 Base64로 인코딩된 데이터로 받음
            upload_time: upload_time
        };
        
        user.profiles.push(newProfile);

        await user.save();
        res.status(200).json({ message: '프로필이 성공적으로 추가되었습니다.' });
    } catch {
        console.error('프로필 데이터를 추가하는 중 오류 발생:', error);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

// 프로필 게시물 삭제
router.get('/profile/remove/:profile_id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.user._id;
        const profileId = req.params.profile_id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { profiles: { profile_id: new mongoose.Types.ObjectId(profileId) } } },  // 'new' 키워드 추가
            { new: true }  // 업데이트된 사용자 문서 반환
        );

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '프로필이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('프로필 삭제 중 오류 발생: ', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 프로필 게시물 세부 내용 확인
router.get('/profile/:profile_id', isLoggedIn, async(req, res) => {
    try {
        const userId = req.user.user._id;
        const profileId = req.params.profile_id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
        }

        const profile = user.profiles.find(p => p.profile_id.toString() === profileId);
        if (!profile) {
            return res.status(404).json({message: '게시글을 찾을 수 없습니다.'});
        }

        res.json(profile);
    } catch {
        console.error('프로필 게시글을 찾는 중 오류 발생: ', error);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

// 멘토링 리스트 확인
router.get('/mentoring/list', isLoggedIn, async(req, res) => {
    try {
        const userId = req.user.user._id;

        mentorings = await Mentoring.find({ mentor_id: userId });
        
        if (mentorings.length === 0) {
            mentorings = { message: "진행한 멘토링 기록이 없습니다." };
        }

        res.json(mentorings);
    } catch {
        console.error('멘토링 데이터를 조회하는 중 오류 발생:', error);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});


module.exports = router;