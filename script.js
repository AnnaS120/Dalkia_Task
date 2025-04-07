function f1() {
    var p = new Date();
    var q = new Date("2025-12-25");
  
    var variable = Math.round((q - p) / (1000 * 60 * 60 * 24));
  
    var variable2 = document.getElementById("my-element");
    variable2.innerText = variable;
  }
  
  function f2() {
    var p = new Date();
    var q = new Date("2026-01-01");
  
    var variable = Math.round((q - p) / (1000 * 60 * 60 * 24));
  
    var variable2 = document.getElementById("my-element2");
    variable2.innerText = variable;
  }
  
  f1();
  f2();