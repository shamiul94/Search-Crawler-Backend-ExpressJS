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


router.get('/crawldata/:url', ScraperController.scraper);

// router.get('/test/:url', (req, res, next) => {
//     console.log(req.params);
//     res.json({ id: req.params });
// });


module.exports = router;