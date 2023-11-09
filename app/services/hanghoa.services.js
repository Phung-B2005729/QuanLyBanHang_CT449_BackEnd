const { ObjectId } = require("mongodb");
class HangHoaService {
    constructor(client){
        this.collectionHangHoa = client.db().collection("hanghoa");
    }
    extractHangHoaData(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const hangHoa = {
            tenhh: payload.tenhh,
            mota: payload.mota, // trọng lượng, hướng dẫn sử dụng ...
            gia: payload.gia,
            soluong : payload.soluong ?? 0, // số lượng trong kho
            phankhuc: payload.phankhuc, // meo lon, meo nho, cho lon, cho nho
            thuonghieu: payload.thuonghieu,
            ghichu: payload.ghichu,
            hansudung: payload.hansudung, // ngày hết hạn
            ngaysanxuat: payload.ngaysanxuat,  // ngày sản xuất
           // idanh: payload.idanh, idhh lm khoa ngoai cho ban anh
            idloai: payload.idloai,
        }
        Object.keys(hangHoa).forEach((key)=>{
            if (hangHoa[key] === undefined || hangHoa[key] === null) {
                hangHoa[key] = '';
            }
        });
        console.log(hangHoa);
        return hangHoa;
    }
    extractHangHoaDataUpdate(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const hangHoa = {
            tenhh: payload.tenhh,
            mota: payload.mota, // trọng lượng, hướng dẫn sử dụng ...
            gia: payload.gia,
            soluong : payload.soluong, // số lượng trong kho
            thuonghieu: payload.thuonghieu,
            ghichu: payload.ghichu,
            hansudung: payload.hansudung, // ngày hết hạn
            ngaysanxuat: payload.ngaysanxuat,  // ngày sản xuất
           // idanh: payload.idanh, idhh lm khoa ngoai cho ban anh
            idloai: payload.idloai,
        }
        Object.keys(hangHoa).forEach((key)=>{
            hangHoa[key] === undefined && delete hangHoa[key]
        });
        console.log(hangHoa);
        return hangHoa;
    }
    async create(payload){
        const hangHoa = await this.extractHangHoaData(payload);
        console.log(hangHoa);
        try {
         const ketqua = await this.collectionHangHoa.insertOne(hangHoa);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }

    }
    async find(filter){
        const cursor = await this.collectionHangHoa.find(filter);
        return await cursor.toArray();
    }
    async findById(id){
        console.log("goi ham findById " +id);
        return await this.collectionHangHoa.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    // lay 1 san pham
    async findOne(filter){
        return await this.collectionHangHoa.findOne(filter);
        
    }
    async findByName(tenhh){
        return await this.find({
            tenhh: {
                $regex: new RegExp(tenhh), $options: "i"
            }
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractHangHoaDataUpdate(payload);
        console.log(update);
        const result = await this.collectionHangHoa.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collectionHangHoa.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }
    async findByLoaiHang (idloaihang) {
        return await this.find({
          idloai: idloaihang
        })
    }
    async deleteAll(){
        const resutl = await this.collectionHangHoa.deleteMany({});
        return resutl.deleteCount;
    }
        /*
        cong ngay tinh toan xe ngay ht han
        const moment = require('moment'); // Đối với Node.js
        // Hoặc: import moment from 'moment'; // Đối với Vue.js
        // Ngày gốc
        const ngayGoc = moment('2023-10-26');

        // Tính ngày sau 10 tháng
        const ngaySau10Thang = ngayGoc.add(10, 'months');
        console.log(ngaySau10Thang.format('YYYY-MM-DD')); // Định dạng ngày kết quả
        */
}
module.exports = HangHoaService;