const express = require('express'),
	fileUpload = require('express-fileupload'),
	ipfilter = require('express-ipfilter').IpFilter
  IpDeniedError = require('express-ipfilter'). IpDeniedError

const cors = require('cors')

const port = 8080
const app = express()

app.use(cors())

const ips = ['::ffff:127.0.0.1', '::ffff:0.0.0.0']
app.use(ipfilter(ips, { mode: 'allow', log: false }))

app.use((err, req, res, _next) => {
	if (err instanceof IpDeniedError) {
	} else {
	}

})

app.use('/', express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true, tempFileDir: './tmp/' }))

app.post('/upload', (req, res) => {
	console.log(req.connection.remoteAddress)

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
