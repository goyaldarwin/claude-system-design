// Mobile sidebar toggle + dark-mode toggle. Injected on every lesson page.
// NOTE: the theme is APPLIED pre-paint by a small inline <head> script (see each page)
// to avoid a flash of the wrong theme. This file only builds the toggle UI + reacts to clicks.
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    var b=document.querySelector('.theme-toggle');
    if(b){ b.textContent = t==='dark' ? '☀️' : '\u{1F319}';
           b.setAttribute('aria-label', t==='dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
  }
  function currentTheme(){
    return document.documentElement.getAttribute('data-theme')
        || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setCollapsed(on){
    document.documentElement.classList.toggle('nav-collapsed', on);
    try{ localStorage.setItem('sd-nav', on ? 'collapsed' : 'open'); }catch(e){}
  }

  ready(function(){
    // ---- mobile sidebar ----
    var btn=document.querySelector('.menu-btn'), scrim=document.querySelector('.scrim');
    if(btn){ btn.addEventListener('click',function(){ document.body.classList.toggle('nav-open'); }); }
    if(scrim){ scrim.addEventListener('click',function(){ document.body.classList.remove('nav-open'); }); }
    var a=document.querySelector('.sidebar a.active');
    if(a){ a.scrollIntoView({block:'center'}); }

    // ---- desktop sidebar collapse ----
    var sidebar=document.querySelector('.sidebar');
    if(sidebar){
      var col=document.createElement('button');
      col.className='collapse-btn'; col.type='button';
      col.innerHTML='&#171;';  // «
      col.setAttribute('aria-label','Collapse sidebar');
      var brand=sidebar.querySelector('.brand') || sidebar;
      brand.appendChild(col);
      col.addEventListener('click',function(){ setCollapsed(true); });

      var reopen=document.createElement('button');
      reopen.className='sidebar-reopen'; reopen.type='button';
      reopen.innerHTML='&#8250;';  // ›
      reopen.setAttribute('aria-label','Show sidebar');
      document.body.appendChild(reopen);
      reopen.addEventListener('click',function(){ setCollapsed(false); });
    }

    // ---- dark-mode toggle ----
    var tgl=document.createElement('button');
    tgl.className='theme-toggle';
    tgl.type='button';
    document.body.appendChild(tgl);
    applyTheme(currentTheme());
    tgl.addEventListener('click',function(){
      var next = currentTheme()==='dark' ? 'light' : 'dark';
      try{ localStorage.setItem('sd-theme', next); }catch(e){}
      applyTheme(next);
    });
  });
})();
