var count=0;
var a=document.getElementById("number");
var b=document.getElementById("add");
var c=document.getElementById("minus");
var d=document.getElementById("res");
b.addEventListener("click", () =>{
    count=count+1;
    a.innerHTML=count;
})
c.addEventListener("click", () =>{
    count=count-1;
    a.innerHTML=count;
})
d.addEventListener("click",() =>{
    a.innerHTML="0";
})