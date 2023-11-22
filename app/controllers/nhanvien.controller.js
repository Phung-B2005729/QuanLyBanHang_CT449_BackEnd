const ApiError = require("../api-error");
const NhanVienService = require("../services/nhanvien.services");
const MongoDB = require("../utils/mongodb.util");
const jwt = require('jsonwebtoken');
exports.create = async (req, res, next) => {
      if(!req.body.hoten && !req.body.sdt){
        return next(new ApiError(400, "Data can not be empty"));
      }
      try{
        console.log('Insert controller');
        const nhanVienService = new NhanVienService(MongoDB.client);
        const existingSdt = await nhanVienService.findOne({sdt : req.body.sdt});
        console.log(existingSdt);
        if (existingSdt) {
            return next(new ApiError(400, "Số điện thoại đã được sử dụng."));
          }
       
        const document = await nhanVienService.create(req.body);
        return res.send(document); 
      }catch(e){
        return next(new ApiError(500, "An error ocurred while creating the account"));
      }
    }


exports.findAll = async (req,res, next) => {
    let document = [];
    try{
    const nhanVienService = new NhanVienService(MongoDB.client);
   const { hoten } = req.query;
    
    if(hoten){
      document = await nhanVienService.findByName(hoten);
    }
    else{
     document = await nhanVienService.find({});
    }
 }catch(err){
     return next(
         new ApiError(500, "An error occured while retrieving s")
     );
 }
 return res.send(document);
 };

 // login // logout
 exports.login = async (req, res, next) => {
    console.log('Gọi login admin');
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        console.log('Gọi login');
        var pass = await jwt.sign("", req.body.password);
        console.log(pass);
        const document = await nhanVienService.findOne({sdt : req.body.sdt, password: pass});
        console.log(document);
        if(!document){
            return next(new ApiError(404, "Login failed"))
        }
        console.log(document);
        req.session.admin = {
            id: document._id, // Ví dụ: lưu ID của người dùng
            quyen: document.quyen // Ví dụ: lưu tên người dùng
          };
          console.log(req.session.admin);
          return res.send({
            message: "Login successfully",
            token: req.session.admin
        });
      }catch(error){
        return next(new ApiError(500, "Lỗi server"));
       }
    
}
exports.logout = async (req, res, next) => {
  console.log('Gọi logout');
  try {
   
    req.session.admin = null;
    
    return res.send({
      message: "Logout successfully"
    });
 
  }catch(e){
    return next(new ApiError(500, "Lỗi server"));
  }
}
exports.update = async (req,res, next) => {
    if(Object.keys(req.body).length == 0){
     return next(new ApiError(400,"Data to update can not be empty"));
    }
    try{
     const nhanVienService = new NhanVienService(MongoDB.client);
     console.log("goi ham update " + req.params.id + " " + req.body);
     const existingSdt = await nhanVienService.findOne({sdt : req.body.sdt});
     console.log(existingSdt);
     if (existingSdt && existingSdt._id!=req.params.id) {
         return next(new ApiError(403, "Số điện thoại đã được sử dụng ở một tài khoản khác"));
       }
     const document = await nhanVienService.update(req.params.id, req.body);
     if(!document){
         return next(new ApiError(404," not found"));
     }
     return res.send({
         message: "updated successfully"
     });
    }catch(err){
     return next(new ApiError(500, `Lỗi server update  with id=${req.params.id}`));
    }
 };

 exports.delete = async (req,res, next) => {
   
     try{
         const nhanVienService = new NhanVienService(MongoDB.client);
        
         const document = await nhanVienService.delete(req.params.id);
        
         if(!document){
             return next(new ApiError(404, " not found"));
         }
         return res.send({
             message: " deleted succesfully"
         });
     }catch(err){
         return next(new ApiError(500, `Could not delete with id=${req.params.id}`));
     }
 }

 exports.findOne = async (req,res, next) => {
  try{
   const nhanVienService = new NhanVienService(MongoDB.client);
   const document = await nhanVienService.findById(req.params.id);
   if(!document){
       return next(new ApiError(404, " not found"));
   }
   return res.send(document);
  }catch(error){
   return next(new ApiError(500, `Lỗi server hàng hoá with id=${req.params.id}`));
  }
 }
 exports.deleteAll = async (_req, res, next) => {
        console.log('goi ham delete');
      try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        console.log(" " + nhanVienService);
        const deleteCount = await nhanVienService.deleteAll();
        console.log('documentConut ' + deleteCount);
        return res.send({
            message: `${deleteCount}  were deleted successfully`
        });
      } catch(err){
        return next(new ApiError(500,"An error occurred while removing all s"))
      }
};


