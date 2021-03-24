const form = document.querySelector('form'); // grabbing an element on the page
const errorElement = document.querySelector('.error-message');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const loadMoreElement = document.querySelector('#loadMore');
const API_URL = 'https://tpgitminiblog.herokuapp.com/posts';

/*const { Credential } = require('./login.js');
console.log(Credential);*/

let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

errorElement.style.display = 'none';

document.addEventListener('scroll', () => {
    const rect = loadMoreElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && !loading && !finished) {
        loadMore();
    }
});

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    var created = new Date();

    if (name.trim() && content.trim()) {
        errorElement.style.display = 'none';
        form.style.display = 'none';
        loadingElement.style.display = '';

        const mew = {
            name,
            content,
            created
        };

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(mew),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType.includes('json')) {
                    return response.json().then(error => Promise.reject(error.message));
                } else {
                    return response.text().then(message => Promise.reject(message));
                }
            }
        }).then(() => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000);
            listAllMews();
        }).catch(errorMessage => {
            form.style.display = '';
            errorElement.textContent = errorMessage;
            errorElement.style.display = '';
            loadingElement.style.display = 'none';
        });
    } else {
        errorElement.textContent = 'Content is missing..';
        errorElement.style.display = '';
        setTimeout(function() {
            errorElement.style.display = 'none';
        }, 3000);
    }
});

function loadMore() {
    skip += limit;
    listAllMews(false);
}

function listAllMews(reset = true) {
    loading = true;
    if (reset) {
        mewsElement.innerHTML = '';
        skip = 0;
        finished = false;
    }
    var table = document.getElementById('table')
    fetch('https://tpgitminiblog.herokuapp.com/posts')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            length = data.length;
            for (var i = length - 1; i >= 0; i--) {

                const div = document.createElement('div');

                const header = document.createElement('a');
                header.setAttribute('href', './profile.html');
                header.setAttribute('target', '_blank');
                header.setAttribute('class', 'name');
                header.innerHTML = data[i].name
                    //header.textContent = data[i].name;

                const contents = document.createElement('p');
                contents.textContent = data[i].content;

                const date = document.createElement('small');
                date.textContent = new Date(data[i].created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                mewsElement.appendChild(div);

            }
        })
        .catch(function(error) {
            console.log(error);
        });
}