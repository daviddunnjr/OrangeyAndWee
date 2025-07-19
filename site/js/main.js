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
    // get the list of posts from 'posts/toc.json'
    // the "posts" variable should be an array of post directories
    // for each directory, the post source file is at index.html in that directory
    // where this function is called, display the inner html of the article element from each file as new article elements
    fetch('posts/toc.json')
        .then(response => response.json())
        .then(posts => {
            console.log(posts); // See what you actually get
            const articleContainer = document.querySelector('.posts');
            posts.forEach(post => {
                fetch(`posts/${post}/index.html`)
                    .then(response => response.text())
                    .then(data => {
                        const articleElement = document.createElement('article');
                        articleElement.innerHTML = data;
                        articleContainer.appendChild(articleElement);
                    })
                    .catch(error => console.error(`Error loading post ${post}:`, error));
            });
        })
        .catch(error => console.error('Error loading posts:', error));
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