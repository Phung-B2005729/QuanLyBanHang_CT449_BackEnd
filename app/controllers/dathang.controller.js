const ApiError = require("../api-error");
const DatHangService = require("../services/dathang.services");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if(!req.body?.idkhachhang){
    return next(new ApiError(400,"idkhachhang can not be empty"));
  }
 // console.log("body "+ req.body);

  try{
    const datHangService = new DatHangService(MongoDB.client);
    console.log(req.body);
    const document = await datHangService.create(req.body);
    console.log(document);
    return res.send(document);
  }catch(err){
    return next(new ApiError(500, "Lỗi server"));
  }
};

exports.findAll = async (req,res, next) => {
   let document = [];
   try{
    const datHangService = new DatHangService(MongoDB.client);
    const { idkhachhang } = req.query;
   
   if(idkhachhang){
     document = await DatHangService.find({
        idkhachhang: idkhachhang
     });
   }
   else{
    document = await datHangService.find({});
   }
}catch(err){
    return next(
        new ApiError(500, "Lỗi server")
    );
}
return res.send(document);
};

exports.findOne = async (req,res, next) => {
   try{
    const datHangService = new DatHangService(MongoDB.client);
    const document = await datHangService.findById(req.params.id);
    if(!document){
        return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
   }catch(error){
    return next(new ApiError(500, `Lỗi server hàng hoá with id=${req.params.id}`));
   }
};

exports.update = async (req,res, next) => {
   if(Object.keys(req.body).length == 0){
    return next(new ApiError(400,"Data to update can not be empty"));
   }
   try{
    const datHangService = new DatHangService(MongoDB.client);
    console.log("goi ham update " + req.params.id + " " + req.body);
    const document = await datHangService.update(req.params.id, req.body);
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
        const datHangService = new DatHangService(MongoDB.client);
       
        const document = await datHangService.delete(req.params.id);
       
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

exports.findAllIdKhacHang = async (req,res, next) => {
    let document = []
    try {
        const datHangService = new DatHangService(MongoDB.client);
         document = await datHangService.find({
            idkhachhang: req.params.idkhachhang
        });
        
    }catch(err){
        return next(new ApiError(500, "Lỗi server"));
    }
    return res.send(document);
}

exports.deleteAll = async (_req, res, next) => {
    console.log('goi ham delete');
   try {
    const datHangService = new DatHangService(MongoDB.client);
    const deleteCount = await datHangService.deleteAll();
    console.log('documentConut ' + deleteCount);
    return res.send({
        message: `${deleteCount} deleted successfully`
    });
   } catch(err){
    return next(new ApiError(500,"Lỗi server"))
   }
};
