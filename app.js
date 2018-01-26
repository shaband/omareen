const express=require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const ideas=require('./routes/ideas');
const users=require('./routes/users');
mongoose.Promise = global.Promise;
const app=new express();
const passport=require('passport');
const path = require('path');
require('./config/passport')(passport);



mongoose.connect('mongodb://localhost/pro', { useMongoClient: true })
	.then(()=>console.log('connected success')).catch((err)=>console.log(err));


var exphbs = require('express-handlebars');
const port =process.env.port || 5000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



//static folder
app.use(express.static(path.join(__dirname,'public')));
//methodOverride

app.use(methodOverride('_method'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req,res,next) {
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user=req.user || null;
	next();
});
app.get('/',(req, res)=>{

	var bod = {
		title: 'welcome',
		body: 'add your text form body here'
	};

	return res.render('index',bod);});

app.get('/about', (req, res) => {
	var bod={
		title:'about',
		body:'welcome from about'
	};
	return res.render('about',bod);
});
app.use('/ideas', ideas);
app.use('/users', users);



app.listen(port,()=>{
	console.log('app working on port : '+port);
});