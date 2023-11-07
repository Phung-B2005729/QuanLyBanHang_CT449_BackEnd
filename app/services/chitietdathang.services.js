// nhap them sua xoa
// truy xuat id 
const { ObjectId } = require("mongodb");
class ChiTietDatHangService {
    constructor(client){
        this.collectionchitietdathang = client.db().collection("chitietdathang");
    }
    extractchitietdathangData(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const chitietdathang = {
            iddathang: payload.iddathang,
            idhanghoa: payload.idhanghoa,
            soluong: payload.soluong,
            gia: payload.gia,
            giagiam: payload.giagiam
        }
        Object.keys(chitietdathang).forEach((key)=>{
            if (chitietdathang[key] === undefined || chitietdathang[key] === null) {
                chitietdathang[key] = '';
            }
        });
        return chitietdathang;
    }
    async create(payload){   
        const chitietdathang = this.extractchitietdathangData(payload);
        try {
         const ketqua = await this.collectionchitietdathang.insertOne(chitietdathang);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }

    }
    async find(filter){ // danh sách sp dat hang
        const cursor = await this.collectionchitietdathang.find(filter);
        return await cursor.toArray();
    }
   // có 2 khoá chính
    async findOne(filter){ // danh sách 1 sp trong dat hang
       return await this.collectionchitietdathang.findOne(filter);
    }
    
    async deleteALLChiTietDatHang(iddathang){ // theo id dang hang
        console.log('goi ham delete conver  ' + iddathang);
        const filter = { iddathang: iddathang };
       const result = await this.collectionchitietdathang.deleteMany(filter);
       console.log("resu " +result);
       return result;
    }
    
}
module.exports = ChiTietDatHangService;