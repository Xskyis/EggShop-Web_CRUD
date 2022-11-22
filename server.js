/** load library express */
const express = require(`express`)

/** instance "app" object */
const app = express()

/** Load library express session */
const session = require(`express-session`)

/** define port for the server */
const PORT = `8000`

/** set view engine to ejs */
app.set(`view engine`, `ejs`)

/** session configuration */
app.use(session({
    secret: `baha`,
    resave: false,
    saveUninitialized: false
}))

/** load routes */
const telur = require(`./routes/telur.route`)
const pack = require(`./routes/pack.route`)
const member = require(`./routes/member.route`)
const admin = require(`./routes/admin.route`)
const auth = require(`./routes/auth.route`)
const transaksi = require(`./routes/transaksi.route`)
const cart = require(`./routes/cart.route`)
const home = require(`./routes/home.route`)


/** define prefix for route obat */
app.use(`/telur`, telur)

/** define prefix untuk pack */
app.use(`/pack` , pack)

/** define prefix utk member */
app.use(`/member`, member)

/** define prefix utk admin */
app.use(`/admin`, admin)

/** define prefix utk auth */
app.use(`/auth`, auth)

/** define prefix utk transasksi */
app.use(`/transaksi`, transaksi)

/** define prefix utk cart */
app.use(`/cart`, cart)

/** define prefix utk cart */
app.use(`/home`, home)

/** running web server based on defined PORT */
app.listen(PORT, () => {
    console.log(`Server PenjualanTelur is running on port ${PORT}`);
})
