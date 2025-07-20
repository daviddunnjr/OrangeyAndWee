function categoryFilter(category) {
    // Implement filtering logic here
     console.log("Filtering by category:", category);
}
function authorFilter(author) {
    // Implement filtering logic here
    console.log("Filtering by author:", author);
}
function clearFilters() {
    // Implement logic to clear filters
    console.log("Clearing all filters");
}
function getCategories() {
    // This function should return an array of categories
    return ["Category 1", "Category 2", "Category 3"];
}

function loadHeader() {
    // Try to fetch 'header.html', if it fails, try '../../header.html'
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('header.html not found');
            return response.text();
        })
        .catch(() => {
            // Try the fallback path
            return fetch('../../header.html')
                .then(response => {
                    if (!response.ok) throw new Error('../../header.html not found');
                    return response.text();
                });
        })
        .then(data => {
            document.querySelector('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}

function loadPosts() {
    // Fetch the table of contents JSON file
    fetch('api/toc.json')
        .then(response => response.json())
        .then(posts => {
            console.log(posts); // See what you actually get
            posts.forEach(post => {
                fetch(`api/${post}.json`)
                    .then(response => response.json())
                    .then(data => {
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
                            <a href="?id=${post}" class="read-more">View Post</a>
                        `;
                        document.querySelector('main').appendChild(postElement);
                    })
                    .catch(error => console.error(`Error loading post ${post}:`, error));
            });
        })  
    }

function loadFooter() {
    // Try to fetch 'footer.html', if it fails, try '../../footer.html'
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('footer.html not found');
            return response.text();
        })
        .catch(() => {
            // Try the fallback path
            return fetch('../../footer.html')
                .then(response => {
                    if (!response.ok) throw new Error('../../footer.html not found');
                    return response.text();
                });
        })
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}