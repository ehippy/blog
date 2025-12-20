//
// Journal JS - Simplified
//

(function ($) {
	'use strict';

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Page Functions

	function pageFunctions() {

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Show content
		$('body').removeClass('loading');

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Active links
		// Switch active link states
		$('.active-link').removeClass('active-link');
		var currentPath = window.location.pathname;
		$('a[href="' + currentPath + '"]').addClass('active-link');

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Images
		$('.single p > img').each( function() {
			var thisP = $(this).parent('p');
			$(this).insertAfter(thisP);
			$(this).wrapAll('<div class="image-wrap"></div>');
			thisP.remove();
		});
	}

	// Run functions on load
	pageFunctions();

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Menu

	$(document).on('click', '.js-menu-toggle', function (){
		// If already open
		if ( $('body').hasClass('menu--open') ) {
			$('body').removeClass('menu--open');
		}
		// If not open
		else {
			$('body').addClass('menu--open');
		}
	});

	$(document).on('click', '.menu__list__item__link', function (){
		// If menu is open when you click a link on mobile
		if ( $('body').hasClass('menu--open') ) {
			$('body').removeClass('menu--open');
		}
	});
	
}(jQuery));