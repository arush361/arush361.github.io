document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".loader").style.visibility = "visible";
    	$('html, body').css({
	  'overflow': 'hidden',
	  'height': '100%'
	})
    } else {
        document.querySelector(".loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
	$('html, body').css({
	  'overflow': 'auto',
	  'height': 'auto'
	})
    }
};

jQuery(document).ready(function(){
  var viewPortWidth = jQuery(window).width();
  var viewPortHeight = jQuery(window).height();
  var navPos = jQuery("#papa-nav").offset().top;

  jQuery(window).resize(allResizeFunctions());

  // onClick functions for the hamburger menu
  displayHamburgerMenu();
  AOS.init({});

  // Scroll to point
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 96
        }, 1000);
        return false;
      }
    }
  });

  // Typed animation
  $(".typed").typed({
        strings: [
        "Building identity platforms for humans and AI agents at PointClickCare.",
        "Previously: PokerStars (72M+ users), Amdocs, IDFC First Bank, BNY Mellon.",
        "10+ years across Product Management, Software Engineering & Platform Strategy.",
        "I speak 4 languages: English, German, Hindi, and Punjabi.",
        "AWS Certified Solutions Architect. MBA from MDI Gurgaon."],
        typeSpeed: 0,
        startDelay: 1000,
        backDelay: 4000,
        showCursor: true,
        loopCount: 10000,
        loop: true,
        typeSpeed: -2,
        shuffle: false
      });

  jQuery(window).scroll(function(){
    var scrollPos = jQuery(window).scrollTop();
    var logoOpacity = opacityControl((4*scrollPos)/(viewPortWidth*3));
    var introOpacity = opacityControl(1 - (scrollPos-200)*2/viewPortHeight);
    $('.logo').css({
        'opacity' : logoOpacity
    });

    if (viewPortWidth > 767){
      moveInClass('.project');
      moveInClass('.skill');
    }

    // Parallax for intro
    $('.intro').css({
      'transform' : 'translate(0px, ' + scrollPos/16 + '%)'
    });
    $('.intro').css({
      'opacity' : introOpacity
    });

    if (scrollPos >= (navPos)){
      jQuery(".nav-wrap").addClass("fixed");
    }
    else{
      jQuery(".nav-wrap").removeClass("fixed");
    }
  });

});

function opacityControl(opacityMeasure){
  if (opacityMeasure < 1 && opacityMeasure >= 0) return opacityMeasure;
  else if (opacityMeasure > 1) return 1;
  else if (opacityMeasure < 0) return 0;
}

function displayHamburgerMenu(){
  $( ".ham-nav-link" ).click(function() {
    $('#slide-menu-toggler').trigger('click');
  });
}

function moveInClass(classToAnimate){
  var scrollPos = jQuery(window).scrollTop();
  var viewPortHeight = jQuery(window).height();
  $(classToAnimate).each(function(){
    if (scrollPos > $(this).offset().top - (14*viewPortHeight/15)){
      $(this).addClass('appear');
    }
    else {
      $(this).removeClass('appear');
    };
  });
}

function allResizeFunctions(){
  var viewPortWidth = jQuery(window).width();
  var viewPortHeight = jQuery(window).height();
}
