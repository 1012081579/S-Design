const menu = document.getElementById("menu");
let lastScrollPos = 0;

window.addEventListener("scroll", function() {
  const currentScrollPos = window.scrollY;
  
  if (currentScrollPos > lastScrollPos) {
    // 向下滚动，隐藏菜单
    menu.style.top = "-200px";
  } else {
    // 向上滚动，显示菜单
    menu.style.top = "0";
  }
  
  lastScrollPos = currentScrollPos;
});
