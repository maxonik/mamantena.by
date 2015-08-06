/***** Всплывающее окно с торговым предложением *****/
$(document).on('ready',function(){
	var offers = [],offers_type = [];
	count_tovar=-1;
	$('a.enlarge').each(function(i){
		var x=++count_tovar;
		offers[x] = $(this).attr('data'); 	//записываем в массив id товаров
		offers_type[x] = $(this).attr('data-type');
		var offer = $(this);
		offer.on('click',function(){
			//console.log(offers.length);
			$('#offerForm').dialog('destroy');
			var getData = {
				id: offer.attr('data'),
				type: offer.attr('data-type')
			}
			$.get('/include/offerform2.php',getData,function(data){
				console.log(data);
				var offerName = $('.mainItemBlock .bigImg img').attr('alt');
				if (offers.length > 1)
					lightboxNav = '<div id="lightbox-nav"><a id="lightbox-nav-btnPrev" href="#"></a><a id="lightbox-nav-btnNext" href="#"></a></div>';
				else 
					lightboxNav = '';
				var OfferBlock = $('<div id="offerForm" class="descr modalwindow" title="'+offerName+'"><div id="offerInfo">'+data+'</div>'+lightboxNav+'<span id="ya_share2"></span></div>');
				OfferBlock.dialog({
		            width:835,
		            height:735,
		            modal: true,
		            close: function(event, ui) {
		            	$("#offerForm").dialog('destroy');
		            	$('body').unbind('#offerForm .offerImg img','click');
		            }
		        });
		        new Ya.share({
					element: 'ya_share2',
					theme: 'counter',
					elementStyle: {
						'type': 'none',
						'border': false,
						'quickServices': ['facebook', 'moimir', 'vkontakte', 'twitter', 'odnoklassniki', 'gplus', 'yaru']
					},
					link: window.location.href,
					title: offer.attr('title')
				});
		        $("select[name=gabarits]").chosen();
				$('#offerForm').delegate('.offerImg img,#lightbox-nav-btnNext','click',function(){
					if(++x>count_tovar)
						x=0;
					var getData = {
						id: offers[x],
						type: offers_type[x]
					}
					$.get('/include/offerform2.php',getData,function(data){
						$('#offerInfo').html(data);
					});
					return false;
				});
				$('#offerForm #lightbox-nav-btnPrev').on('click',function(){
					if(--x<0)
						x=count_tovar;
					var getData = {
						id: offers[x],
						type: offers_type[x]
					}
					$.get('/include/offerform2.php',getData,function(data){
						$('#offerInfo').html(data);
					});
					return false;
				});
			});
		});
	});
});
$('body').delegate('select[name=gabarits]','change',function(){
      var el = $(this);
      if (el.find('option:selected').val() > 0)
      {
            var elID = el.find('option:selected').val();
            var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
            var elPRICE = el.find('option:selected').attr('data-price');
            var elIMG = el.find('option:selected').attr('data-img');
            el.closest('div#offer_outer').find('a.add_to_basket').attr({
                  'data-id': elID,
                  'data-name': elNAME,
                  'data-price': elPRICE,
                  'data-img': elIMG
            });
           el.closest('div#offer_outer').find('.fisnish_price span').text(elPRICE+' руб.');
      }
      else 
      {
            var elID = $('#productProp').val();
            var elNAME = $('.mainItemBlock .bigImg img').attr('alt');
            var elPRICE = $('#productProp').attr('data-price');
            var elIMG = $('#productProp').attr('data-img');
            el.closest('div#offer_outer').find('a.add_to_basket').attr({
                  'data-id': elID,
                  'data-name': elNAME,
                  'data-price': elPRICE,
                  'data-img': elIMG
            });
            el.closest('div#offer_outer').find('.fisnish_price span').text(elPRICE+' руб.');
      }
});