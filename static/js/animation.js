const sleep = (waitSeconds, someFunction) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(someFunction())
    }, waitSeconds * 1000)
  })  
}
var board;
var player;

function updateboard(b,v){
	$("td").each(function(i) {
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
		updateboard(data1.board,data1.valid);
		board = data1.board;
		console.log(data1.gameover);
		if(data1.gameover != 0){
			console.log('hakka');
			var nums = new Array(0,0);
			$('#result').css('display','block');
			$('table').css('z-index','-2000');
			$('#result').css('z-index','3000');
			for(var i=0;i<64;i++){
				if(board[i] == 1){
					nums[0]++;
				} else if(board[i] == -1){
					nums[1]++;
				}
			}
			$('.num').each(function(j){
					$(this).append(nums[j]);
				});
			if(data1.gameover == player){
				$('#whowin').append("プレイヤーの勝ち！");
				return false;
			}else{
				console.log('hakka2');
				$('#whowin').append("AIの勝ち！");
				return false;
			}
		}
		if(w == 1){
			postjson(board,0,player,2);
		}
		if(w == 2){
			if(data1.isSkip){
				postjson(board,0,player,2)
			}
		}
	});
}


$('td').on("click", function(){
	var isvalid = $(this).attr('class')
	if(!isvalid){
		return false;
	}
	$('.valid').each(function() {
		$(this).removeAttr('class');
		$(this).css('background-color','green');
	});
	var act = parseInt($(this).attr('id').slice(1));
	postjson(board,act,player,1);
});

$('#btn').on("click", function(){
		const url = "/initboard";
		player=1;
		postjson(0,0,player,0);
});