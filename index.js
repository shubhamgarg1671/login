const app = require('express')()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const Nexmo = require('nexmo')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
nunjucks.configure('views', {
    express: app
});

const nexmo = new Nexmo({
    apiKey: 'a73991b2',
    apiSecret: 'IHf9J0QPddShg3BVSHUBHAM'
});

app.get('/', (req, res) => {
    res.render('index.html', { message: 'Hello world!' })
});

app.post('/verify', (req, res) => {
    nexmo.verify.request({
        number: `91${req.body.number}`,
        brand: 'abc',
        code_length: '4'
    }, (error, result) => {
        if (result.status != 0 || req.body.username !== 'shubham' || req.body.password !== 'Abc123!') {
            res.render('index.html', { message: result.error_text });
        } else {
            res.render('check.html', { requestId: result.request_id })
        }
    })
});

app.post('/check', (req, res) => {
    nexmo.verify.check({
        request_id: req.body.requestId,
        code: req.body.code
    }, (error, result) => {
        if (result.status != 0) {
            res.render('index.html', { message: result.error_text });
        } else {
            res.render('success.html')
        }
    })
});


var port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`server running on port ${port}`);
});