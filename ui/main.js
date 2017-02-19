console.log('Loaded!');
var img=document.getElementById('dp');
function moveLeft(){
    marginLeft=marginLeft-10;
    img.style.marginLeft=marginLeft - '5px';
}
img.onclick=function(){
    var Linterval=setInterval(moveLeft,50);
    
};


