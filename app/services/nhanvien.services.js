const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
class KhachHangService {
    constructor(client){
        this.collectionNhanVien = client.db().collection("nhanvien");
    }
    extractNhanVienData(payload){
        
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const nhanVien = {
            hoten: payload.hoten,
            sdt: payload.sdt,
            password: payload.password,
            diachi : payload.diachi ?? '',
            chucvu: payload.chucvu
        }
        Object.keys(nhanVien).forEach((key)=>{
            if (nhanVien[key] === undefined || nhanVien[key] === null) {
                nhanVien[key] = '';
            }
        });
        return khachHang;
    }
    async create(payload){
        const nhanVien = await this.extractNhanVienData(payload);
        nhanVien.password = await jwt.sign("", nhanVien.password);
        console.log("khachhang " +nhanVien);
        try {
         const ketqua = await this.collectionNhanVien.insertOne(nhanVien);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }
    }
    async find(filter){
        const cursor = await this.collectionNhanVien.find(filter);
        return await cursor.toArray();
    }
    async findById(id){
        console.log("goi ham findById " +id);
        return await this.collectionNhanVien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    async findOne(filter){
        return await this.collectionNhanVien.findOne(filter);
        
    }

}

module.exports = NhanVienService;