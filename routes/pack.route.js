/** load express js */
const express = require(`express`)

/** create object of express */
const app = express()

/** load obat controller */
const packController = require(`../controllers/pack.controller`)

/** load authorization from middleware */
const authorization = require(`../middleware/authorization`)

/** allow route to read urlencoded data */
app.use(express.urlencoded({ extended: true }))

/** create route for access telur's data */
app.get("/", authorization.cekUser,packController.showDataPack)

/** route untuk menampilkan form tambah data */
app.get("/add", authorization.cekUser,packController.showAddPage)

/** route utk memproses form tambah data */
app.post("/add", authorization.cekUser,packController.processInsert)

/** route utk menampilkan edit page */
app.get(`/edit/:id`, authorization.cekUser,packController.showEditPage)

/** route utk proses edit */
app.post(`/edit/:id`, authorization.cekUser,packController.processUpdate)

/** route utk menghapus data pack */
app.get(`/delete/:id`, authorization.cekUser,packController.processDelete) 

/** export object "app" to another file */
module.exports = app