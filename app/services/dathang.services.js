const { ObjectId } = require("mongodb");
class DatHangService {
    constructor(client){
        this.collectionDatHang = client.db().collection("dathang");
    }
    extractDatHangData(payload){
        
        // lay du lieu doi tuong datHang va loai bo cac thuoc tinh undefined
        const datHang = {
            ngaydat: payload.ngaydat,
            ngaygiao: payload.ngaygiao,
            diachigiao: payload.diachigiao,
            phigiao: payload.phigiao,
            phigiamgia: payload.phigiamgia,
            tinhtrang : payload.tinhtrang ?? 'Chờ xác nhân',
            phuongthucthanhtoan: payload.phươngthucthanhtoan ?? 'Thanh toán khi nhận hàng',
            tongtien: payload.tongtien,
            idkhachhang: payload.idkhachhang,
            idnhanvien: payload.idnhanvien
        }
        Object.keys(datHang).forEach((key)=>{
            if (datHang[key] === undefined || datHang[key] === null) {
                datHang[key] = '';
            }
        });
        return datHang;
    }
    extractDatHangDataUpdate(payload){
        
        // lay du lieu doi tuong datHang va loai bo cac thuoc tinh undefined
        const datHang = {
            ngaydat: payload.ngaydat,
            ngaygiao: payload.ngaygiao,
            diachigiao: payload.diachigiao,
            phigiao: payload.phigiao,
            phigiamgia: payload.phigiamgia,
            tinhtrang : payload.tinhtrang ,
            phuongthucthanhtoan: payload.phươngthucthanhtoan,
            tongtien: payload.tongtien,
            idkhachhang: payload.idkhachhang,
            idnhanvien: payload.idnhanvien
        }
        Object.keys(datHang).forEach((key)=>{
            datHang[key] === undefined && delete datHang[key]
        });
        return datHang;
    }
    async create(payload){
        const datHang =  this.extractDatHangData(payload);
        console.log("datHang " +datHang.ngaydat);
        try {
         const ketqua = await this.collectionDatHang.insertOne(datHang);
         console.log('Insert thành công');
         console.log(ketqua);
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }
    }
    async find(filter){
        const cursor = await this.collectionDatHang.find(filter);
        return await cursor.toArray();
    }
    async findById(id){
        console.log("goi ham findById " +id);
        return await this.collectionDatHang.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    async findOne(filter){
        return await this.collectionDatHang.findOne(filter);
        
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractDatHangDataUpdate(payload);
        console.log(update);
        const result = await this.collectionDatHang.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionDatHang.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }
    async deleteAll(){
        const resutl = await this.collectionDatHang.deleteMany({});
        return resutl.deleteCount;
    }
    async deleteByIdKhachHang(id){
        const filter = { idkhachhang: id };
        const result = await this.collectionDatHang.deleteMany(filter);
        return result;
       }
    async deleteByIdNhanVien(id){
        const filter = { idnhanvien: id };
        const result = await this.collectionDatHang.deleteMany(filter);
        return result;
       }

}

module.exports = DatHangService;