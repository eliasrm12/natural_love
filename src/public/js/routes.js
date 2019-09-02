(function (window , document) {
	
	spa.getId('view').router()
		.route('/','/views/home.html', null, null)
		.route('/galery','/views/galery/galery.html', null, function(){
			createProducts();
		})
		.route('/blog', '/views/blog/blog.html', 'blog', function(){
			//spa.getCurrentControl().loadPost();
			createProducts();
		})
		.route('/create', '/views/blog/create.html', 'blog', function(){
			spa.getId('createpost');
		})
		.route('/update', '/views/blog/update.html', null, null);

})(window,document);




// Generating content based on the template
var template = "<div class='prod'>\n\
					<div class='con1'>\n\
						<img class='image' src='img/placeholder.png' data-src='SLUG' alt='NAME'>\n\
					</div>\n\
					<div class='info'>\n\
						<p>INFO</p>\n\
					</div>\n\
				</div>";


function createProducts(){
	let content = '';

	let href = window.location.origin + window.location.pathname;
	fetch(href+"js/info.json").then(function(response) {
		return response.json();
	  })
	  .then(function(response){
		createProduct(response);
	  })
	  .then(function(){
		document.getElementById('products').innerHTML = content;
		console.log('datos creados');
		render();
	  });

	  function createProduct(data) {
		data.forEach(el => {

			var entry = template.replace(/SLUG/g,el.img)
			.replace(/NAME/g,el.name)
			.replace(/INFO/g,el.datos);
			
			content += entry;
			
		});
		
	}

}

function render(){
	var imagesToLoad = document.querySelectorAll('img[data-src]');
	var loadImages = function(image) {
		image.setAttribute('src', image.getAttribute('data-src'));
		image.onload = function() {
			image.removeAttribute('data-src');
		};
	};
	console.log(imagesToLoad);

	if('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function(items, observer) {
			items.forEach(function(item) { 
				if(item.isIntersecting) {
					loadImages(item.target);
					observer.unobserve(item.target);
				}
			});
		});
		imagesToLoad.forEach(function(img) {
			observer.observe(img); 
		});
	}
	else {
		imagesToLoad.forEach(function(img) {
			loadImages(img);
		});
	}

	let show = document.querySelectorAll(".info");
	show.forEach(el=>{
		// Se usa una funcion anonima por que no afecta al this ya que la funcion flecha(=>) si lo hace
		el.onclick = function(e) { 
		this.classList.toggle("infomas");
		this.parentElement.classList.toggle("iz");
		this.firstElementChild.classList.toggle("dat");
		};
	});

}

