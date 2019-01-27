const sleep = (waitSeconds, someFunction) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(someFunction())
    }, waitSeconds * 1000)
  })  
}
var board;
var player;

function updateboard(b,v,a){
	$("td").each(function(i) {
				if(a == i){
					$(this).css('background-color','orangered');
					$(this).attr('class', 'act');
				}
				if(v[i] == 1){
					$(this).css('background-color','#F4FA58');
					$(this).attr('class','valid');
					$(this).attr('id', 'c' + i);
				}
				if(b[i] == 0){

				} else if(b[i] == 1) {
					$(this).empty().append("<img src='./static/images/revers.png' width='88' height='88'>");
				} else {
					$(this).empty().append("<img src='./static/images/reversi.png' width='88' height='88'>");
				}
		});
}

function postjson(b,a,p,w){
	var url = "";
	var act = 65;
	if (w == 0){
		url = "/initboard";
	} else if (w == 1) {
		url = "/actres";
	} else {
		url = "/predict";
	}
	const data={
		"player":p,
		"board":b,
		"action":a
	}
	json = JSON.stringify(data);
	$.post(url,json,null,"json")
	.done(function(data1,textStatus,jqXHR) {
		if(data1.act){
			act = data1.act;
		}
		if(w == 0){
			fullupdateboard(data1.board,data1.valid,act);
		} else {
			updateboard(data1.board,data1.valid,act);
		}
		pre_board = board;
		board = data1.board;
		if(data1.gameover != 0){
			var nums = new Array(0,0);
			$('#result').css('display','block');
			$('#result').css('z-index','3000');
			for(var i=0;i<64;i++){
				if(board[i] == 1){
					nums[0]++;
				} else if(board[i] == -1){
					nums[1]++;
				}
			}
			$('.num').each(function(j){
					$(this).empty().append(nums[j]);
				});
			if(data1.gameover == player){
				$('#whowin').empty().append("プレイヤーの勝ち！");
				return false;
			}else{
				$('#whowin').empty().append("AIの勝ち！");
				return false;
			}
		}
		if(w == 1){
			postjson(board,0,player,2);
			return false;
		}
		if(w == 2){
			if(data1.isSkip){
				postjson(board,0,player,2);
				return false;
			}
		}
	});
}


$('td').on("click", function(){
	var isvalid = $(this).attr('class')
	if(isvalid != "valid"){
		return false;
	}
	pre_board = board
	$('.act').each(function() {
		$(this).removeAttr('class');
		$(this).css('background-color','green');
	});
	$('.valid').each(function() {
		$(this).removeAttr('class');
		$(this).css('background-color','green');
	});
	var act = parseInt($(this).attr('id').slice(1));
	postjson(board,act,player,1);
});

function fullupdateboard(b,v,a){
	$("td").each(function(i) {	
				$(this).removeAttr('class');
				$(this).css('background-color','green');
				$('#result').css('z-index','-2020');
				$(this).empty();
				if(v[i] == 1){
					$(this).css('background-color','#F4FA58');
					$(this).attr('class','valid');
					$(this).attr('id', 'c' + i);
				}
				if(b[i] == 0){

				} else if(b[i] == 1) {
					$(this).append("<img src='./static/images/revers.png' width='88' height='88'>");
				} else {
					$(this).append("<img src='./static/images/reversi.png' width='88' height='88'>");
				}
		});
}

$('#btn').on("click", function(){
		player=1;
		postjson(0,0,player,0);
});

$('#btn1').on("click", function(){
		player=-1;
		postjson(0,0,player,0);
});