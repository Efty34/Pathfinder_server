const express = require('express');
const router = express.Router();

const { generateRoadmap } = require('../controllers/roadmapController');

router.post('/generate', generateRoadmap);

router.get('/roadmap', (req, res) => {
    res.status(200).json({ message: 'Roadmap endpoint' });
});

module.exports = router;