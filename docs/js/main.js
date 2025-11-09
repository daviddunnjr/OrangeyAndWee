function loadPosts() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const author = params.get('author');
    const tag = params.get('tag');
    const id = params.get('id');

    const pageSize = 10;
    let currentIndex = 0;
    let filtered = [];

    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    // Create Load More button (hidden until needed)
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load more';
    loadMoreBtn.className = 'load-more';
    loadMoreBtn.style.display = 'none';
    loadMoreBtn.addEventListener('click', () => {
        renderNextPage();
    });
    // Ensure button is after main content
    mainEl.parentNode.insertBefore(loadMoreBtn, mainEl.nextSibling);

    // Fetch the table of contents JSON file
    fetch('api/toc.json')
        .then(response => response.json())
        .then(posts => {
            // Fetch all post data in order
            const postPromises = posts.map(post =>
                fetch(`api/${post}.json`).then(res => res.json()).then(data => ({ postId: post, data })).catch(() => null)
            );
            Promise.all(postPromises).then(results => {
                // Build filtered list preserving TOC order and skipping failed fetches
                filtered = results
                    .filter(item => item && item.data) // skip nulls
                    .filter(item => {
                        const data = item.data;
                        if (author && data.author !== author) return false;
                        if (tag && (!Array.isArray(data.tags) || !data.tags.includes(tag))) return false;
                        if (id && data.id !== id) return false;
                        return true;
                    });

                // If nothing to show, optionally show a message
                if (filtered.length === 0) {
                    const msg = document.createElement('p');
                    msg.className = 'no-results';
                    msg.textContent = 'No posts found.';
                    mainEl.appendChild(msg);
                    loadMoreBtn.style.display = 'none';
                    return;
                }

                // Start rendering first page
                renderNextPage();
            });
        });

    function renderNextPage() {
        const slice = filtered.slice(currentIndex, currentIndex + pageSize);
        slice.forEach((item, idx) => {
            const data = item.data;
            // Defensive defaults
            data.tags = Array.isArray(data.tags) ? data.tags : [];
            const postElement = document.createElement('article');

            const transcriptionHtml = data.transcription ? 'Transcription: <span class="transcription">' + data.transcription + '</span>' : '';

            postElement.innerHTML = `
                <h3 id="${data.id}">${data.title}</h3>
                <div class="blur-bg" style="background-image:url(images/${data.image})">
                    <a href="images/${data.image}" target="_blank">
                        <img src="images/${data.image}" alt="${data.title}" class="post-image"/>
                    </a>
                </div>
                <div class="caption">
                    <p class="description">${data.description || ''}</p>
                    <p>${transcriptionHtml}</p>
                </div>
                <div class="post-meta">
                    <p class="author">
                        <img src="images/${data.author}.png"/>
                        <a href="?author=${data.author}">${data.author}</a>
                    </p>
                    <p class="date">${data.date || ''}</p>
                    <ul class="tags">
                        ${data.tags.map(t => `<li><a href="?tag=${t}">#${t}</a></li>`).join('')}
                    </ul>
                </div>
                <a href="?id=${item.postId}" class="read-more">View Post</a>
            `;
            mainEl.appendChild(postElement);
        });

        currentIndex += slice.length;

        // Show or hide the load more button
        if (currentIndex < filtered.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Initialize functions on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});