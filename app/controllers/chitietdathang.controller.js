const ApiError = require("../api-error");
const ChiTietDatHangService = require("../services/chitietdathang.services");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if(!req.body?.iddathang){
    return next(new ApiError(400,"Name can not be empty"));
  }
 // console.log("body "+ req.body);

  try{
    const chiTietDatHangService = new ChiTietDatHangService(MongoDB.client);
    console.log(req.body);
        const document = await chiTietDatHangService.create(req.body);
        console.log(document);
        return res.send(document);
  }catch(err){
    return next(new ApiError(500, "Lỗi server"));
  }
};


exports.findALLByiddathang = async (req,res, next) => {
    let document = [];
   try{
    const chiTietDatHangService = new ChiTietDatHangService(MongoDB.client);
    document = await chiTietDatHangService.find({
        iddathang: req.params.id
    });
 
   }catch(error){
    return next(new ApiError(500, `Lỗi server hàng hoá giỏ hàng with id=${req.params.id}`));
   }
   return res.send(document);
};

exports.deleteAllChiTietDatHangIdDatHang = async (req, res, next) => {
    console.log('goi ham delete');
   try {
    const chiTietDatHangService = new ChiTietDatHangService(MongoDB.client);

    const deleteCount = await chiTietDatHangService.deleteALLChiTietDatHang(req.params.id);
    console.log('documentConut ' + deleteCount);
    return res.send({
        message: `${deleteCount} deleted successfully`
    });
   } catch(err){
    return next(new ApiError(500,"Lỗi server"))
   }
};
