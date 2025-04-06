const express = require('express');
const router = express.Router();

const { generateRoadmap } = require('../controllers/roadmapController');

router.post('/generate', generateRoadmap);

router.get('/generate', (req, res) => {
    res.status(200).json({ message: 'Roadmap API is working!' });
});

router.get('/roadmap', (req, res) => {
    res.status(200).json({ message: 'Roadmap endpoint' });
});

module.exports = router;