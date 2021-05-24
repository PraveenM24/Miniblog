const form = document.querySelector('form'); 
const errorElement = document.querySelector('.error-message');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const loadMoreElement = document.querySelector('#loadMore');
const API_URL = 'https://tpgitminiblog.herokuapp.com/posts';

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

        var mew = {
            name,
            content,
            created
        }

        const fdata = new FormData();
        fdata.append('name', name);
        fdata.append('content', content);
        fdata.append('created', created);

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
        setTimeout(function () {
            errorElement.style.display = 'none';
        }, 3000);
    }
});


function loadMore() {
    skip += limit;
    listAllMews(false);
}

function listAllMews(reset = true) {
    var combined_data = []
    loading = true;
    if (reset) {
        mewsElement.innerHTML = '';
        skip = 0;
        finished = false;
    }

    fetch('https://tpgitminiblog-api.herokuapp.com/api')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            combined_data.push(data);
        })
        .catch(function (error) {
            console.log(error);
        });

    fetch('https://tpgitminiblog.herokuapp.com/posts')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            combined_data.push(data);
            length = data.length;
            for (var i = 0; i < length; i++) {
                newDate = new Date(data[i].created).toString()
                data[i].created = newDate
            }

            var final = combined_data[0].concat(combined_data[1])
            final.sort((a, b) => {
                let da = new Date(a.created),
                    db = new Date(b.created);
                return da - db;
            });

            length_final = final.length;
            for (var i = length_final-1; i >= 0; i--) {

                const div = document.createElement('div');
                div.setAttribute('class', 'chatelement');

                const header = document.createElement('a');
                header.setAttribute('href', './profile.html');
                header.setAttribute('target', '_blank');
                header.setAttribute('class', 'name');
                header.innerHTML = final[i].name
                div.appendChild(header);
                

                const contents = document.createElement('p');
                contents.textContent = final[i].content;
                div.appendChild(contents);

                if (typeof(final[i].image) != "undefined") {
                    const image = document.createElement('IMG');
                    var url = 'https://tpgitminiblog-api.herokuapp.com/' + final[i].image;
                    image.setAttribute('src', url);
                    image.setAttribute("width", "100%");
                    image.setAttribute("height", "fit-content");
                    div.appendChild(image);
                }

                const date = document.createElement('small');
                date.textContent = new Date(final[i].created);
                div.appendChild(date);
                mewsElement.appendChild(div);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}