var express=require('express');
var mongoose=require('mongoose');
const { ensureAuthenticated} = require('../helper/auth');

mongoose.Promise = global.Promise;

var router = express.Router();
router.use(ensureAuthenticated);

require('../models/ideas');
const Idea = mongoose.model('ideas');
router.use(ensureAuthenticated);


router.get('/', ensureAuthenticated, (err, res) => {
    Idea.find({user: err.user.id}).sort({ date: 'desc' }).then((ideas) => {

        res.render('ideas/index', { ideas: ideas });
    }
    );

});




router.get('/add', (req, res) => {

    res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {

    Idea.findById(req.params.id)
        .then((idea) => {
            if(idea.user!=req.user.id){
                req.flash('error_msg','Not Authorize');
                res.redirect('/ideas')
            }
            res.render('ideas/edit', { idea: idea });
        })
        .catch((err) => { console.log(err); });

});
router.put('/:id', (req, res) => {

    Idea.findById(req.params.id)
        .then((idea) => {
            if(!idea.user ==user.id){
                res.redirect('/ideas');

            }
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then((idea) => {
                    res.redirect('/ideas');
                });
        })
        .catch((err) => { console.log(err); });

});

router.delete('/:id', (req, res) => {

    Idea.remove({ _id: req.params.id})
        .then((idea) => {
            req.flash('success_msg',
                'video deleted');
            res.redirect('/ideas');
        });

});



router.post('/', (req, res) => {
    var request = req.body;
    var errors = [];
    if (!req.body.title) {
        errors.push({ text: 'please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'please add a details' });
    }
    if (errors.length != 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        };
        new Idea(newIdea).save().then((idea) => {
            req.flash('success_msg', 'video saved');
            res.redirect('/ideas');
        });
    }

});


module.exports=router;