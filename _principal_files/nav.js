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

    // ---- collapsible content tree ----
    // Opt-in per page: add class "tree-doc" to the .wrap. The walker turns every
    // h2/h3 into a collapsible node. Collapsing an h2 folds it AND every h3 under it;
    // collapsing an h3 folds only its own content. Convention-free: works on any
    // lesson that uses semantic <h2>/<h3> for its sections.
    setupLessonTabs();
    buildContentTree();
  });

  // ---- Old/New tabs (classic design problems carry both) ----
  // Markup: <div class="lesson-tabs"><button data-tab="new">…</button>…</div>
  //         <div class="tab-pane tree-doc" data-tab="new">…</div>
  //         <div class="tab-pane" data-tab="old">…</div>
  function setupLessonTabs(){
    var tabs = document.querySelector('.lesson-tabs');
    if(!tabs) return;
    var panes = [].slice.call(document.querySelectorAll('.tab-pane'));
    function show(which){
      tabs.querySelectorAll('button').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-tab')===which);
      });
      panes.forEach(function(p){
        p.classList.toggle('hidden', p.getAttribute('data-tab')!==which);
      });
    }
    tabs.addEventListener('click', function(e){
      var w = e.target.getAttribute && e.target.getAttribute('data-tab');
      if(w) show(w);
    });
    show('new');  // New is the default experience
  }

  function buildContentTree(){
    // Target the tree-doc container — either the .wrap itself (plain lessons)
    // or a .tab-pane.tree-doc (classic problems with Old/New tabs).
    var wrap = document.querySelector('.tree-doc');
    if(!wrap) return;
    var level = function(el){ return el.tagName==='H2' ? 2 : (el.tagName==='H3' ? 3 : 0); };
    var kids = [].slice.call(wrap.children);   // static snapshot taken before any DOM mutation

    // For each heading, wrap the following siblings (up to the next heading of
    // equal-or-higher level) in a .node-body, and prepend a caret to the heading.
    for(var i=0;i<kids.length;i++){
      var h = kids[i], lv = level(h);
      if(!lv) continue;
      var body = document.createElement('div');
      body.className = 'node-body';
      // Determine the body range from the static snapshot first…
      var j = i+1, range = [];
      while(j < kids.length){
        var lj = level(kids[j]);
        if(lj && lj <= lv) break;            // next heading at this level-or-higher ends the body
        range.push(kids[j]);
        j++;
      }
      // …then insert the (empty) body right after the heading, and move the range into it.
      h.parentNode.insertBefore(body, h.nextSibling);
      range.forEach(function(n){ body.appendChild(n); });

      h.classList.add('node-head');
      h.setAttribute('tabindex','0');
      h.setAttribute('role','button');
      var caret = document.createElement('span');
      caret.className = 'caret';
      caret.setAttribute('aria-hidden','true');
      h.insertBefore(caret, h.firstChild);

      (function(head, bodyEl){
        function toggle(){
          var collapsed = head.classList.toggle('collapsed');
          bodyEl.classList.toggle('hidden', collapsed);
          head.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
        head.addEventListener('click', function(e){
          // don't hijack clicks on links inside the heading
          if(e.target.closest('a')) return;
          toggle();
        });
        head.addEventListener('keydown', function(e){
          if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); }
        });
        head.setAttribute('aria-expanded','true');
      })(h, body);
    }

    // "Collapse all / Expand all" control. On plain lessons it goes just under
    // the H1; on tabbed lessons (H1 lives outside the pane) it goes at the top
    // of the tree-doc pane itself.
    var h1 = wrap.querySelector('h1');
    {
      var bar = document.createElement('div');
      bar.className = 'tree-controls';
      bar.innerHTML = '<button type="button" data-act="collapse">&minus; Collapse all</button>'
                    + '<button type="button" data-act="expand">+ Expand all</button>';
      if(h1){ h1.parentNode.insertBefore(bar, h1.nextSibling); }
      else { wrap.insertBefore(bar, wrap.firstChild); }
      bar.addEventListener('click', function(e){
        var act = e.target.getAttribute && e.target.getAttribute('data-act');
        if(!act) return;
        var collapse = act==='collapse';
        wrap.querySelectorAll('.node-head').forEach(function(head){
          head.classList.toggle('collapsed', collapse);
          head.setAttribute('aria-expanded', collapse ? 'false':'true');
        });
        wrap.querySelectorAll('.node-body').forEach(function(b){ b.classList.toggle('hidden', collapse); });
      });
    }
  }
})();
