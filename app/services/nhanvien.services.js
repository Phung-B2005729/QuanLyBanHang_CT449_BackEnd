const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
class NhanVienService {
    constructor(client){
        this.collectionNhanVien = client.db().collection("nhanvien");
    }
    extractNhanVienData(payload){
        
        // lay du lieu doi tuong nhanVien va loai bo cac thuoc tinh undefined
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
        return nhanVien;
    }
    extractNhanVienDataUpdate(payload){
        
        // lay du lieu doi tuong nhanVien va loai bo cac thuoc tinh undefined
        const nhanVien = {
            hoten: payload.hoten,
            sdt: payload.sdt,
            password: payload.password,
            diachi : payload.diachi ?? '',
            chucvu: payload.chucvu
        }
        Object.keys(nhanVien).forEach((key)=>{
            nhanVien[key] === undefined && delete nhanVien[key]
        });
        return nhanVien;
    }
    async create(payload){
        const nhanVien =  this.extractNhanVienData(payload);
        nhanVien.password =  jwt.sign("", nhanVien.password);
        console.log("nhanvien " +nhanVien);
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
    async findByName(hoten){
        return await this.find({
            hoten: {
                $regex: new RegExp(hoten), $options: "i"
            }
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractNhanVienDataUpdate(payload);
        console.log(update);
        const result = await this.collectionNhanVien.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionNhanVien.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }

    async deleteAll(){
        const resutl = await this.collectionNhanVien.deleteMany({});
        return resutl.deleteCount;
    }

}

module.exports = NhanVienService;