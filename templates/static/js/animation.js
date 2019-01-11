const start_anime = () => {
	var con = document.getElementById('container');
	anime({
			targets:con,
			translateY:[
				{value: -200,duration:2500},
				{value:0,duration:2500,delay:5000}
				]
	})
	sleep(30, update_values)
}
 
const sleep = (waitSeconds, someFunction) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(someFunction())
    }, waitSeconds * 1000)
  })  
}

const update_values = () => {
	location.reload(true)
}

onload = function(){
	sleep(1, start_anime)
}
