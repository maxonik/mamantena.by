$(window).ready(function(){

   var idContainer = $('#container');

   if ($(window).width() < 1260 ){
       idContainer.removeClass("overRes").addClass("lessRes");
   } else {
       idContainer.removeClass("lessRes").addClass("overRes");
   }
   $(window).resize(function() {
       if ($(window).width() < 1260 ){
           idContainer.removeClass("overRes").addClass("lessRes");
	   } else {
           idContainer.removeClass("lessRes").addClass("overRes");
	   }
    });

});
$.fn.addDivTo = function() {
    var $el;
    return this.each(function() {
        $el = $(this);
        var newDiv = $("<div />", {
            "class": "innerWrapper",
            "css"  : {
                "height"  : $el.height(),
                "width"   : "100%",
                "position": "relative"
            }
        });
        $el.wrapInner(newDiv);
    });
};

// BX.addCustomEvent("onFrameDataReceived", function(data) {
// 	$("#slider").easySlider({
// 		auto: true,
// 		continuous: true
// 	});
// });

$(document).ready(function(){
	$("#slider").easySlider({
		auto: true,
		continuous: true
	});
	//редирект на поддомены
	$('form[name=LOCATIONS] select[name=region]').on('change',function(){
		var city = $(this).find('option:selected').val();
		var path = window.location.pathname;
		if (city == '')
			window.location.href = 'http://mamantena.ru'+path;
		else
			window.location.href = 'http://'+city+'.mamantena.ru'+path;
	});

	if ($.browser.mozilla) {
        $('.topmenu').find('li.parent').addDivTo();
    }

	$('.topmenu > ul > li').hover(function() {
        $(this).addClass('hovered').find('ul').stop().slideDown(200);

    }, function() {
        $(this).removeClass('hovered').find('ul').stop().slideUp(100);

    });
    $('.topmenu > ul > li.parent a:first').on('click',function(e){
    	return false;
    });

    var ulHeightMax = $('.brandslist').find('ul').height();
    $('.brandslist .showall').parent().find('.forhide').css('display','none');
    var ulHeightMin = $('.brandslist').find('ul').height();
    $('.brandslist .showall').click(function() {
        $(this).css('display','none');
        $(this).parent().find('.hideall').css('display','block');
        $('.brandslist').find('ul').animate({
            	height: ulHeightMax
        	}, 400, function() {
        });
        $(this).parent().find('.forhide').css('display','block');
    });

    $('.brandslist .hideall').click(function() {
        $(this).css('display','none');
        $(this).parent().find('.showall').css('display','block');
        $('.brandslist').find('ul').animate({
            height: ulHeightMin
        }, 400, function() {
            $(this).find('.forhide').css('display','none');
        });
    });

    function stuff_image_width(){
	    $('.stuff_list .stuff_block .image').each(function(){
	    	var el = $(this);
	    	el.find('a').width(el.width());
	    });
    }
    stuff_image_width();
    $(window).resize(function(){
    	stuff_image_width();
    });

	//$('.leftmenu > ul > li a.active').parent('li').hide();
    /*$('.leftmenu > ul > li').hover(function() {
        $(this).addClass('hovered').find('ul').stop(true,true).show();
    }, function() {
        $(this).removeClass('hovered').find('ul').stop(true,true).hide();
    });

    $('.showban a.showbanner').click(function() {
		$(this).parent().hide();
		$('.banner').slideDown(400);
    });
	$('.banner a.hidebanner').click(function() {
		$('.banner').slideUp(200, function() {
			$('.showban').show();
		});
    });*/

	$('body').delegate('.banner a.closebanner','click',function() {
		$('.banner').slideUp(200, function() {
			$('.bannerBlock').remove();
			$.get('/include/close_banner.php');
		});
    });

	function show_banner(el){
    	var content = el.find('div.b_info').html();
    	$('.banner_slider #b_info_inner div').html(content).closest('#b_info').show().animate({left: "-286px"},300,function(){
    	});
    		//$('.sliderBlock #prevBtn a,.sliderBlock #nextBtn a').hide();
    	$('.sliderBlock #prevBtn a').animate({left:"-336px"},300);
	}
	function close_banner(){
		$('.banner_slider #b_info').animate({left: "36px"},300,function(){
    		$('.banner_slider #b_info_inner div').empty();
    		$('.banner_slider #b_info').hide();
    		//$('.sliderBlock #prevBtn a,.sliderBlock #nextBtn a').show();
    	});
    	$('.sliderBlock #prevBtn a').animate({left:"-14px"},300);
	}
    $('body').delegate('.banner_slider .slideList li','click',function(){
    	if ($('#b_info').is(':visible')){
    		close_banner()
    	}
    	else if ($('#b_info').is(':hidden')){
	    	var el = $(this);
	    	show_banner(el);
	    }
    	return false;
    });
    $('body').delegate('#b_info_inner input.close_b_info','click',function(){
    	close_banner();
    });

	function reviews(el){
		//var isActive = el.attr('class');
		if(!el.hasClass('active')) {
			$('.tab_nav .tab a').removeClass('active');
			el.addClass('active');
			var newTab = el.attr('href').split('#')[1];
			//$('.tabInner').slideUp(200);

			//$('#'+newTab).slideDown(400);
			$('#'+newTab).removeClass('tab_hide').addClass('tab_show').siblings('.tabInner').removeClass('tab_show').addClass('tab_hide');
			if (newTab == 'reviews')
			{
				var getData = {
					element_id: $('#reviews input[name=product_ID]').val()
				}
				$.get('/include/reviewLoad.php',getData,function(data){
					$('#reviews #reviews_list').html(data);
				});
			}
		}
		else
		{
			return false;
		}
	}
	$('.tab_nav .tab a').on('click',function(e) {
		e.preventDefault();
		reviews($(this));
    });

	$('.infoTop #read_rating').on('click',function(e){
		e.preventDefault();
		var el = $('.tab_nav .tab a[href=#reviews]');
		$('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
		reviews(el);
	});
	if (window.location.hash == '#reviews') {
    	var el = $('.tab_nav .tab a[href=#reviews]');
        reviews(el);
        $('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
    }

    $('body').delegate('#reviewsMoreLink', 'click', function(e) {
		e.preventDefault();
		var el = $(this),
			ReviewsList = el.closest('#reviews_list').find('.reviews-block'),
			//NavBlock = el.closest('#catalog-section').find('#paginatorBlock'),
			pagenum = parseInt(el.data('pagenum'),10),
			nextPageNum = pagenum+1,
			NavRecordCount = el.data('navrecordcount'),
			NavPageCount = el.data('navpagecount'),
			NavNum = el.data('navnum');

		if (nextPageNum <= NavPageCount) {
			$('#preloader').show();

			var getData = {
				element_id: $('#reviews input[name=product_ID]').val(),
				iNumPage: nextPageNum,
				mode: 'second'
			}
			$.get('/include/reviewLoad.php', getData, function(data){
				$('#preloader').hide();
				ReviewsList.append(data);
				el.data('pagenum',nextPageNum);
				if (nextPageNum >= NavPageCount)
					el.hide();
			});
		}
	});

    $('#descr a.to_descr').click(function(e) {
		e.preventDefault();
		var el = $('.tab_nav .tab a[href=#features]');
		reviews(el);

        /*$('.tab_nav .tab a').removeClass('active');
        $('.tab_nav .tab:nth-child(2) a').addClass('active');
        var newTab = $(this).attr('href').split('#')[1];
        $('.tabInner').slideUp(200);
        $('#'+newTab).slideDown(400);*/
    });

	$('.breadcrumbs a#bytype').hover(function() {
	   	$('.bytype').stop(true, true).slideDown(400);
    }, function() {

		var mousetrigger = 1;

		$('.bytype').hover(function() {
			mousetrigger = 0;
		  }, function() {
    		  $('.bytype').stop(true, true).slideUp(300);
			  mousetrigger = 1;
		});

		var func = function() {
            if (mousetrigger == 1) {$('.bytype').stop(true, true).slideUp(300);}
		}
		setTimeout(func, 100);
	});

	$('#features tr:odd').addClass('even');

	$('div.addreviewform').hide();
	$('a.addreviewform').click(function(e) {
		e.preventDefault();
		var el = $('.tab_nav .tab a[href=#testimonials]');
		if ($(this).parents('.itemRoddom').length > 0) {
			$('div.addreviewform').show();
			reviews(el);
			$('html, body').stop().animate({scrollTop: $('.testimonial-add form').offset().top - 60}, 800);
		}
		else {
			$('div.addreviewform').slideToggle(300);
		}
	});

    $('.itemRoddom a.to-map-block').click(function(e) {
        e.preventDefault();
        var el = $('.tab_nav .tab a[href=#roddom-map]');
        reviews(el);
        $('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
    });

    $('.itemRoddom a.to-contacts-block').click(function(e) {
        e.preventDefault();
        var el = $('.tab_nav .tab a[href=#descr]');
        reviews(el);
        $('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
    });

    $('.itemRoddom a.to-reviews').click(function(e) {
        e.preventDefault();
        var el = $('.tab_nav .tab a[href=#testimonials]');
        reviews(el);
        $('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
    });
    if (window.location.hash == '#to-reviews') {
    	var el = $('.tab_nav .tab a[href=#testimonials]');
        reviews(el);
        $('html, body').stop().animate({scrollTop: $('.tab_nav').offset().top}, 800);
    }

	$('a#colours_trigger').click(function() {
		var colourTrigger = $(this).attr('class');

		if (colourTrigger == "to_show") {
			$(this).removeClass('to_show').addClass('to_hide').text('скрыть все расцветки');
			$('.coloursList').slideDown(600);
			$('.coloursSliderOuter').slideUp(300);
		}

		if (colourTrigger == "to_hide") {
			$(this).removeClass('to_hide').addClass('to_show').text('показать все расцветки');
			$('.coloursList').slideUp(300);
			$('.coloursSliderOuter').slideDown(600);
		}
	});

	$('a.delete_feature').click(function() {
		$(this).parent().parent().hide();
	});
	$('a.features_back').click(function() {
		$('table.features tr').show();
	});

	$('.feedback_block a.feedback').click(function(e) {
		e.preventDefault();
		$.get('/include/modal/feedback.php',function(data){
			$('body').append(data);
	        e.preventDefault();

		    var pWin = $('#feedback');
			pWin.fadeIn(500);

			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
			$('#feedback input[type=button]').click(function(){
				var getData = $('#feedback form').serialize();
				$.get('/include/modal/feedbackSend.php',getData,function(data){
					$('#feedback input[type=text], #feedback textarea').val("");
					alert(data);
				});
			});
		});
	});

	$('a.skk').click(function(e) {
		e.preventDefault();
		$.get('/include/modal/skk.php',function(data){
			$('body').append(data);
	        e.preventDefault();
			$("form[name=skk]").validate({
				rules: {
					fio: "required",
					email: {
						required: true,
						email: true
					},
					message: "required"
				}
			});
		    var pWin = $('#skk');
			pWin.fadeIn(500);

			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
			$('input[type="button"]').click(function() {
				var el = $(this);
				if (el.parents('form[name=skk]').valid())
				{
					var getData = el.parents('form[name=skk]').serialize();
					$.get('/include/modal/skkSend.php',getData,function(data){
						/*el.parents('form[name=skk]').find('.messageForm').show('fast').html('<label><b>'+data+'</b></label>');*/
						pWin.fadeOut(300,function(){
							pWin.remove();
							alert(data);
						});
						//el.parents('form[name=skk]').find('input[type=text],textarea').val('');
					});
				}
			});
		});
	});

	$('a.callback').click(function(e) {
		e.preventDefault();
		$.get('/include/modal/callback.php',function(data){
			$('body').append(data);
			$("form[name=callbackForm]").validate({
				rules: {
					phone: {
						required: true,
						phoneRU: true
					}
				}
			});
	        e.preventDefault();
		    var pWin = $('#callback');
			pWin.fadeIn(500);

			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
			$('input[type="button"]').click(function() {
				var el = $(this);
				if (el.parents('form[name=callbackForm]').valid())
				{
					var getData = {
						date: document.URL,
						phone: el.parents('form[name=callbackForm]').find('input[name=phone]').val(),
						message: el.parents('form[name=callbackForm]').find('textarea[name=message]').val(),
					}
					$.get('/include/modal/callbackForm.php',getData,function(data){
						el.parents('form[name=callbackForm]').find('.messageForm').show('fast').html('<div class="form-group">'+data+'</div>');
						el.parents('form[name=callbackForm]').find('input[name=phone], textarea').val('');
					});
				}
			});
		});
	});

	$('a.about_delivery').click(function(e) {
		e.preventDefault();
		$.get('/include/modal/about_delivery.php',function(data){
			$('body').append(data);
			e.preventDefault();
			var pWin = $('#about_delivery');
			pWin.fadeIn(500);
			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close,input[type="submit"],input[type="button"]').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
		});
	});

	$('a.vtl').click(function(e) {
		e.preventDefault();
		$.get('/include/modal/vtl.php',function(data){
			$('body').append(data);
			e.preventDefault();
			var pWin = $('#vtl');
			pWin.fadeIn(500);
			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close,input[type="submit"],input[type="button"]').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
		});
	});

	$('.cart_inner table.cartList a.delete').click(function(e) {
		var el = $(this);
		$.get('/include/delete_form.php',function(data){
			$('body').append(data);

	        e.preventDefault();

		    var pWin = $('#delete_form');
			pWin.fadeIn(500);

			pWin.click(function(event) {
				ev = event || window.event
				if (ev.target == this) {
					$(pWin).fadeIn(500);
				}
			});
			$('.popup_close,a.close,input.btn-back').click(function() {
				pWin.fadeOut(300,function(){pWin.remove()});
			});
			$('input.btn-delete').click(function() {
				el.next('input').attr({checked:'checked'});
				$('form[name=basket_form]').submit();
				return false;
			});
			var imgUrl = el.parents('tr').find('td img').attr('src');
			$('.delete_form img').attr({src: imgUrl});
			$('.delete_form .prName').text(el.parents('tr').find('td.prName').text());
			$('.delete_form .price').text(el.parents('tr').find('td .price').text());
		});
	});

	$('.cart_inner a.clear_cart').on('click',function(){
		$('.cartList .productDel').attr({checked:'checked'});
		$('form[name=basket_form]').submit();
		return false;
	});

	//обработка выбора цвета или размера товара в выпадающем списке в карт.товара
	$('.infoTop select[name=colour],.infoTop select[name=razmer]').on('change',function(){
		var el = $(this);
		//если в списке выбран цвет или габарит, ставим атрибуты этого торгового предложения
		if (el.find('option:selected').val() > 0)
		{
			var elID = el.find('option:selected').val();
			//var elNAME = el.find('option:selected').attr('data-name');
			var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
			var elPRICE = el.find('option:selected').attr('data-price');
			var elIMG = el.find('option:selected').attr('data-img');
			el.closest('div.forms').find('a.add_to_basket').attr({
				'data-id': elID,
				'data-name': elNAME,
				'data-price': elPRICE,
				'data-img': elIMG
			});
			$('.bigImg a.enlarge').attr({
				data: elID,
				title: elNAME
			}).find('img').attr({
				src: elIMG,
				alt: elNAME
			});
			$('#productPrice span').text(elPRICE+' руб.');
		}
		//если в списке ничего не выбрано, ставим атрибуты основного товара
		else
		{
			var elID = $('#productProp').val();
			var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
			var elPRICE = $('#productProp').attr('data-price');
			var elIMG = $('#productProp').attr('data-img');
			el.closest('div.forms').find('a.add_to_basket').attr({
				'data-id': elID,
				'data-name': elNAME,
				'data-price': elPRICE,
				'data-img': elIMG
			});
			$('.bigImg a.enlarge').attr({
				data: elID,
				title: elNAME
			}).find('img').attr({
				src: elIMG,
				alt: elNAME
			});
			$('#productPrice span').text(elPRICE+' руб.');
		}
	});

	//Обработка выбора размера в разделе Матрасы. Здесь картиннки торг.предл. не выводим, только размеры.
	$('select[name=matras_offers]').on('change',function(){
		var el = $(this);
		if (el.find('option:selected').val() > 0)
		{
			var elID = el.find('option:selected').val();
			var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
			var elPRICE = el.find('option:selected').attr('data-price');
			var elIMG = el.find('option:selected').attr('data-img');
			el.closest('div.forms').find('a.add_to_basket').attr({
				'data-id': elID,
				'data-name': elNAME,
				'data-price': elPRICE,
				'data-img': elIMG
			});
			$('#productPrice span').text(elPRICE+' руб.');
		}
		else
		{
			var elID = $('#productProp').val();
			var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
			var elPRICE = $('#productProp').attr('data-price');
			var elIMG = $('#productProp').attr('data-img');
			el.closest('div.forms').find('a.add_to_basket').attr({
				'data-id': elID,
				'data-name': elNAME,
				'data-price': elPRICE,
				'data-img': elIMG
			});
			$('#productPrice span').text(elPRICE+' руб.');
		}
	});

	//html код всплывающего окна с данными о добавленном в корзину товаре
	var informer = '<div class="popup_overlay" id="add_to_cart_info"><div class="popup"><div class="inner"><a class="popup_close">X</a><h2>товар добавлен в корзину</h2><div class="added_to_cart_form"><form action="#"><div class="data-field"><table class="cartList"><tbody><tr><td id="p_img"></td><td id="p_name"></td><td><span class="price" id="informerPrice"></span></td></tr><tr><td colspan="3"><input type="checkbox" id="tohide"><label for="tohide">Больше не показывать</label></td></tr></tbody></table></div><div class="data-field" style="text-align:center;"><input type="button" value="продолжить покупки" class="btn-gray"><a class="addreviewform" href="/basket/">оформить заказ</a></div></form></div></div></div></div>';

	//добавление в корзину
	$('body').delegate('a.add_to_basket','click',function(){
    	el = $(this);
    	var product_id = parseInt(el.attr('data-id'));
    	var countProduct = 1;
    	/*if(el.closest('div.forms').find('#countProduct input#count').val() > 1)
    		countProduct = el.closest('div.forms').find('#countProduct input#count').val();*/
		var post_data = {
			action: "ADD2BASKET",
			ajaxaddid: product_id,
			count: countProduct
		}
		//var el_name = $('.mainItemBlock .bigImg img').attr('alt');
		var el_name = el.attr('data-name');
		var el_price = el.attr('data-price');
		var el_img = el.attr('data-img');
		$.post('/include/basket.php', post_data, function() {
			$.post('/include/basket_small.php',
				function(data){
					$('#basket_small').html(data);
				}
			);
			//выводим всплывающее окно, если не установлена кука
			var cookie_informer = $.cookie("show_informer");
			if(cookie_informer != 'off'){
				$(informer).appendTo('body').fadeIn(500);
				$('#p_name').text(el_name);
				if (el_price)
					$('#informerPrice').text(el_price+' руб.');
				if (el_img)
					$('#p_img').html('<img src="'+el_img+'" alt="'+el_name+'">');
			}
			else {
				$('a[data-id='+product_id+']').text('В корзине');
			}
		});
		$('.popup_close,a.close,input[type="submit"],input[type="button"]').live('click',function() {
			if($('input#tohide').is(':checked')){
				$.cookie("show_informer", "off", {expires: 7, path: '/'});
			}
        	$(".popup_overlay").fadeOut(300, function(){$(this).remove()});
    	});
		return false;
    });

	//Выставление рейтинга
	function setting_rating(rate,element){
		element.parent('.rating').find('a').each(function(j){
			var el = $(this);
			if(++j<=rate){
				el.removeClass('unactivestar').addClass('activestar');
			}
			else {
				el.removeClass('activestar').addClass('unactivestar');
			}
		});
	}
	//rating = Math.round(<?=$arResult["PROPERTIES"]["RATING"]["VALUE"]?>);
	//инициализируем звездочки
	//setting_rating(rating);

	$('.addreviewform .rating a').on('mouseover',function(){
		var el = $(this);
		setting_rating(el.attr('data'),el);
	});
	$('.addreviewform .rating a').on('mouseout',function(){
		var el = $(this);
		if (el.parent('.rating').find('a').hasClass('check'))
			setting_rating(el.parent('.rating').find('a.check').attr('data'),el);
		else
			setting_rating(0,el);
	});
	$('.addreviewform .rating a').on('click',function(){
		var el = $(this);
		el.addClass('check').siblings().removeClass('check');
		$("form[name=reviewForm] input[name=rating]").val(el.attr('data'));
		el.parent('.rating').find('input[type=hidden]').val(el.attr('data'));
	});

	if ($('#reviews-roddoma').length > 0) {
		var getData = {
			RODDOM_ID: $('#testimonials').data('id')
		};
		$.get('/include/roddom-reviews.php', getData, function(data) {
			$('#reviews-roddoma').html(data);
		});
	}

	$('body').delegate('#reviews-roddoma .paginator a', 'click', function(e) {
		e.preventDefault();
		var el = $(this);
		var getData = {};
		getData['PAGEN_'+el.closest('.paginator').data('navnum')] = el.data('navpagenomer');
		getData['RODDOM_ID'] = $('#testimonials').data('id');
		$.get('/include/roddom-reviews.php', getData, function(data) {
			$('#reviews-roddoma').html(data);
			$('html, body').stop().animate({scrollTop: $('#testimonials').offset().top}, 800);
		});
	});

	//форма "написать отзыв" о роддоме
	$("form[name=reviewFormRoddom]").validate({
		//debug: true,
		ignore: [],
		rules: {
			NAME: {
				required: true,
				minlength: 3
			},
			ATITUDE: {
				required: true,
				rangelength: [1, 5]
			},
			PROF: {
				required: true,
				rangelength: [1, 5]
			},
			TERMS: {
				required: true,
				rangelength: [1, 5]
			},
			EMAIL: {
				required: true,
				email: true
			},
			PREVIEW_TEXT: {
				//required: true,
				minlength: 10
			},
			DETAIL_TEXT: {
				required: true,
				minlength: 20
			}
		},
		messages: {
			NAME: {
				required: "Введите ваше имя",
				minlength: "Имя должно быть не менее 3 символов"
			},
			ATITUDE: 'Поставьте оценку за отношение персонала',
			PROF: 'Поставьте оценку за профессионализм персонала',
			TERMS: 'Поставьте оценку за условия пребывания',
			EMAIL: {
				required: 'Введите ваш E-mail',
				email: 'E-mail введен некорректно'
			},
			PREVIEW_TEXT: {
				//required: 'Введите ваше общее впечатление',
				minlength: 'Минимум 10 символов'
			},
			DETAIL_TEXT: {
				required: 'Введите ваш отзыв',
				minlength: 'Минимум 20 символов'
			}
		},
		errorLabelContainer: '#messageBox',
		errorElement: 'div',
		//errorClass: 'text-danger'
	});

	/*$("form[name=reviewFormRoddom]").on('submit', function(e) {
		e.preventDefault();
		var form = $(this);
		form.validate({
			//debug: true,
			ignore: [],
			rules: {
				NAME: {
					required: true,
					minlength: 3
				},
				ATITUDE: {
					required: true,
					rangelength: [1, 5]
				},
				PROF: {
					required: true,
					rangelength: [1, 5]
				},
				TERMS: {
					required: true,
					rangelength: [1, 5]
				},
				EMAIL: {
					required: true,
					email: true
				},
				PREVIEW_TEXT: {
					required: true,
					minlength: 10
				},
				DETAIL_TEXT: {
					required: true,
					minlength: 20
				}
			},
			messages: {
				NAME: {
					required: "Введите ваше имя",
					minlength: "Имя должно быть не менее 3 символов"
				},
				ATITUDE: 'Поставьте оценку за отношение персонала',
				PROF: 'Поставьте оценку за профессионализм персонала',
				TERMS: 'Поставьте оценку за условия пребывания',
				EMAIL: {
					required: 'Введите ваш E-mail',
					email: 'E-mail введен некорректно'
				},
				PREVIEW_TEXT: {
					required: 'Введите ваше общее впечатление',
					minlength: 'Минимум 10 символов'
				},
				DETAIL_TEXT: {
					required: 'Введите ваш отзыв',
					minlength: 'Минимум 20 символов'
				}
			},
			errorLabelContainer: '#messageBox',
			errorElement: 'div',
			//errorClass: 'text-danger'
		});
		if (form.valid()) {
			form.submit();
		}
	});
	*/

	//форма "написать отзыв"
	$("form[name=reviewForm]").validate({
		//debug: true,
		rules: {
			fio: {
				required: true,
				minlength: 3
			},
			worth: "required",
			limitations: "required",
			review: "required",
			captcha_word: {
				required: true,
				rangelength: [5, 5]
			}
		},
		messages: {
			fio: "Введите ваше имя",
			worth:  "Введите достоинства товара",
			limitations: "Введите недостатки товара",
			review: "Введите комментарий"
		}
	});
	$('form[name=reviewForm] .btn-submit').live('click',function(){
		$('#formMessage').hide();
		var form = $('form[name=reviewForm]');
		if (form.find('input[name=rating]').val() == '')
		{
			$('#formMessage').html('<p class="errorMessage">Пожалуйста, оцените товар!</p>').show('fast');
		}
		else if (form.valid())
		{
			var query = form.serialize();
			$.getJSON('/include/review.php', query, function (response) {
				if (response.STATUS == "ERROR") {
					$('#formMessage').html('<p class="errorMessage">'+response.MESSAGE+'</p>').show('fast');
				}
				else {
					var pWin = $('#review-thanks');
					pWin.fadeIn(500);

					pWin.click(function(event) {
						ev = event || window.event
						if (ev.target == this) {
							$(pWin).fadeIn(500);
						}
					});
					pWin.find('.btn-purple').click(function() {
						pWin.fadeOut(300,function(){pWin.remove()});
					});

					form.find('input[type=text], textarea').val('');
				}
			});
		}
		return false;
	});
	$('#c_refresh').live('click',function(){
		$.post('/include/captcha.php',function(data){
			$('#captchaRefresh').html(data);
		});
	});

	//голосование за отзыв
	$('body').delegate('#reviews .g-review__useful a', 'click', function (e) {
		e.preventDefault();
		var el = $(this);
		var getData = {
			reviev_id: el.closest('.g-review').data('id'),
			vote: (el.hasClass('g-review__useful__yes')?'Y':'N')
		}
		//el.closest('.g-review').css('position','relative').append('<div class="loader"></div>');
		$.getJSON('/include/setReviewVote.php', getData, function(response) {
			el.closest('.g-review').find('.loader').remove();
			if (response.STATUS == 'OK') {
				//info_alert('Сообщение', response.MESSAGE);
				var pWin = $('#review-vote');
				pWin.find('.popup-body').html('<p>'+response.MESSAGE+'</p>');
				pWin.fadeIn(500);
				pWin.find('.btn-purple').click(function() {
					pWin.fadeOut(300);
				});

				el.closest('.g-review__useful').find('.review-plus-count').text(response.UF_LIKE);
				el.closest('.review__bottom').find('.review-minus-count').text(response.UF_DIZLIKE);
			}
			else if (response.STATUS == 'ERROR') {
				var pWin = $('#review-vote');
				pWin.find('.popup-body').html('<p>'+response.MESSAGE+'</p>');
				pWin.fadeIn(500);
				pWin.find('.btn-purple').click(function() {
					pWin.fadeOut(300);
				});
			}
		});
	});

	/***** сравнение товаров *****/
	//добавить/удалить в список сравнения
	$('body').delegate('.addToCompare', 'change',function(){
		var el = $(this);
		var getData = new Object;
		getData.id = el.val();
		getData.compare = el.attr('data-section');
		if (el.is(':checked')){
			getData.action = 'ADD_TO_COMPARE_LIST';
			el.next('label').hide().next('a').show();
		}
		else{
			getData.action = 'DELETE_FROM_COMPARE_LIST';
			el.next('label').show().next('a').hide();
		}
		var top = $(window).height()/2-20;
		$.get('',getData,function(){
			$.get('/bitrix/templates/.default/page_templates/compare.php',function(data){
				$('#compare_controls').remove();
				$('body').append(data);
				$('#compareButtonOne,#compareButton').css('top',top);
				/*var count = parseInt(data,10);
				if (count == 0)
				{
					$('#compareButtonOne,#compareButton').remove();
					$('.catalog-compare-list').hide();
				}
				else if (count == 1)
				{
					$('.catalog-compare-list').hide();
					$('#compareButtonOne,#compareButton').remove();
					$('<span id="compareButtonOne"> товар для сравнения <span>'+count+'</span></span>').appendTo('body');
					$('#compareButtonOne').css('top',top);
				}
				else if (count >= 2)
				{
					$('.catalog-compare-list').show();
					$('#compareButtonOne,#compareButton').remove();
					$('<a href="/catalog/compare.php?SECTION_ID='+el.attr('data-section')+'" id="compareButton">сравнить товары <span>'+count+'</span></a>').appendTo('body');
					$('#compareButton').css('top',top);
				}*/
			});
		});
	});
	var top = $(window).height()/2-20;
	$('#compareButtonOne,#compareButton').css('top',top);

	$('body').delegate('#compare_close','click',function(){
		$('.compare_bottom').animate({bottom: "-60px"},500,"swing",function(){
			$.get('/include/compare_view.php',function(){
				$.get('/bitrix/templates/.default/page_templates/compare.php',function(data){
					$('#compare_controls').remove();
					$('body').append(data);
				});
			});
		});
	});

	$('body').delegate('#compare_delete','click',function(){
		$('.compare_bottom').animate({bottom: "-60px"},500,"swing",function(){
			$.get('/include/compare_delete.php',function(){
				window.location.reload();
			});
		});
		return false;
	});

	/***** Фильтр на главной *****/
	$("#slider-range").slider({
		range: true,
		min: 50000,
		max: 10000000,
		values: [1000000, 6000000],
		step: 10000,
		slide: function(event, ui) {
			if (parseInt(ui.values[1],10)-parseInt(ui.values[0],10) < 2000){
				return false;
			}
			else {
				$("#priceMin").val(ui.values[0]);
				$("#priceMinDiv").text(ui.values[0] + ' руб.');
				$("#priceMax").val(ui.values[1]);
				$("#priceMaxDiv").text(ui.values[1] + ' руб.');
			}
		}
	});
	$("#priceMin").val($("#slider-range").slider("values", 0));
	$("#priceMinDiv").text($("#slider-range").slider("values", 0) + ' руб.');
	$("#priceMax").val($("#slider-range").slider("values", 1));
	$("#priceMaxDiv").text($("#slider-range").slider("values", 1) + ' руб.');

	$('.TypeAndBrands select[name="arrFilter[SECTION_ID]"]').on('change',function(){
		var section = $(this).find('option:selected').val();
		$('form#mainFilter').attr({action:'/catalog/'+section+'/'})
	});
	//делаем высоту строк одинаковыми у таблиц с названиями и свойствами
	function setTrHeight(){
		$('table.compareProp tr').each(function(i){
			var el = $(this);
			var h1 = el.height();
			var h2 = $('table.CompareValue tr').eq(i).height();
			if (h1 > h2)
			{
				$('table.CompareValue tr').eq(i).height(h1);
			}
			else if (h2 > h1) {
				$('table.compareProp tr').eq(i).height(h2);
			}
		});
	}
	setTrHeight();
	$(window).resize(function(){
		setTrHeight();
	});

	//Редактирование отзывов в карточке товара
	$('body').delegate('.g-review .g-review__edit', 'click', function(e) {
		e.preventDefault();
		var el = $(this),
			worth = el.closest('.g-review').find('p.worth').text(),
			lack = el.closest('.g-review').find('p.lack').text(),
			comment = el.closest('.g-review').find('p.comment').text();
		el.closest('.g-review').find('p.worth').after('<textarea class="review_edit_block" name="review_worth">'+worth+'</textarea>').remove();
		el.closest('.g-review').find('p.lack').after('<textarea class="review_edit_block" name="review_lack">'+lack+'</textarea>').remove();
		el.closest('.g-review').find('p.comment').after('<textarea class="review_edit_block" name="review_comment">'+comment+'</textarea>').remove();
		el.closest('.g-review__top__left').append('<button class="reviewSave">Сохранить</button><button class="reviewCancel">Отмена</button>');
	});
	//сохраняем отзыв
	$('body').delegate('.reviewSave','click',function(){
		var el = $(this);
		el.closest('.g-review__top__left').find('button').attr('disabled','disabled');
		var getData = {
			fio: el.closest('.g-review').find('.g-review__author').text(),
			worth: el.closest('.g-review').find('textarea[name=review_worth]').val(),
			lack: el.closest('.g-review').find('textarea[name=review_lack]').val(),
			comment: el.closest('.g-review').find('textarea[name=review_comment]').val(),
			rating: el.closest('.g-review').attr('data-rating'),
			id: el.closest('.g-review').attr('data-id'),
			product_id: el.closest('#reviews').find('input[name=product_ID]').val()
		}
		$.post('/include/reviewUpdate.php',getData,function(data){
			el.closest('.g-review').find('textarea[name=review_worth]').after('<p class="worth">'+getData.worth+'</p>').remove();
			el.closest('.g-review').find('textarea[name=review_lack]').after('<p class="lack">'+getData.lack+'</p>').remove();
			el.closest('.g-review').find('textarea[name=review_comment]').after('<p class="comment">'+getData.comment+'</p>').remove();
			el.closest('.reviewControl').find('button').removeAttr('disabled');
			el.closest('.reviewControl').find('button.reviewSave,button.reviewCancel').remove();
			alert(data);
		});
	});
	//удаляем отзыв
	$('body').delegate('.g-review .g-review__delete', 'click', function (e) {
		e.preventDefault();
		var el = $(this);
		var getData = {
			id: el.closest('.g-review').attr('data-id')
		}
		$.post('/include/reviewDelete.php',getData,function(data){
			var otvet = parseInt(data,10);
			if (otvet == 1)
			{
				el.closest('.g-review').remove();
				alert('Отзыв успешно удален!');
			}
			else if (otvet == 0)
				alert('Возникла ошибка при удалении отзыва.')
		});
	});
	//Отмена редактирования
	$('body').delegate('.reviewCancel','click',function(){
		var el = $(this);
		var getData = {
			worth: el.closest('.g-review').find('textarea[name=review_worth]').val(),
			lack: el.closest('.g-review').find('textarea[name=review_lack]').val(),
			comment: el.closest('.g-review').find('textarea[name=review_comment]').val()
		}
		el.closest('.g-review').find('textarea[name=review_worth]').after('<p class="worth">'+getData.worth+'</p>').remove();
		el.closest('.g-review').find('textarea[name=review_lack]').after('<p class="lack">'+getData.lack+'</p>').remove();
		el.closest('.g-review').find('textarea[name=review_comment]').after('<p class="comment">'+getData.comment+'</p>').remove();
		el.closest('.reviewControl').find('button').removeAttr('disabled');
		el.closest('.reviewControl').find('button.reviewSave,button.reviewCancel').remove();
	});

	//слайдер банеров
	var interval_baner = 10000; //через сколько секунд листать банер
	var col_banners = $('#baner_outer .baner').size();
	if (col_banners > 1){
		$('#baner_outer .baner').each(function(i){
			if (i>0) {
				$('#baner_outer .baner').eq(i).hide().css({top:'-56px'});
			}
		});
		var i_count = 0;
		var intervalID = setInterval(function(){
			var el = $('#baner_outer .baner').eq(i_count);
			var el2 = $('#baner_outer .baner').eq(i_count+1);
			if (i_count == 0){
				el.animate({top:'56px'},500,function(){
					el.hide().css({top:'-56px'})
				});
				el2.show().animate({top:'0px'},500);
			}
			else if ((i_count+1) == col_banners){
				el.animate({top:'56px'},500,function(){
					el.hide().css({top:'-56px'})
				});
				$('#baner_outer .baner').eq(0).show().animate({top:'0px'},500);
				i_count = -1;
			}
			else {
				el.animate({top:'56px'},500,function(){
					el.hide().css({top:'-56px'});
				});
				el2.show().animate({top:'0px'},500);
			}
			i_count++;
		}, interval_baner);
	}
	$('#baner_outer #baner_close').on('click',function(){
		$('#baner_outer').slideUp(300, function() {
			$('#baner_outer').remove();
			$.get('/include/close_banner2.php');
		});
	});

	var similar_block_width = $("#similar_block").width();
	var vis = 0;
	if (similar_block_width < 985)
		vis = 3;
	else
		vis = 4;
	$("#similar_block #similar_slider").jCarouselLite({
        visible: vis,
        btnNext: "#similar_block #next_btn",
        btnPrev: "#similar_block #prev_btn"
    });

    //подгрузка списка товаров по ajax в списке товаров
    //var loading = false;
    $('body').delegate('.show-more-button', 'click', function(e) {
        e.preventDefault();
        var el = $(this),
            ProductList = el.closest('#catalog-section').find('ul.stuff_list'),
            pagenum = parseInt(el.data('pagenum'),10),
            nextPageNum = pagenum+1,
            NavRecordCount = el.data('navrecordcount'),
            NavPageCount = el.data('navpagecount'),
            NavNum = el.data('navnum'),
            NavPageSize = parseInt(el.closest('#catalog-section').data('navpagesize'),10),
            SECTION_CODE = el.closest('#catalog-section').data('code');

        if (nextPageNum <= NavPageCount) {
            $('#catalog-section #preloader').show();
            var getData = $('form[name=catalog-filter],form[name=makersForm]').serialize();
            getData += (getData.length>0?'&':'')+'PAGEN_'+NavNum+'='+nextPageNum+'&SECTION_CODE='+SECTION_CODE;
            var licount = ProductList.find('li').length;
            $.get('/include/catalog-section.php',getData, function(data) {
                $('#catalog-section #preloader').hide();
                ProductList.append(data);
                // $('html, body').stop().animate({scrollTop: ProductList.find('li:eq('+licount+')').offset().top}, 800);
                //loading = false;
            });

            el.data('pagenum',nextPageNum);
            if (nextPageNum == NavPageCount) {
                el.hide();
            }
        }
    });

    //сортировка в каталоге товаров
    $('body').delegate('#catalog-sort a', 'click', function(e) {
        e.preventDefault();
        var el = $(this),
            sort = el.data('sort'),
            order = el.data('order'),
            getData = $('form[name=catalog-filter],form[name=makersForm]').serialize(),
            ProductList = $('#catalog-section ul.stuff_list'),
            SECTION_CODE = $('#catalog-section').data('code');

        getData += (getData.length>0?'&':'?')+'SECTION_CODE='+SECTION_CODE+'&sort='+sort;

        if (!el.hasClass('active')) {
            el.data('order', 'ASC').attr('data-order', 'ASC');
            getData += (getData.length>0?'&':'?')+'order=ASC';
        }
        else {
            if (order == "ASC") {
                el.data('order', 'DESC').attr('data-order', 'DESC');
                getData += (getData.length>0?'&':'?')+'order=DESC';
            }
            else if (order == "DESC") {
                el.data('order', 'ASC').attr('data-order', 'ASC');
                getData += (getData.length>0?'&':'?')+'order=ASC';
            }
        }
        el.addClass('active').siblings().removeClass('active');
        $.get('/include/catalog-section.php',getData, function(data) {
            //$('#preloader').hide();
            ProductList.html(data);
            $('#catalogMoreLink').data('pagenum','1');
            if (parseInt($('.show-more-button').data('navpagecount'),10) > 1 && $('.show-more-button').is(':hidden')) {
                $('.show-more-button').show();
            }
            $('html, body').stop().animate({scrollTop: $('#catalog-sort').offset().top}, 800);
        });
    });
});
