$(document).ready(function(){

    /* # Show spinner untill everything's loaded. */
    $('.spinner').show();

    /* # Make videos responsive. */
    $('.post').fitVids();

    /* # Open/close menu. */
	$('.nav-control').click(function(){
		$('body').toggleClass('nav-open');
	});

  $('.main-nav a').click(function() {
    $('body').toggleClass('nav-open');
  });

    /* Make specific links open in a new window in a HTML5 valid way */
	$('a[rel*="external"]').click(function(){
		$(this).attr('target', '_blank');
	})

    /* Since Ghost does not support a post featured image yet, make an specific image the featured one. Thanks to Thomas Cullen (@ThomasCullen92) for this workaround. */
	mainImage = $('img[alt="cover-image"]');
    if ( mainImage.length > 0){
        mainImageSource = mainImage.attr('src');
        $('#main-sidebar').css('background', 'url('+mainImageSource+')');
        mainImage.remove();
    }

  window.history.pushState($('html')[0].outerHTML, "", window.location.href);

  // Register onClick event
  function init(all) {
    var listener = function(e) {
      var href = $(this).attr('href');
      if (href.startsWith(window.location.protocol + "//" + window.location.host) ||
        (!href.startsWith('http://') && !href.startsWith('https://'))) {

        e.preventDefault();
        $('.spinner').show();
        $.get(href, null, function(res) {
          renderPage(res, href);
        });
      }
    };

    if (all) {
      $('a').click(listener);
    } else {
      $('#main a').click(listener);
    }
  }

  function renderPage(res, href) {
    var args = arguments;
    $('#main').fadeOut(function() {
      $('#main').html($(res).find('#main').html()).fadeIn(function() {
        // Re-run Prism.js
        Prism.highlightAll();
      });
      $('.spinner').hide();

      if ($('#disqus_thread') != null) {
        disqus_identifier = $(res).filter('meta[name=postId]').attr('content');
        reloadDisqus();
      }

      var title = $(res).filter('title').text();
      $(document).prop('title', title);

      if (args.length == 2) {
        window.history.pushState(res, "", href);
      }

      init(false);
    });
  }

  window.onpopstate = function(e) {
    renderPage(e.state);
  };

  init(true);

});

$(window).load(function(){

    /* # All loaded, hide spinner. */
	$('.spinner').hide();

});
