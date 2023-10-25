(function() {
  let tries = 50

  setTimeout(doClear, 20);



  function doClear() {

    document.querySelectorAll('[style="display: none;"]').forEach(e => { e.style.display = "" })
    document.querySelectorAll(".ad-replacement").forEach(e => { e.parentElement.style.display = "none" })
    document.querySelector('.fas.fa-ban').parentElement.parentElement.parentElement.parentElement.style.display = "none";
    if (tries-- > 0) {
      setTimeout(doClear, 10);
    }
  }
  document.querySelector(" div > div > div:nth-child(2) > div:nth-child(3) > div.btn.btn-white").click();
})();