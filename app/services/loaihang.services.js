// nhap them sua xoa
// truy xuat id 
const { ObjectId } = require("mongodb");
class LoaiHangService {
    constructor(client){
        this.collectionLoaiHang = client.db().collection("loaihang");
    }
    extractLoaiHangData(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const loaihang = {
            tenloai: payload.tenloai
        }
        Object.keys(loaihang).forEach((key)=>{
            if (loaihang[key] === undefined || loaihang[key] === null) {
                loaihang[key] = '';
            }
        });
        return loaihang;
    }
    async create(payload){   
        const loaihang = this.extractLoaiHangData(payload);
        console.log("loaihang " +loaihang.tenloai);

        try {
         const ketqua = await this.collectionLoaiHang.insertOne(loaihang);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }

    }
    async find(filter){ // danh sách loại hàng 
        const cursor = await this.collectionLoaiHang.find(filter);
        return await cursor.toArray();
    }
    async findById(id){ // tên loại hàng theo id 
        console.log("goi ham findById " +id);
        return await this.collectionLoaiHang.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    async findOne(filter){ // danh sách loại hàng 
       return await this.collectionLoaiHang.findOne(filter);
    }
    async findByName(tenloai){
        return await this.find({
            tenloai: {
                $regex: new RegExp(tenloai), $options: "i"
            }
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractLoaiHangData(payload);
        console.log(update);
        const result = await this.collectionLoaiHang.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionLoaiHang.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }
}
module.exports = LoaiHangService;