// nhap them sua xoa
// truy xuat id 
const { ObjectId } = require("mongodb");
class GioHangService {
    constructor(client){
        this.collectionGioHang = client.db().collection("giohang");
    }
    extractgiohangData(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const giohang = {
            idkhachhang: payload.idkhachhang,
            idhanghoa: payload.idhanghoa,
            soluong: payload.soluong,
            gia: payload.gia
        }
        Object.keys(giohang).forEach((key)=>{
            if (giohang[key] === undefined || giohang[key] === null) {
                giohang[key] = '';
            }
        });
        return giohang;
    }
    async create(payload){   
        const giohang = this.extractgiohangData(payload);
        try {
         const ketqua = await this.collectionGioHang.insertOne(giohang);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }

    }
    async find(filter){ // danh sách sp gio hàng 
        const cursor = await this.collectionGioHang.find(filter);
        return await cursor.toArray();
    }
   // có 2 khoá chính
    async findOne(filter){ // danh sách 1 sp trong giỏ hàng
       return await this.collectionGioHang.findOne(filter);
    }

    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractgiohangData(payload);
        console.log(update);
        const result = await this.collectionGioHang.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionGioHang.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }

    async createupdate(idkhachhang, idhanghoa, payload){
        const filter = {
            idkhachhang: idkhachhang,
            idhanghoa: idhanghoa
        };
        console.log('carete update');
        console.log("fileder" + filter);
        const update = this.extractgiohangData(payload);
        console.log(update);
        const result = await this.collectionGioHang.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    
    async deleteALLGioHangKhachHang(idkhachhang){
        console.log('goi ham delete conver  ' + idkhachhang);
        const filter = { idkhachhang: idKhachhang };
       const result = await this.collectionGioHang.deleteMany(filter);
       console.log("resu " +result);
       return result;
    }
    
}
module.exports = GioHangService;