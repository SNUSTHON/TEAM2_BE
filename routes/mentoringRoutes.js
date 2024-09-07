const express = require('express');
const router = express.Router();
const { getMentoring, detailMentoring, applyMentoring, createMentoring } = require('../controllers/mentoringController');

router.get('/list', getMentoring);
router.get('/detail/:id', detailMentoring);
router.post('/apply', applyMentoring);
router.post('/create', createMentoring);

module.exports = router;
