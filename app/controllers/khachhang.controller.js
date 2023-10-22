const ApiError = require("../api-error");
const KhachHangService = require("../services/khachhang.services");
const MongoDB = require("../utils/mongodb.util");
const jwt = require('jsonwebtoken');

exports.create = async (req, res, next) => {
      if(!req.body.sdt && !req.body.password && !req.body.hoten){
        return next(new ApiError(400, "Data can not be empty"));
      }
      try{
        const khachHangService = new KhachHangService(MongoDB.client);
        const existingSdt = await khachHangService.findOne({sdt : req.body.sdt});
        if (existingSdt) {
            return next(new ApiError(400, "Số điện thoại đã được sử dụng."));
          }
       
        const document = await khachHangService.create(req.body);
        return res.send(document); 
      }catch(e){
        return next(new ApiError(500, "An error ocurred while creating the account"));
      }
    }

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
        req.session.user = {
            id: document._id, // Ví dụ: lưu ID của người dùng
            hoten: document.hoten, // Ví dụ: lưu tên người dùng
          };
          console.log(req.session.user);
          return res.send({
            message: "Login successfully",
            token: req.session.user.hoten
        });
      }catch(error){
        return next(new ApiError(500, "Lỗi server"));
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