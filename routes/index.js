const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/user.js');
const Prod = require('../models/product.js');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {

    console.log(new User(req.user).products);

    Prod.find({}, function (err, result) {

        console.log(JSON.stringify(result));
        res.render('dashboard', {


            user: req.user,
            productArray: result
        });
    });


});
router.get('/dashboard/:id', (req, res) => {

    Prod.update({_id: req.params.id}, {$inc: {qty: -1}}, function (err, raw) {

        console.log('The raw response from Mongo was ', raw);
    });

    res.redirect('/dashboard');

});
router.get('/addProduct', ensureAuthenticated, (req, res) => {
    res.render('add_product', {
        user: req.user
    });
});

router.post('/addProduct',ensureAuthenticated, (req, res) => {
    const {name, qty} = req.body;
    let errors = [];

    if (!name || !qty) {
        errors.push({msg: 'Please enter all fields'});
    }

    if (!((qty >= 0) && (qty <= 1000))) {
        errors.push({msg: 'Quantity should be between 0 to 100'});

    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            qty
        });
    } else {

                const newProd = new Prod({
                    name,
                    qty
                });


                newProd
                    .save()
                    .then(prod => {
                        req.flash(
                            'success_msg',
                            'Added '+prod.name
                        );

                        var UpUser= req.user;
                        UpUser.products.push(prod._id);
                        UpUser.products.push(prod._id);
                        console.log("Adding check" + UpUser.products);
                        User.update({email: req.user.email}, {products: toString(UpUser.products)});
                        res.redirect('/dashboard');
                    })
                    .catch(err => console.log(err));



    }
});


module.exports = router;
