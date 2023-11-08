const ApiError = require("../api-error");
const GioHangService = require("../services/giohang.services");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if(!req.body?.idkhachhang){
    return next(new ApiError(400,"Name can not be empty"));
  }
 // console.log("body "+ req.body);

  try{
    const gioHangService = new GioHangService(MongoDB.client);
    console.log(req.body);
    const exsitsanpham = await gioHangService.findOne({
        idkhachhang: req.body.idkhachhang,
        idhanghoa: req.body.idhanghoa
    });  
    console.log("ton tai"+ exsitsanpham);
    if(exsitsanpham){
       // gọi update
       req.body.soluong = await req.body.soluong +  exsitsanpham.soluong;
       const document = await gioHangService.createupdate(req.body.idkhachhang,req.body.idhanghoa, req.body);
       console.log(document);
        return res.send(document);

    }
    else{
        const document = await gioHangService.create(req.body);
        console.log(document);
        return res.send(document);
    }
    
  }catch(err){
    return next(new ApiError(500, "Lỗi server"));
  }
};
exports.findALLByIdKhachHangVaIdSanPham = async (req,res, next) => {
   try{
    const gioHangService = new GioHangService(MongoDB.client);
   const document = await gioHangService.findOne({
        idkhachhang: req.params.idkhachhang,
        idhanghoa: req.params.idhanghoa,
    });
    return res.send(document);
 
   }catch(error){
    return next(new ApiError(500, `Lỗi server hàng hoá giỏ hàng with id=${req.params.idkhachhang} và ${req.params.idhanghoa}`));
   }
   
};
exports.findALLByIdSanPham = async (req,res, next) => {
    let document = [];
   try{
    const gioHangService = new GioHangService(MongoDB.client);
    document = await gioHangService.find({
        idhanghoa: req.params.idhanghoa,
    });
 
   }catch(error){
    return next(new ApiError(500, `Lỗi server hàng hoá giỏ hàng with id= ${req.params.idhanghoa}`));
   }
   return res.send(document);
};

exports.findALLByIdKhachHang = async (req,res, next) => {
    let document = [];
   try{
    const gioHangService = new GioHangService(MongoDB.client);
    document = await gioHangService.find({
        idkhachhang: req.params.id
    });
 
   }catch(error){
    return next(new ApiError(500, `Lỗi server hàng hoá giỏ hàng with id=${req.params.id}`));
   }
   return res.send(document);
};

exports.update = async (req,res, next) => {
   if(Object.keys(req.body).length == 0){
    return next(new ApiError(400,"Data to update can not be empty"));
   }
   try{
    const gioHangService = new GioHangService(MongoDB.client);
    console.log("goi ham update " + req.params.id + " " + req.body);
    const document = await gioHangService.update(req.params.id, req.body);
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
        const gioHangService = new GioHangService(MongoDB.client);
       
        const document = await gioHangService.delete(req.params.id);
       
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

exports.deleteAllGioHangKhachHang = async (req, res, next) => {
    console.log('goi ham delete');
   try {
    const gioHangService = new GioHangService(MongoDB.client);

    const deleteCount = await gioHangService.deleteALLGioHangKhachHang(req.params.id);
    console.log('documentConut ' + deleteCount);
    return res.send({
        message: `${deleteCount} deleted successfully`
    });
   } catch(err){
    return next(new ApiError(500,"Lỗi server"))
   }
};
