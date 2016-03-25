/****************************************************************************************
 * METHOD: FILTER
****************************************************************************************/
$(window).load(function(){
	$('*[data-role=ui-filter-list]').each(function(a) {
		(function(filter){
			
			var $scope = $('div[data-role="ui-filter-area-period"]');
			var $selectBtn = $scope.find('button[data-role="ui-btn-select-period"]');
			var $fromYear = $scope.find('select[data-role="ui-period-from-year"]');
			var $fromMonth = $scope.find('select[data-role="ui-period-from-month"]');
			var $toYear = $scope.find('select[data-role="ui-period-to-year"]');
			var $toMonth = $scope.find('select[data-role="ui-period-to-month"]');
			var now = new Date();
			var syncValue = function($elmt, val){
				$elmt.find('option[value="' + val + '"]').attr('selected', 'selected');
			}
			var checkChecked = function(){
				var isChecked = filter._scope.find('input[type=checkbox]:checked').length > 0 ? true : false;
				
				if(isChecked){
					$('*[data-role=btn-clear-all]').show();
				}
				else{
					$('*[data-role=btn-clear-all]').hide();
				}
				
				$fromYear.val('');
				$fromMonth.val('');
				$toYear.val('');
				$toMonth.val('');
			}
			var initYear = function($elmt){
				$elmt.empty();
				$elmt.append('<option value="">Year</option>');
				
				for(var i=now.getFullYear(); i>=2006; i--){
					$elmt.append('<option value="' + i + '">' + i + '</option>');
				}
			}
			
			initYear($fromYear);
			initYear($toYear);
			
			$fromYear.change(function(){
				var temp = $(this).find('option:selected').val();
				
				syncValue($fromYear, temp);
			});

			$fromMonth.change(function(){
				var temp = $(this).find('option:selected').val();
				
				syncValue($fromMonth, temp);
			});
			
			$toYear.change(function(){
				var temp = $(this).find('option:selected').val();
				
				syncValue($toYear, temp);
			});
			
			$toMonth.change(function(){
				var temp = $(this).find('option:selected').val();
				
				syncValue($toMonth, temp);
			});
			
			$selectBtn.click(function(){
				if(!$fromYear.find('option:selected').val() || !$fromMonth.find('option:selected').val() || !$toYear.find('option:selected').val() || !$toMonth.find('option:selected').val()) return false;
				
				var fromDate = $fromYear.val() + $fromMonth.val();
				var toDate = $toYear.val() + $toMonth.val();
				
				if(+fromDate > +toDate){
					_common.open_popup_layer('correctly');
					return false;
				}
				
				var text = $fromMonth.find('option:selected').text().slice(0, 3) + ' ' + $fromYear.val() + ' ~ ' + $toMonth.find('option:selected').text().slice(0, 3) + ' ' + $toYear.val();
				var html = '<span class="word" data-code="period">' + text + '<a href="javascript:void(0);" class="btn-close" data-role="btn-close-word-period"><span class="blind">Close</span></a></span>';
				
				$('span[data-code="period"]').remove();
				
				$(filter._result).append(html).on('click', 'a[data-role="btn-close-word-period"]', function(){
					$('span[data-code="period"]').remove();
					
					checkChecked();
				});
				$(filter._mresult).append(html).on('click', 'a[data-role="btn-close-word-period"]', function(){
					$('span[data-code="period"]').remove();
					
					checkChecked();
				});
				
				$('*[data-role=btn-clear-all]').show();
				
				changePage();
			});

		}($(this).data('filter')));
	});
	
	$('button[data-role=ui-btn-event-loadmore]').click(function(){
		var nextPage = parseInt($(this).data('page')) + 1;
		
		getFilterData(nextPage);
	});
});

/****************************************************************************************
 * METHOD:CHANGE PAGE
 * - checkbox 선택/해제 시 작동
****************************************************************************************/
function changePage(){
	getFilterData(1);
}

/****************************************************************************************
 * METHOD : GET FILTER DATA
****************************************************************************************/
function getFilterData(p_page){
	var $filterConts = $('div[data-role="ui-filter-content"]');
	var $checkboxs = $filterConts.find('input[type=checkbox]:checked');
	var arrVals = new Array();
	var startDate = $('select[data-role="ui-period-from-year"]').val() + $('select[data-role="ui-period-from-month"]').val();
	var endDate = $('select[data-role="ui-period-to-year"]').val() + $('select[data-role="ui-period-to-month"]').val();
	
	$checkboxs.each(function(){
		arrVals.push($(this).val());
	});
	
	var callback = function(data){
		var $btnLoadmore = $('button[data-role="ui-btn-events-loadmore"]');
		var $filterCnt = $('a[data-role="ui-filter-toggle"]').find('>span>em');
		
		$filterCnt.text(data.mainModel.totalCount);
		
		if(data.mainModel.insightList.length == 0){
			$btnLoadmore.hide();
			return false;
		}
		
		var curPage = data.mainModel.currentPage;
		var totPage = data.mainModel.totalPage;
		
		if(curPage < totPage){
			$btnLoadmore.show();
		}
		else{
			$btnLoadmore.hide();
		}
		
		$btnLoadmore.data('page', curPage);
	};
	
	var param = {
		chkRegionList : arrVals.toString(),
		chkStartDate : startDate,
		chkEndDate : endDate,
		page : p_page,
		mType : 'json'
	}
	
	var options = {
		clear : (Number(p_page) === 1 ? true : false ),
		param : param,
		callback : callback
	}
	
	_common.makeTemplate('/semiconductor/' + SITE_CD + '/about-us/event/selectAboutUsEventSearchList', 'event', options);
}