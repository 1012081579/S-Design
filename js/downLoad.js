document.getElementById("openLink").addEventListener("click", function() {
  // 获取 PDF 文件的路径
  var pdfPath = "./portfolio/portfolio.pdf";
  // 在新窗口中打开 PDF
  window.open(pdfPath, "_blank");
});