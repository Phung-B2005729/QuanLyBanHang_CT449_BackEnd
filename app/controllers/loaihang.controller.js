const ApiError = require("../api-error");
const LoaiHangService = require("../services/loaihang.services");
const MongoDB = require("../utils/mongodb.util");
const jwt = require('jsonwebtoken');


exports.create = async (req, res, next) => {
    if(req.body.tenloai==null){
        return next(new ApiError(400, "Data can not be empty"));
    }
    else{
        try{
          const loaiHangService = new LoaiHangService(MongoDB.client);
          const exitLoaiHang = await loaiHangService.findOne({tenloai: req.body.tenloai});
          if(exitLoaiHang){
            // đã tồn tại thì không thêm vào mà trả về loaihang nay;
           /* return res.send({
                message: 'Loại hàng đã tồn tại',
                newloaihang: exitLoaiHang
              });  */
              return next(new ApiError(404, "Loại hàng đã tồn tại"));
          }
          console.log(exitLoaiHang)
         
            const newLoaiHang = await loaiHangService.create(req.body);
            return res.send({
                message: 'Đã thêm mới',
                newloaihang: newLoaiHang
              }); 

          
        }catch(e){
            return next(new ApiError(500, "Lỗi server trong quá trình thêm một loại hàng"));
        }
    }
}
exports.findALL = async (req, res, next) => {
    let listLoaiHang = []
    try{
        const loaiHangService = new LoaiHangService(MongoDB.client);
        const { tenloai } = req.query;
        if(tenloai){
            listLoaiHang = await loaiHangService.findByName(tenloai);
        }
        else{
            listLoaiHang = await loaiHangService.find({});
        }  
    }catch(e){
        return next(new ApiError(500, "Lỗi server trong quá trình lấy danh sách loại hàng"));
    }
    return res.send(listLoaiHang);

}

exports.findOne =  async (req, res, next) => {  // lấy tên loại hàng theo id
    try{
        const loaiHangService = new LoaiHangService(MongoDB.client);
        const document = await loaiHangService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Không tìm thấy loại hàng"));
        }
        return res.send(document);
    }catch(e){
        return next(new ApiError(500, "Lỗi server trong quá trình lấy danh sách loại hàng"));
    }
}
exports.update = async (req,res, next) => {
    if(Object.keys(req.body).length == 0){
     return next(new ApiError(400,"Data to update can not be empty"));
    }
    try{
     const loaiHangService = new LoaiHangService(MongoDB.client);
     console.log("goi ham update " + req.params.id + " " + req.body);
     const document = await loaiHangService.update(req.params.id, req.body);
     if(!document){
         return next(new ApiError(404,"Contact not found"));
     }
     return res.send({
         message: "updated successfully"
     });
    }catch(err){
     return next(new ApiError(500, `Lỗi server update contact with id=${req.params.id}`));
    }
 };
 
 exports.delete = async (req,res, next) => {
   
     try{
         const loaiHangService = new LoaiHangService(MongoDB.client);
        
         const document = await loaiHangService.delete(req.params.id);
        
         if(!document){
             return next(new ApiError(404, "Contact not found"));
         }
         return res.send({
             message: " deleted succesfully"
         });
     }catch(err){
         return next(new ApiError(500, `Could not delete with id=${req.params.id}`));
     }
 }


