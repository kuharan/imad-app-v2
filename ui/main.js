console.log('Loaded!');
var img=document.getElementById('dp');
function moveLeft (){
    marginLeft=marginLeft-10;
    img.style.marginLeft=marginLeft - '5px';
}
img.onclick=function(){
    var Linterval=setInterval(moveLeft,50);
    
};

var boxWidth = 57, delta = 2;
setInterval(function(){
  var left = parseInt(img.style.left);
  if(left >= parseInt(viewDim.width - boxWidth)){
    delta = -2;
  }
  if (left <= 0) {
    delta = 2;
  }
  img.style.left = left + delta + 'px';
}, 20);