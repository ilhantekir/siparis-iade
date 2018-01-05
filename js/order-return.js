var returnModul = (function() {
    //variables
  var items = [];
  var $returnFormModul = $("#returnFormModul");
  var $returnCartModul = $("#returnCartModul");
  var $sendReturnFormBtn = $("#sendReturnForm");
  var $email = $("#email");
  var $orderID = $("#orderID");
    //bind button
  $sendReturnFormBtn.on("click", validationReturnForm);
    //Validation first form
  function validationReturnForm() {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ($email.val().trim() === "") {
        swal('', 'Lütfen e-posta adresini yaz!', 'error');
        return false;
    }
    if (regex.test($email.val().toLowerCase()) === false) {
        swal('', 'Lütfen doğru bir e-posta adresi yaz!', 'error');
        return false;
    }
    if ($orderID.val().trim() === "") {
        swal('', 'Lütfen şipariş numaranı yaz!', 'error');
        return false;
    }
    getData($email.val(), $orderID.val());
  }
    //Get Data From Server
  function getData(email, orderID) {
    $sendReturnFormBtn.html('<i class="fa fa-circle-o-notch fa-spin"></i> Gönderiliyor');// Button loading efect
     var dataUrl = "http://bauhaus.multiscreen.technology/plugin/alegra/rma-form?email="+email+"&order_id="+orderID;
    $.getJSON(dataUrl)
      .done(function(data) {
        if (data.success) {
          initModul(data);
          items = data.xtra.items; //Add cache items
        } else {
          swal(data.title, data.message, "error");
        }
      })
      .always(function(data) {
        if (data.success) {
          $returnFormModul.fadeOut();
          $returnCartModul.fadeIn();
        }
      });
  }
    //Add data with javascript template engine to view
  function initModul(data) {
    var source = $("#returnCart-template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper("quantitys", function(n, block) {
      var accum = "";
      for (var i = 1; i <= n; i++) accum += block.fn(i);
      return accum;
    });
    Handlebars.registerHelper("colspanSize", function() {
      var windowsWidth = $(window).width();
      if (windowsWidth < 414) {
        return 1;
      } else {
        return 3;
      }
    });
    $("#returnCart").html(template(data.xtra));
    //cache DOM elements
    var $sendReturnProducts = $("#sendReturnProducts");
    // bind event
    $sendReturnProducts.on("click", validationReturnProducts);
  }
  //Validation return criteria
  function validationReturnProducts() {
      var validFlag = true;
    if ($(".productSelect[type='checkbox']:checked").length === 0) {
      $(".productSelect[type='checkbox']")
        .next()
        .css("background-color", "red");
      swal("", "Lütfen iade etmek istediğin ürünü seç!", "error");
      validFlag = false;
      return false;
    }
    $(".productSelect[type='checkbox']:checked").each(function() {
      var productID = $(this).val();
      var $reasonSelect = $('.return-reason[data-itemid="' + productID + '"]');
      if ($reasonSelect.val() === "0") {
        $reasonSelect.css("border-color", "red");
        swal("", "Lütfen iade nedenini seçin!", "error");
        validFlag = false;
        return false;
      }
    });
    if ($("#shippingTerms").is(":checked") === false) {
      $("#shippingTerms")
        .next()
        .css("background-color", "red");
      swal("", "Lütfen iade ve gönderim şartlarını onaylayın!", "error");
      validFlag = false;
      return false;
    }
    if (validFlag) {
        sendReturnReason();
    }   
  }
    //Send return products data
  function sendReturnReason() {
    var returnList = [];
    var returnProductsObj = {};
    $(".productSelect[type='checkbox']:checked").each(function(i) {
      var productID = $(this).val();
      var $reasonSelectVal = $(
        '.return-reason[data-itemid="' + productID + '"]'
      ).val();
      var $reasonSelectText = $(
        '.return-reason[data-itemid="' + productID + '"] :selected'
      ).text();
      var $reasonSelectQuantity = $(
        '.return-quantity[data-itemid="' + productID + '"]'
      ).val();
      // filter cache items - get selected product
      var myitem = $.grep(items, function(e) {
        return e.product_id === productID;
      })[0];
      returnProductsObj = {
        item: myitem,
        selectedVal: $reasonSelectVal,
        selectedText: $reasonSelectText,
        quantity: $reasonSelectQuantity
      };
      //push array
      returnList.push(returnProductsObj);
    });
    console.log(returnList);
    swal("Başarılı", "Console u kontrol ediniz.", "success");
  }
})();
