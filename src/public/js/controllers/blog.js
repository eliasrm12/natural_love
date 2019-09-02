(function(window,document){
    var count = 0;
    spa.controller('blog',{

        blog : {},
        posts : [],

        createPost : function(form){
            this.blog.title = form.title.value;
            this.blog.img = form.img.value;
            this.blog.info = form.info.value;

            count = count + 1;
            this.blog.id = count;
            this.posts.push(this.blog);
            this.blog = {};
            alert('Post creado con el id:' + count);
            form.reset(); 
        },
        deletePost : function(){},
        updatePost : function(){}, 
        loadPost : function(){
            var body = spa.get('show'),
                template,
                newfragment = document.createDocumentFragment(),
                max = this.posts.length,
                registro,clon,id,
                title,img,info,drop,update, self = this;


            body.innerHTML = '';

            for (let i = 0; i < max; i++) {

                registro = self.posts[i];

                title = document.createElement('h3');
                img = document.createElement('img');
                info = document.createElement('p');
                id = document.createElement('h5');

                id.textContent = registro.id; 
                title.textContent = registro.title;
                href = window.location.origin + window.location.pathname;
                img.src = '/img/placeholder.png'; console.log(registro.img);
                info.textContent = registro.info; 

                clone = document.createElement('div');

                clone.appendChild(title);
                clone.appendChild(img);
                clone.appendChild(info);
                clone.appendChild(id);
                newfragment.appendChild(clone);
                body.appendChild(newfragment);
            }
        }
    });
})(window,document)