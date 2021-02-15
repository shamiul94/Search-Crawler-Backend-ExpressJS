var express = require('express');
var router = express.Router();

const ScraperController = require('../controllers/ScraperController');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get("/url", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

router.get("/abc", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});


router.get('/crawldata', ScraperController.scraper);


module.exports = router;