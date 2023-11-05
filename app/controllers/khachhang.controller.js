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
   // const { name } = req.query;
    
   // if(name){
   //   document = await contactService.findByName(name);
   // }
    //else{
     document = await khachHangService.find({});
    //}
 }catch(err){
     return next(
         new ApiError(500, "An error occured while retrieving contacts")
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
          hoten: document.hoten, // lưu tên người dùng
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
    if(req.session.user){
    req.session.user = null;
    return res.send({
      message: "Logout successfully"
    });
  }
  else{
    return next(new ApiError(404, "Logout failed"))
  }
    
  
  }catch(e){
    return next(new ApiError(500, "Lỗi server"));
  }

 }