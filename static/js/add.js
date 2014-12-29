;$(function() {
  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function() {
      var last = new Date().getTime() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = new Date().getTime();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  function sameScroll() {
    var top = $(this).scrollTop();
    var rate = top / $(this)[0].scrollHeight;
    var ptop = $('#preview').height() * rate;
    $('#preview').parent().animate({scrollTop: ptop}, 10);
  }

  $('.full-edit-col').height($(window).height()-40);
  $(window).on('resize', function() {
    $('.full-edit-col').height($(window).height()-40);
  })

  $('#markdown-text-shadow')
    .on('keyup', function() {
      var val = $(this).val();
      $('#preview').html(markdown.toHTML(val));
    })
    .trigger('keyup')
    .on('scroll', debounce(sameScroll, 5))

  $('body')
    .on('click', '.btn-fullscreen', function(e) {
      e.preventDefault();
      var val = $('#markdown-text').val();
      $('.fullscreen-mask').removeClass('hide');
      $('body').addClass('noscroll');
      $('#markdown-text-shadow').val(val).trigger('keyup').focus();
    })
    .on('click', '.btn-full-exit', function(e) {
      e.preventDefault();
      var val = $('#markdown-text-shadow').val();
      $('#markdown-text').val(val);
      $('.fullscreen-mask').addClass('hide');
      $('body').removeClass('noscroll');
    })

  $.fn.bindEditBtn = function(ele, start_syntax, end_syntax, default_text) {
    var textarea = $(this);

    $('body').on('click', ele, function() {
      var start = textarea[0].selectionStart;
      var end = textarea[0].selectionEnd;
      var text = textarea.val();
      var start_length = start_syntax.length;
      default_text ? default_text : default_text = "添加文字"

      if (start == end) {
        textarea.val(text.substring(0,start) + start_syntax + default_text + end_syntax + text.substring(end, text.lenght));
        end = start + 4;
      } else {
        textarea.val(text.substring(0,start) + start_syntax + text.substring(start, end) + end_syntax + text.substring(end,text.lenght));
      }

      selectText(textarea[0], start+start_length, end + start_length);
      textarea.trigger('keyup');
    })

    return this;
  }

  $('#markdown-text-shadow')
    .bindEditBtn('.btn-edit-bold', '**', '**')
    .bindEditBtn('.btn-edit-italic', '*', '*')
    .bindEditBtn('.btn-edit-list', '- ', '')
    .bindEditBtn('.btn-edit-list-order', '1. ', '')
    .bindEditBtn('.btn-edit-link', '[', '](http://example.com)', '链接文字')

  function selectText(input, start, end) {
    if(input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(start, end);
    } else if(input.createTextRange) {
        var range = input.createTextRange();
        input.collapse(true);
        input.moveEnd('character', end);
        input.moveStart('character', start);
        input.select();
    }
  }

  // img=========================================================
  var img = document.getElementById("img-preview");
  var img_preview = $('.img-preview');
  var imgbtn = $('.img-btn');
  var pop = $('.image-pop');
  var prompt = $('.img-prompt');
  var occupy = $('.img-occupy');

  $('.btn-edit-image').click(function() {
    if(pop.is(":hidden")) {
      pop.show(100);
    } else {
      pop.hide(100);
    }

    // init
    prompt.html('');
    imgbtn.hide(100);
    $('.uploadimg').val('');
    $('body').off("click", ".img-btn");
    img.src = '';
    img_preview.hide();
    occupy.show();
    // init end
  });

  $('.img-close').click(function() {
    pop.hide(100);
  });

  $('.uploadimg').change(function() {
    if(!$(this).val().match( /.jpg|.jpeg|.gif|.png/i )){
      prompt.html('图片格式无效!只接受jpg,jpeg,gif,png格式');
      $('.uploadimg').val('');
      return false;
    } else {
      prompt.html('');
    }
  });

  $('.uploadimg').ajaxfileupload({
    'action': '/j/upload',
    'onComplete': function(response) {
      imgbtn.show();
      occupy.hide();
      img_preview.show();
      img.src = $.parseJSON($(response).html()).url;
      $('body').off("click", ".img-btn");
      $('#markdown-text-shadow').bindEditBtn('.img-btn', '![', ']('+img.src+')', '图片描述');
    }
  });

  //$('.datepicker').datepicker()
});
