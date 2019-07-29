var pj=require('./project');


function create_mk_temp(){

  var _pj=new pj()
    _pj.create();

}

exports.mk_temp=create_mk_temp;
