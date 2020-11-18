var express = require('express');
var router = express.Router();

//Get Category model
var Category = require('../models/category');

/*
 * GET Category index
 */

router.get('/', function (req, res) {
    Category.find(function (err,kategorije) {
       if (err)
           return console.log(err);
       res.render('admin/kategorije', {
           kategorije:kategorije
       });
    });
});

/*
 * GET add Category
 */

router.get('/dodaj-kategoriju', function (req, res) {

    var title = "";

    res.render('admin/dodaj_kategoriju', {
        title: title
    });

});

/*
 * POST add Category
 */

router.post('/dodaj-kategoriju', function (req, res) {

    req.checkBody('title', 'Morate uneti ime kategorije').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors');
        res.render('admin/dodaj_kategoriju', {
            errors: errors,
            title: title
        });
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'Uneli ste postojecu kategoriju, izaberite drugi.');
                res.render('admin/dodaj_kategoriju', {
                    title: title
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });
                
                category.save(function (err) {
                    if(err)
                        return console.log(err);
                    
                    req.flash('success', 'Kategorija je dodata!');
                    res.redirect('/admin/kategorije');
                });
            }
        });
    }

});

/*
 * GET edit categorie
 */

router.get('/izmeni-kategoriju/:id', function (req, res) {

    Category.findById(req.params.id, function (err, category) {
        if (err)
            return console.log(err);
        
        res.render('admin/izmeni_kategoriju', {
        title: category.title,
        id: category._id
    });
    });
});

/*
 * POST izmeni kategoriju
 */

router.post('/izmeni-kategoriju/:id', function (req, res) {

    req.checkBody('title', 'Morate uneti ime naslova').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors');
        res.render('admin/izmeni_kategoriju', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, function (err, category) {
            if (category) {
                req.flash('danger', 'Uneli ste postojece ime kategorije, izaberite drugo.');
                res.render('admin/izmeni_kategoriju', {
                    title: title,
                    id:id
                });
            } else {
                
                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);
                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err)
                            return console.log(err);

                        req.flash('success', 'Kategorija je izmenjena!');
                        res.redirect('/admin/kategorije');
                    });
                });
            }
        });
    }

});

/*
 * GET delete category
 */

router.get('/obrisi-kategoriju/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return console.log(err);
        req.flash('success', 'Kategorija je obrisana!');
        res.redirect('/admin/kategorije/');
    });
});

//Exports
module.exports = router;
