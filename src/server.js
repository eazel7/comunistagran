import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import bodyParser from 'body-parser'
import session from 'express-session'
import injectApi from './injectApi'
import { API } from './api'
import { Client as MinioClient } from 'minio'
import { MongoClient } from 'mongodb'
import JWT from 'jsonwebtoken'

const { NODE_ENV } = process.env
const dev = NODE_ENV === 'development'
var MongoDBStore = require('connect-mongodb-session')(session)
import dotenv from 'dotenv'

let config = dotenv.config().parsed

var store = new MongoDBStore({
  uri: config.MONGODB_URI,
  collection: 'sessions',
})

store.on('error', function (error) {
  console.error(error)
})

const minioClient = new MinioClient({
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
  endPoint: config.MINIO_ENDPOINT,
  port: Number.parseInt(config.MINIO_PORT),
  useSSL: !!config.MINIO_USE_SSL,
})

MongoClient.connect(
  config.MONGODB_URI,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return reject(err)

    const api = new API(client.db(), minioClient)

    const globalConsole = console;
    polka({
      onError: (err, req, res, next) => {
        globalConsole.error(err)
      },
    })
      .use(bodyParser.json())
      .use(
        session({
          secret: config.SESSION_SECRET,
          resave: false,
          saveUninitialized: true,
          cookie: {
            maxAge: 31536000,
          },
          store: store
        }),
      )
      .use(
        (req, res, next) => {
          // patching functions to ease import
          req.jwtSecret = config.JWT_SECRET

          res.json = (value) => {
            res.writeHead(200, { 'content-type': 'application/json' })
            res.end(JSON.stringify(value))
          }
          next()
        },
        (req, res, next) => {
          const token =
            req.headers['authorization'] || req.session['ACCESS_TOKEN']

          if (!token) return next()

          req.token = token

          try {
            req.user = JWT.verify(token, req.jwtSecret, {})

            next()
          } catch (e) {
            res.write(e.toString());
            res.end();
          }
        },
        (req, res, next) => {
          if (
            (!req.user || !req.user.isAdmin) &&
            req.url.startsWith('/admin')
          ) {
            res.writeHead(307, {
              location: '/unauthorized',
            })
            res.end()
          } else {
            next()
          }
        },
        injectApi(api),
        compression({ threshold: 0 }),
        sirv('static', { dev }),
        sapper.middleware({
          session: (req) => ({
            ACCESS_TOKEN: req.session['ACCESS_TOKEN'],
          }),
        }),
      )
      .listen(config.PORT, (err) => {
        if (err) console.log('error', err)
      })
  },
)
