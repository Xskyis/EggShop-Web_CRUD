/** Memanggil model obat */
const telurModel = require(`../models/telur.model`)
/** call customer model */
const memberModel = require(`../models/member.model`)
/** call pack model */
const packmodel = require(`../models/pack.model`)
/** call transaksi model */
const transaksiModel = require(`../models/transaksi.model`)
/** call detai;_transaksi */
const detailModel = require(`../models/detail_transaksi.model`)


/** function untk menampilkan form transaksi  */
exports.showFormTransaksi = async (request, response) => {
    try {
        /** ambil data obat */
        let telur = await telurModel.findAll()
        /** ambil data customer */
        let member = await memberModel.findAll()
        /** ambil data pack */
        let pack = await packmodel.findAll()
        /** ambil data stok di tabel telur */
        let stok = await telurModel.findAll()

        /** prepare data yang akan di passing ke view */
        let sendData = {
            dataTelur: telur,
            dataPack: pack,
            dataMember: member,
            page: `form-transaksi`,
            tgl_transaksi: ``,
            dataTelurString: JSON.stringify(telur),
            dataPackString: JSON.stringify(pack),
            cart: request.session.cart,
            dataUser: request.session.dataUser
        }

        return response.render(`../views/index`, sendData)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** function utk menambahkan obat ke keranjang */
exports.addCart = async (request, response) => {
    try {
        /** get data obat berdasarkan id obat yg dikirimkan */
        let selectedTelur = await telurModel.findByCriteria({
            id: request.body.id_telur
        })

        /** get data pack berdasarkan id pack yg dikirimkan */
        let selectedPack = await packmodel.findByCriteria({
            id: request.body.id_pack
        })

        /** tampung / receive data yg dikirimkan */
        let storeData = {
            id_telur: request.body.id_telur,
            jenis_telur: selectedTelur[0].jenis_telur,
            jumlah_telur: request.body.jumlah_telur,
            harga_telur: request.body.harga_telur,
            id_pack: request.body.id_pack,
            nama_pack: selectedPack[0].nama_pack,
            jumlah_pack: request.body.jumlah_pack,
            harga_pack: request.body.harga_pack,
            total_transaksi: request.body.total_transaksi
        }

        /** masukan data ke keranjang 
         * push() menambah data ke dalam array
        */
        request.session.cart.push(storeData)

        response.redirect(`/transaksi/add`)

        /** masukan data ke cart/keranjang menggunakn session */

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** fungsi utk menghapus data item pada cart */
exports.deleteCart = async (request, response) => {
    try {
        /** ambil seluruh data cart pada session */
        let cart = request.session.cart
        /** ambil id obat yg akan di hapus dari cart */
        let id_telur = request.params.id
        /** ambil id pack yg akan di hapus dari cart */
        let id_pack = request.params.id

        /** cari tahu posisi index dari data yg akan di haapus */
        let index = cart.findIndex(item => item.id_telur == id_telur || item.id_pack == id_pack)

        /** hapus data sesuai index yg di masukan 
         * 
         * splice => untuk menghapus data pada array
        */
        cart.splice(index, 1)

        /** kembalikan data cart ke dalam session */
        request.session.cart = cart

        /** redirect ke halam form transaksi */
        return response.redirect(`/transaksi/add`)


    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** menyimpan data transaksi */
exports.simpanTransaksi = async (request, response) => {
    try {
        /** tampung data yg dikirimkan */
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_member: request.body.id_member,
            id_admin: request.session.dataUser.id
        }

        /** simpan transaksi */
        let resultTransaksi = await transaksiModel.add(newTransaksi)
        
        /** menampung isi cart */
        let cart = request.session.cart
       
        /** looping  */
        for (let i = 0; i < cart.length; i++) {
            /** hapus data key nama obat dari cart */
            delete cart [i].jenis_telur
            /** hapus data key nama pack dari cart */
            delete cart [i].nama_pack
            /** hapus data key total keseluruhan dari cart */
            delete cart [i].total_transaksi

            /** tambahkan key id transaksi */
            cart[i].id_transaksi = resultTransaksi.insertId

            /** simpan cart ke define detail_transaksi */
            await detailModel.add(cart[i])
        }

        /** kosongkan lagi cart (back to default) */
        request.session.cart = []

        /** kembalikan ke form transaksi */
        return response.redirect(`/transaksi/add`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** fungsi utk menampilkan data transaksi */
exports.showDataTransaksi = async (request, response) => {  
    try {
        /** ambil data transaksi */
        let transaksi = await transaksiModel.findAll()

        /** sisipin data detail dari setiap transaksi */
        for (let i = 0; i < transaksi.length; i++) {
            /** ambil id transaki  */
            let id = transaksi[i].id

            /** ambil dta detail sesuai id */
            let detail = await detailModel.findByCriteria({ id_transaksi:id })

            /** sisipin detail ke transaksi nya */
            transaksi[i].detail = detail
        }

        /** prepare data yg dikirm ke view */
        let sendData = {    
            page: `transaksi`,
            dataUser: request.session.dataUser,
            transaksi: transaksi
        }

        /** return  */
        return response.render(`../views/index`, sendData)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** function utk menghaps data transaksi */
exports.deleteTransaksi = async (request, response) => {    
    try {
        //menampung data id utk di hapus
        let id = request.params.id

        //menghapus data detail transaksi
        await detailModel.delete({ id_transaksi: id })

        //menghapus data transaksi
        await transaksiModel.delete({ id: id })

        return response.redirect(`/transaksi`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}
