const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
class KhachHangService {
    constructor(client){
        this.collectionKhachHang = client.db().collection("khachhang");
    }
    extractKhachHangData(payload){
        
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const khachHang = {
            hoten: payload.hoten,
            sdt: payload.sdt,
            password: payload.password,
            diachi : payload.diachi ?? ''
        }
        Object.keys(khachHang).forEach((key)=>{
            if (khachHang[key] === undefined || khachHang[key] === null) {
                khachHang[key] = '';
            }
        });
        return khachHang;
    }
    async create(payload){
        const khachHang = await this.extractKhachHangData(payload);
        khachHang.password = await jwt.sign("", khachHang.password);
        console.log("khachhang " +khachHang);
        try {
         const ketqua = await this.collectionKhachHang.insertOne(khachHang);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }
    }
    async find(filter){
        const cursor = await this.collectionKhachHang.find(filter);
        return await cursor.toArray();
    }
    async findById(id){
        console.log("goi ham findById " +id);
        return await this.collectionKhachHang.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    async findOne(filter){
        return await this.collectionKhachHang.findOne(filter);
        
    }
    async findByName(name){
        return await this.find({
            hoten: {
                $regex: new RegExp(name), $options: "i"
            }
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractKhachHangData(payload);
        console.log(update);
        const result = await this.collectionKhachHang.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionKhachHang.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
    }
    async deleteAll(){
        const resutl = await this.collectionNhanVien.deleteMany({});
        return resutl.deleteCount;
    }
}

module.exports = KhachHangService;