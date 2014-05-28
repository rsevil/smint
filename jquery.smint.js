/*

SMINT V1.0 by Robert McCracken
SMINT V2.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy (@mcpacosy)

SMINT is my first dabble into jQuery plugins!

http://www.outyear.co.uk/smint/

If you like Smint, or have suggestions on how it could be improved, send me a tweet @rabmyself

*/


(function($) {

	$.fn.smint = function( options ) {

		var $smint = this,
			$window = $(window),
			settings = $.extend({}, $.fn.smint.defaults, options),
			$smintItems = $smint.find('a').not(settings.ignoreItemsSelector),
			// Set the variables needed
			optionLocs = [],
			lastScrollTop = 0,
			menuHeight = $smint.height(),
			curi = 0,
			stickyTop = $smint.offset().top,
			$smintSections = $();
			
		var stickyMenu = function(scrollingDown) {
			// current distance top
			var scrollTop = $(window).scrollTop();
			var css = {};
			// if we scroll more than the navigation, change its position to fixed and add class 'fxd', 
			// otherwise change it back to absolute and remove the class
			if (scrollTop > stickyTop) {
				//Check if he has scrolled horizontally also.
				if ($(window).scrollLeft()) {
					css = { 'position': 'fixed', 'top': 0, 'left': -$(window).scrollLeft() };
				}
				else {
					css = { 'position': 'fixed', 'top': 0, 'left': 'auto' };
				}
			}
			else {
				css = { 'position': 'absolute', 'top': stickyTop, 'left': 'auto' };
			}
			
			$smint.css(css);
			if (scrollTop > stickyTop){
				$smint.addClass(settings.menuStikyClass);
			}else{
				$smint.removeClass(settings.menuStikyClass);
			}
			if (!scrollingDown) {
				while (true) {
					if (scrollTop >= optionLocs[curi].top) {
						$smintItems.removeClass(settings.menuActiveItemClass);
						$smintSections.removeClass(settings.sectionActiveClass);
						
						optionLocs[curi].$item.addClass(settings.menuActiveItemClass);
						$(optionLocs[curi].$item.attr('href')).addClass(settings.sectionActiveClass);
						break;
					}
					curi--;
				}
			}
			else {
				while (true) {
					if (scrollTop < optionLocs[curi].bottom) {
						$smintItems.removeClass(settings.menuActiveItemClass);
						$smintSections.removeClass(settings.sectionActiveClass);
						
						optionLocs[curi].$item.addClass(settings.menuActiveItemClass);
						$(optionLocs[curi].$item.attr('href')).addClass(settings.sectionActiveClass);
						break;
					}
					curi++;
				}
			}
		};

		// run function every time you scroll but not needed to be run for each of the $smintItems
		$(window).scroll(function() {
			//Get the direction of scroll	
			var st = $(this).scrollTop(),
				scrollingDown = (st > lastScrollTop);
			lastScrollTop = st;
			stickyMenu(scrollingDown);

			// Check if at bottom of page, if so, add class to last <a> as sometimes the last div
			// isnt long enough to scroll to the top of the page and trigger the active state.
			if ($(window).scrollTop() + $(window).height() == $(document).height()) {
				$smintItems.removeClass(settings.menuActiveItemClass);
				$smintItems.last().addClass(settings.menuActiveItemClass);
			}
		}).on('hashchange', function(e){
			e.preventDefault();
			if((window.location.hash) && (window.location.hash != "#")) {
				// Scroll instantly to the set hash adding the height of the menu
				$(this).scrollTop($(window.location.hash).position().top - menuHeight);
			}
		});
		
		$smintItems.first().addClass(settings.menuActiveItemClass);

		// This function assumes that the elements are already in a sorted manner.
		$smintItems.each(function() {
			var $this = $(this);
			
			// No need to even add to optionLocs
			if ($(this).filter(settings.ignoreAllItemsSelector).length) {
				return;
			}
			
			//Fill the menu
			var href = $this.attr("href");
			
			var id = href,
				matchingSection = $(id),
				sectionTop = matchingSection.position().top,
				hash = null;
				
			if(href.indexOf('#') >= 0) {
				hash = href.substr(href.indexOf('#') + 1);
			}
			var item = {
				top: sectionTop - menuHeight,
				bottom: parseInt(matchingSection.height()) + sectionTop - menuHeight, //Added so that if he is scrolling down and has reached 90% of the section.
				$item: $this,
				hash: hash
			}
			
			optionLocs.push(item);
			
			$smintSections = $smintSections.add($(this).attr('href'));

			$(this).click(function(e) {
				// stops empty hrefs making the page jump when clicked
				// Added after the check of smint-disableAll so that if its an external href it will work.
				e.preventDefault();
				if ($(this).filter('.' + settings.menuActiveItemClass).length){
					return;
				}
				// Scroll the page to the desired position!
				$("html, body").animate({ scrollTop: sectionTop - menuHeight}, settings.scrollSpeed);
			});
		});

		if((window.location.hash) && (window.location.hash != "#")) {
			// Scroll to the set hash.
			$smintItems
				.filter('a[href=' + window.location.hash + ']')
				.click();
		}
		
		this.data('smint-optionLocs', optionLocs);
		
	}

	$.fn.smint.defaults = { 
		scrollSpeed: 500,
		ignoreItemsSelector: '.smint-disable',
		ignoreAllItemsSelector: '.smint-disableAll',
		menuActiveItemClass: 'active',
		sectionActiveClass: 'active',
		menuStikyClass: 'fxd'
	};

})(jQuery);
