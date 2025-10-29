$(function () {

  /* ===  Scroll progress bar === */
  const $bar = $("#scrollProgress");
  const setProgress = () => {
    const sT = $(window).scrollTop();
    const h = $(document).height() - $(window).height();
    const pct = h > 0 ? (sT / h) * 100 : 0;
    $bar.css("width", pct + "%");
  };
  setProgress();
  $(window).on("scroll resize", setProgress);

  /* ===  Real-time search + suggestions + highlight (about.html) === */
  const $input = $("#liveSearch");
  const $list  = $("#searchList li");
  const $sug   = $("#suggestions");

  if ($input.length) {
    const dict = $list.map(function(){return $(this).text().trim();}).get();
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const hi = ($el, term) => {
      if(!term){ $el.html($el.text()); return; }
      const re = new RegExp(`(${esc(term)})`,'ig');
      $el.html($el.text().replace(re,'<mark>$1</mark>'));
    };

    $input.on("input", function(){
      const q = $(this).val().toLowerCase().trim();
      $list.each(function(){
        const $li = $(this);
        const ok = $li.text().toLowerCase().includes(q);
        $li.toggle(ok); hi($li, q);
      });
      if(q){
        const items = dict.filter(v=>v.toLowerCase().includes(q)).slice(0,8);
        $sug.html(items.map(v=>`<li>${v}</li>`).join("")).toggle(items.length>0);
      } else {
        $sug.hide();
      }
    });
    $sug.on("click","li",function(){ $input.val($(this).text()).trigger("input"); $sug.hide(); });
    $(document).on("click",e=>{ if(!$(e.target).closest("#liveSearchWrap").length) $sug.hide(); });
  }

  /* ===  Animated number counters (index.html) === */
  $(".count").each(function(){
    const $n = $(this);
    const target = parseInt($n.text(),10)||0;
    $n.text("0");
    $({v:0}).animate({v:target},{
      duration:1500,
      step(now){$n.text(Math.ceil(now));}
    });
  });

  /* ===  Copy to clipboard (index.html) === */
  $("#copyBtn").on("click", async function(){
    const val = $("#copyText").val();
    try{
      await navigator.clipboard.writeText(val);
      toast("Copied ✔️");
    }catch{
      toast("Copy failed", true);
    }
  });

  /* ===  Contact form spinner (contacts.html) === */
  const $sendBtn = $("#sendBtn");
  $("#contactForm").on("submit", function(e){
    if(!$sendBtn.length) return;
    e.preventDefault();
    const original = $sendBtn.text();
    const loadingText = $sendBtn.data("loading")||"Please wait…";
    $sendBtn.addClass("btn-loading").text(loadingText);
    setTimeout(()=>{
      $sendBtn.removeClass("btn-loading").text(original);
      toast("Form submitted ✅");
      this.reset();
    },1000);
  });

  /* ===  Lazy images (gallery.html) === */
  const $lazy = $("img.lazy");
  if ($lazy.length){
    if("IntersectionObserver" in window){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const img = entry.target;
            const $img = $(img);
            const src = $img.data("src");
            if(src){
              $img.attr("src",src).on("load",()=> $img.addClass("loaded")).removeAttr("data-src");
            }
            io.unobserve(img);
          }
        });
      },{rootMargin:"200px 0px"});
      $lazy.each(function(){ io.observe(this); });
    }else{
      $lazy.each(function(){ $(this).attr("src",$(this).data("src")).addClass("loaded"); });
    }
  }

  /* ===  Toast helper === */
  function toast(msg, danger=false){
    const $t = $("#toast");
    if(!$t.length) return alert(msg);
    $t.stop(true,true)
      .text(msg)
      .css({background: danger ? "#8b0000" : "#111"})
      .fadeIn(150).delay(2000).fadeOut(220);
  }

});
