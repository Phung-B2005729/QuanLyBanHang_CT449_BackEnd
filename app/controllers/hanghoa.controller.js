const ApiError = require("../api-error");
const HangHoaService = require("../services/hanghoa.services");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if(!req.body?.tenhh){
    return next(new ApiError(400,"Name can not be empty"));
  }
 // console.log("body "+ req.body);

  try{
    const hangHoaService = new HangHoaService(MongoDB.client);
    console.log(req.body);
    const document = await hangHoaService.create(req.body);
    console.log(document);
    return res.send(document);
  }catch(err){
    return next(new ApiError(500, "Lỗi server"));
  }
};

exports.findAll = async (req,res, next) => {
   let document = [];
   try{
    const hangHoaService = new HangHoaService(MongoDB.client);
    const { tenhh } = req.query;
   
   if(tenhh){
     document = await hangHoaService.findByName(tenhh);
   }
   else{
    document = await hangHoaService.find({});
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
    const hangHoaService = new HangHoaService(MongoDB.client);
    const document = await hangHoaService.findById(req.params.id);
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
    const hangHoaService = new HangHoaService(MongoDB.client);
    console.log("goi ham update " + req.params.id + " " + req.body);
    const document = await hangHoaService.update(req.params.id, req.body);
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
        const hangHoaService = new HangHoaService(MongoDB.client);
       
        const document = await hangHoaService.delete(req.params.id);
       
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

exports.findAllByLoaiHang = async (req,res, next) => {
    try {
        const hangHoaService = new HangHoaService(MongoDB.client);
        const document = await hangHoaService.findByLoaiHang(req.params.id);
        return res.send(document);
    }catch(err){
        return next(new ApiError(500, "Lỗi server"));
    }
}
exports.deleteAll = async (_req, res, next) => {
    console.log('goi ham delete');
   try {
    const hangHoaService = new HangHoaService(MongoDB.client);
    const deleteCount = await hangHoaService.deleteAll();
    console.log('documentConut ' + deleteCount);
    return res.send({
        message: `${deleteCount} deleted successfully`
    });
   } catch(err){
    return next(new ApiError(500,"Lỗi server"))
   }
};
