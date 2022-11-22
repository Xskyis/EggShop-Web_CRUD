/** load express js */
const express = require(`express`)

/** create object of express */
const app = express()

/** load obat controller */
const memberController = require(`../controllers/member.controller`)

/** load authorization from middleware */
const authorization = require(`../middleware/authorization`)

/** allow route to read urlencoded data */
app.use(express.urlencoded({ extended: true }))

/** create route for access member's data */
app.get("/", authorization.cekUser, memberController.showDataMember)

/** buat route utk menampilkan form tambah data member */
app.get(`/add` , authorization.cekUser,memberController.showAddPage)

/** buat route utk mengirimkan data yg di insert kan user ke tabel */
app.post(`/add`, authorization.cekUser,memberController.processInsert )

/** buat route utk menampilkan edit page member */
app.get(`/edit/:id`, authorization.cekUser,memberController.showEditPage)

/** buat route utk memproses edit  */
app.post(`/edit/:id`, authorization.cekUser,memberController.processUpdate)

/** buat route utk delete  */
app.get(`/delete/:id`, authorization.cekUser,memberController.processDelete)

/** export object "app" to another file */
module.exports = app