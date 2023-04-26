var express = require('express');
const router = express.Router();
const db = require('../conf/database');

// used to test connection to MYSQL database
db.getConnection((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected!');
    db.query('USE team05db');
});

// function to search the back-end
function search(req, res, next) {
    // user's search term
    let searchTerm = req.query.search;
    // user's selected category
    let category = req.query.category;
    let filter = req.query.filter;
    let query = 'SELECT * FROM Restaurant';

    if (searchTerm != '' && category != '') {
        query = `SELECT * FROM Restaurant WHERE restaurant_category = '` + category + `' AND restaurant_name LIKE '%` + searchTerm + `%'`;
    } else if (searchTerm != '' && category == '') {
        query = `SELECT * FROM Restaurant WHERE restaurant_name LIKE '%` + searchTerm + `%'`;
    } else if (searchTerm == '' && category != '') {
        query = `SELECT * FROM Restaurant WHERE restaurant_category = '` + category + `'`;
    }

    if(filter == 'Low to High') {
        query = `SELECT * FROM Restaurant ORDER BY price_range`;
    } else if(filter == 'High to Low') {
        query = `SELECT * FROM Restaurant ORDER BY price_range DESC`;
    } else if(filter == 'Featured') {
        query = `SELECT * FROM Restaurant ORDER BY restaurant_id`;
    }
    
    db.query(query, (err, result) => {
        if (err) {
            req.searchResult = [];
            req.searchTerm = "";
            req.category = "";
            next();
        }

        req.searchResult = result;
        req.searchTerm = searchTerm;
        req.category = category;

        next();
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', { title: 'Home Page' });
});

router.get('/index', (req, res, next) => {
    res.render('index', { title: 'Team Page' });
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register');
});

router.get('/checkout', (req, res, next) => {
    res.render('checkout');
});

router.get('/register-driver', (req, res, next) => {
    res.render('register_driver');
});

router.get('/register-restaurant', (req, res, next) => {
    res.render('register_restaurant');
});

router.get('/upload', (req, res, next) => {
    res.render('menu_upload');
});

router.get('/selected', (req, res, next) => {
    res.render('selected_restaurant');
});

router.get('/orders', (req, res, next) => {
    res.render('orders');
});

//http://localhost:3000/result?category=value&search=value
router.get('/result', search, function (req, res, next) {
    let searchResult = req.searchResult;
    res.render('result', {
        title: 'Search Results',
        results: searchResult,
        searchTerm: req.searchTerm,
        category: req.category
    });
});

module.exports = router;
