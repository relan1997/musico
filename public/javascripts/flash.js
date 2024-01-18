const btn = document.querySelector('button');
const flash = document.querySelector(".flash");
btn.addEventListener('click',()=>{
    console.log('clicked');
    flash.style.display="none";
})