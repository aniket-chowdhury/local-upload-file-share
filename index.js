const express = require('express'),
	fileUpload = require('express-fileupload'),
	ipfilter = require('express-ipfilter').IpFilter
IpDeniedError = require('express-ipfilter').IpDeniedError
const requestIp = require('request-ip')

const cors = require('cors')

const port = 8080
const app = express()

app.use(cors())

const ips = ['::ffff:127.0.0.1', ]
app.use(ipfilter(ips, { mode: 'allow', log: false }))

app.use((err, req, res, next) => {
	if (err instanceof IpDeniedError) {
		console.error('Unauthorized request from ', requestIp.getClientIp(req))
		res.sendStatus(408)
	} else {
		next()
	}
})

app.use('/', express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: './tmp/',
		limits: { fileSize: 100 * 1024 * 1024 },
		debug: true,
		safeFileNames: true
	})
)

app.post('/upload', (req, res) => {
	if (req.files && req.files.brain.name) {
		path_ = `${Math.floor(Date.now() / 1000)}_${req.files['brain']['name']}`
		filepath = `./uploads/${path_}`
		req.files.brain.mv(filepath, err => {
			if (err) return res.status(500).send(err)
			res.send('okay')
		})
	} else res.sendStatus(400)
})

app.listen(port, () => console.log(`listening on port ${port}`))
