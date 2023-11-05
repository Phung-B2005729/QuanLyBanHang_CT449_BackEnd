// nhap them sua xoa
// truy xuat id 
const { ObjectId } = require("mongodb");
class HinhAnhService {
    constructor(client){
        this.collentionHinhAnh = client.db().collection("hinhanh");
    }
    extractHinhAnhData(payload){
        // lay du lieu doi tuong KhachHang va loai bo cac thuoc tinh undefined
        const hinhanh = {
            linkanh: payload.linkanh,
            idhanghoa: payload.idhanghoa
        }
        Object.keys(hinhanh).forEach((key)=>{
            if (hinhanh[key] === undefined || hinhanh[key] === null) {
                hinhanh[key] = '';
            }
        });
        return hinhanh;
    }
    // thêm
    async create(payload){  
        const hinhanh = await this.extractHinhAnhData(payload); 
        console.log("hinhanh " +hinhanh);
        try {
         const ketqua = await this.collentionHinhAnh.insertOne(hinhanh);
         console.log('Insert thành công');
         return ketqua;
        }
        catch(err){
            console.log("Lỗi khi thêm " , err);
            throw err;
        }

    }
    async find(filter){  // tìm link ảnh theo sản phẩm  thì đưa vào id sản phẩm
        const cursor = await this.collentionHinhAnh.find(filter);
        return await cursor.toArray();
    }
    async findById(id){  // lấy ảnh theo id ảnh
        console.log("goi ham findById " +id);
        return await this.collentionHinhAnh.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
            // kiểm tra _id hợp lệ 
        });
    }
    async findByName(linkanh){
        return await this.find({
            linkanh: {
                $regex: new RegExp(linkanh), $options: "i"
            }
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractHinhAnhData(payload);
        console.log(update);
        const result = await this.collentionHinhAnh.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.collentionHinhAnh.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }
}
module.exports = HinhAnhService;