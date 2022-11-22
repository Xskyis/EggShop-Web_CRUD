/** load express js */
const express = require(`express`)

/** create object of express */
const app = express()

/** load obat controller */
const adminController = require(`../controllers/admin.controller`)

/** load authorization from middleware */
const authorization = require(`../middleware/authorization`)

/** allow route to read urlencoded data */
app.use(express.urlencoded({ extended: true }))

/** create route for access member's data */
app.get("/", authorization.cekUser, adminController.showDataAdmin)

/** buat route utk menampilkan form tambah data */
app.get(`/add`, authorization.cekUser,adminController.showAddPage)

/** buat route utk memproses tambah data */
app.post(`/add`, authorization.cekUser,adminController.processInsert)

/** buat route utk menampilkan edit page */
app.get(`/edit/:id`, authorization.cekUser,adminController.showEditPage)

/** buat route utk memproses edit request */
app.post(`/edit/:id`, authorization.cekUser,adminController.processUpdate)

/** buat route utk menghapus edit */
app.get(`/delete/:id`, authorization.cekUser,adminController.processDelete)

/** export object "app" to another file */
module.exports = app