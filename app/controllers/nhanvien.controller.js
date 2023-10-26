const ApiError = require("../api-error");
const NhanVienService = require("../services/nhanvien.services");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
      if(!req.body.sdt && !req.body.password && !req.body.hoten){
        return next(new ApiError(400, "Data can not be empty"));
      }
      try{
        console.log('Insert controller');
        const nhanVienService = new NhanVienService(MongoDB.client);
        const existingSdt = await hanVienService.findOne({sdt : req.body.sdt});
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
   // const { name } = req.query;
    
   // if(name){
   //   document = await contactService.findByName(name);
   // }
    //else{
     document = await nhanVienService.find({});
    //}
 }catch(err){
     return next(
         new ApiError(500, "An error occured while retrieving contacts")
     );
 }
 return res.send(document);
 };

 // login // logout
 exports.login = async (req, res, next) => {
    console.log('Gọi login');
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        console.log('Gọi login');
       // var pass = await jwt.sign("", req.body.password);
        console.log(pass);
        const document = await nhanVienService.findOne({sdt : req.body.sdt, password: req.body.password});
        console.log(document);
        if(!document){
            return next(new ApiError(404, "Login failed"))
        }
        console.log(document);
        req.session.admin = {
            id: document._id, // Ví dụ: lưu ID của người dùng
            hoten: document.hoten,
            chuvu: document.chuvu // Ví dụ: lưu tên người dùng
          };
          console.log(req.session.user);
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
    if(req.session.admin){
    req.session.admin = null;
    
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

