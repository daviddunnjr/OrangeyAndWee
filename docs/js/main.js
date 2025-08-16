function loadPosts() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const author = params.get('author');
    const tag = params.get('tag');
    const id = params.get('id');

    // Fetch the table of contents JSON file
    fetch('api/toc.json')
        .then(response => response.json())
        .then(posts => {
            // Fetch all post data in order
            const postPromises = posts.map(post =>
                fetch(`api/${post}.json`).then(res => res.json()).catch(error => null)
            );
            Promise.all(postPromises).then(postDataArray => {
                postDataArray.forEach((data, i) => {
                    if (!data) return; // skip failed fetches

                    // Filtering logic before rendering
                    if (author && data.author !== author) return;
                    if (tag && !data.tags.includes(tag)) return;
                    if (id && data.id !== id) return;

                    const postElement = document.createElement('article');
                    postElement.innerHTML = `
                        <h3 id="${data.id}">${data.title}</h3>
                        <div class="blur-bg" style="background-image:url(images/${data.image})"><img src="images/${data.image}" href="images/${data.image}" alt="${data.title}" class="post-image"/></div>
                        <p class="description">${data.description}</p>
                        <div class="post-meta">
                        <p class="author"><img src="images/${data.author}.png"/><a href="?author=${data.author}">${data.author}</a></p>
                        <p class="date">${new Date(data.date).toLocaleDateString()}</p>
                        <ul class="tags">
                            ${data.tags.map(tag => `<li><a href="?tag=${tag}">#${tag}</a></li>`).join('')}
                        </ul>
                        </div>
                        <a href="?id=${posts[i]}" class="read-more">View Post</a>
                    `;
                    document.querySelector('main').appendChild(postElement);
                });
            });
        })  
}

function filterPosts() {
    //if page loads with parameters in url, filter out posts that dont include the specified author, tags, or id.

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const author = params.get('author');
    const tag = params.get('tag');
    const id = params.get('id');

    // Get all post articles
    const articles = document.querySelectorAll('main article');
    articles.forEach(article => {
        let show = true;

        // Filter by author
        if (author) {
            const authorElem = article.querySelector('.author a');
            if (!authorElem || authorElem.textContent !== author) {
                show = false;
            }
        }

        // Filter by tag
        if (tag) {
            const tagElems = article.querySelectorAll('.tags li a');
            let hasTag = false;
            tagElems.forEach(tagElem => {
                if (tagElem.textContent.replace('#', '') === tag) {
                    hasTag = true;
                }
            });
            if (!hasTag) show = false;
        }

        // Filter by id
        if (id) {
            const postId = article.querySelector('h3').id;
            if (postId !== id) show = false;
        }

        // Show or hide the article
        article.style.display = show ? '' : 'none';
    });
}
