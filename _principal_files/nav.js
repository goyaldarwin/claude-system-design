// Mobile sidebar toggle. Injected on every lesson page.
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }
  ready(function(){
    var btn=document.querySelector('.menu-btn'), scrim=document.querySelector('.scrim');
    if(btn){ btn.addEventListener('click',function(){ document.body.classList.toggle('nav-open'); }); }
    if(scrim){ scrim.addEventListener('click',function(){ document.body.classList.remove('nav-open'); }); }
    // scroll active item into view within the sidebar
    var a=document.querySelector('.sidebar a.active');
    if(a){ a.scrollIntoView({block:'center'}); }
  });
})();
