//
// Journal JS - Simplified (Vanilla JS)
//

function pageFunctions() {
	// Active links - highlight current page
	document.querySelectorAll('.active-link').forEach(el => el.classList.remove('active-link'));
	const currentPath = window.location.pathname;
	const currentLink = document.querySelector(`a[href="${currentPath}"]`);
	if (currentLink) currentLink.classList.add('active-link');

	// Images - extract from paragraphs and wrap
	document.querySelectorAll('.single p > img').forEach(img => {
		const p = img.parentElement;
		const wrap = document.createElement('div');
		wrap.className = 'image-wrap';
		p.parentElement.insertBefore(wrap, p.nextSibling);
		wrap.appendChild(img);
		p.remove();
	});
}

// Run on load
pageFunctions();

// Menu toggle
document.addEventListener('click', function(e) {
	if (e.target.closest('.js-menu-toggle')) {
		document.body.classList.toggle('menu--open');
	}

	if (e.target.closest('.menu__list__item__link') && document.body.classList.contains('menu--open')) {
		document.body.classList.remove('menu--open');
	}
});