;$(function() {
  var search = $('.form-control');
  var item = $('.product-wrapper');
  var addbtn = $('.add-btn');
  var btn_revise = $('.btn-revise');
  var btn_del = $('.btn-del');
  var form_revise = $('.form-revise');

  //搜索
  search.keyup(function(){

    for(var i = 0; i < item.length; i++) {
      var mytitle = $($(item[i]).find('.item-content')[0]).html();
      console.log(mytitle)
      var search_value =  search.val();
      if(mytitle.indexOf(search_value) == -1) {
        $(item[i]).slideUp('100');
      } else {
        $(item[i]).slideDown('100');
      }
    }
  });

  //修改
  btn_revise.click(function() {
    var myform = $(this).parents('.product-wrapper').find('.form-revise');
    myform.slideDown();
    var items = $(this).parents('.product-wrapper').find('.content-item');
    initform(items, myform);
  })

  btn_del.click(function() {
    var id = $(this).attr('id');
    var base = $('.add-btn').attr('id');
    var my_item = $(this).parents('.product-wrapper');
    $.ajax({
      url: '/j/product/'+base+'/'+id+'/delete',
      type: 'POST',
      dataType: 'json'
    }).done(function(c) {
      if(c.r) {
        my_item.slideUp();
      } else {
        alert('fail')
      }
    });
  });

  function initform(items, myform) {
    myform.find('.form-group').remove();
    for(var i = (items.length - 1); i >= 0; i--) {
      var title = $(items[i]).find('.item-title').html();
      var content = $(items[i]).find('.item-content').html();
      myform.prepend('<div class="form-group clearfix"><label>'+title+'</label><input type="text" class="form-control" placeholder="'+content+'"></div>');
    }
  }

  var kind_select = $('.product-kinds select');
  var p2p_items = ['产品名称', '产品类型', '发行机构', '预期年化收益率', '返还方式', '投资期限', '购买起点', '保障', '推荐理由', '购买链接', '电话号码']
  var bank_items = ['产品名称', '产品类型', '风险等级', '预期年化收益率', '起购金额', '期限', '起息日-到期日', '推荐理由', '推荐指数', '点击购买', '电话号码']
  var fund_items = ['基金名称', '产品类型', '发行机构', '基金代码', '成立日期', '跟踪指数', '风险', '基金经理', '近一年涨幅', '别名', '推荐理由', '购买链接', '电话号码']
  var debt_items = ['产品名称', '产品类型', '风险等级', '利率', '期限', '起购金额', '付息方式', '推荐理由', '推荐指数', '点击购买', '电话号码']
  var insurance_items = ['产品名称', '产品类型', '发行机构', '保险期间', '缴费期限', '保险责任', '适合人群', '保费预估', '推荐理由', '购买链接', '电话号码']

  function editor_init(kind) {
    var form_items = $('.editor-form .input-group');
    form_items.show();
    for (var i = form_items.length - 1; i >= 0; i--) {
      var item_name = $(form_items[i]).find('.input-group-addon').html();
      console.log(item_name)
      if(kind.indexOf(item_name) == -1){
        $(form_items[i]).hide();
      }
    };
  }
});
