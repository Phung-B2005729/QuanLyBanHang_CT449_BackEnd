const ApiError = require("../api-error");
const KhachHangService = require("../services/khachhang.services");
const MongoDB = require("../utils/mongodb.util");
const jwt = require('jsonwebtoken');

exports.create = async (req, res, next) => {
      if(!req.body.sdt && !req.body.password && !req.body.hoten){
        return next(new ApiError(400, "Data can not be empty"));
      }
      try{
        console.log('Insert controller');
        const khachHangService = new KhachHangService(MongoDB.client);
        const existingSdt = await khachHangService.findOne({sdt : req.body.sdt});
        console.log(existingSdt);
        if (existingSdt) {
            return next(new ApiError(404, "Số điện thoại đã được sử dụng."));
          }
       
        const document = await khachHangService.create(req.body);
        return res.send({
          message: 'Tạo user thành công',
          newuser: document
        }); 
      }catch(e){
        return next(new ApiError(500, "An error ocurred while creating the account"));
      }
    }


exports.findAll = async (req,res, next) => {
    let document = [];
    try{
    const khachHangService = new KhachHangService(MongoDB.client);
   const { hoten } = req.query;
    
    if(hoten){
      document = await khachHangService.findByhoten(hoten);
   }
    else{
     document = await khachHangService.find({});
    }
 }catch(err){
     return next(
         new ApiError(500, "An error occured while retrieving s")
     );
 }
 return res.send(document);
 };


 // login logout
 exports.login = async (req, res, next) => {
  console.log('Gọi login');
  try {
      const khachHangService = new KhachHangService(MongoDB.client);
      console.log('Gọi login');
      var pass = await jwt.sign("", req.body.password);
      console.log(pass);
      const document = await khachHangService.findOne({sdt : req.body.sdt, password: pass});
      console.log(document);
      if(!document){
          return next(new ApiError(404, "Login failed"))
      }
      console.log(document);
      // luu session
      req.session.user = {
          id: document._id, //  lưu ID của người dùng
        };
        console.log(req.session.user);
        return res.send({
          message: "Login successfully",
          token: req.session.user
      });
    }catch(error){
      return next(new ApiError(500, "Lỗi server"));
     }
  
}
 exports.logout = async (req, res, next) => {
  console.log('Gọi logout');
  try {
   
    req.session.user = null;
    return res.send({
      message: "Logout successfully",
      token: req.session.user
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
     const khachHangService = new KhachHangService(MongoDB.client);
     console.log("goi ham update " + req.params.id + " " + req.body);
     const document = await khachHangService.update(req.params.id, req.body);
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
         const khachHangService = new KhachHangService(MongoDB.client);
        
         const document = await khachHangService.delete(req.params.id);
        
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
   const khachHangService = new KhachHangService(MongoDB.client);
   const document = await khachHangService.findById(req.params.id);
   if(!document){
       return next(new ApiError(404, " not found"));
   }
   return res.send(document);
  }catch(error){
   return next(new ApiError(500, `Lỗi server hàng hoá with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  console.log('goi ham delete');
try {
  const khachHangService = new KhachHangService(MongoDB.client);
  console.log(" " + khachHangService);
  const deleteCount = await khachHangService.deleteAll();
  console.log('documentConut ' + deleteCount);
  return res.send({
      message: `${deleteCount}  were deleted successfully`
  });
} catch(err){
  return next(new ApiError(500,"An error occurred while removing all s"))
}
};

