const API_URL = `http://localhost:8080`

function fetchGameData() {
    fetch(`${API_URL}/api/games`)
        .then((res) => {
            //console.log("res is ", Object.prototype.toString.call(res));
            return res.json();
        })
        .then((data) => {
            showGameList(data)
        })
        .catch((error) => {
            console.log(`Error Fetching data : ${error}`)
            document.getElementById('posts').innerHTML = 'Error Loading Game Data'
        })
}


function fetchGame(id) {
    fetch(`${API_URL}/api/games/${id}`)
        .then((res) => {
            //console.log("res is ", Object.prototype.toString.call(res));
            return res.json();
        })
        .then((data) => {
            showGameDetail(data)
        })
        .catch((error) => {
            console.log(`Error Fetching data : ${error}`)
            document.getElementById('posts').innerHTML = 'Error Loading Single Ticket Data'
        })
}

function parseGameId() {
    try {
        var url_string = (window.location.href).toLowerCase();
        var url = new URL(url_string);
        var gameid = url.searchParams.get("id");
        // var geo = url.searchParams.get("geo");
        // var size = url.searchParams.get("size");
        // console.log(name+ " and "+geo+ " and "+size);
        return gameid
      } catch (err) {
        console.log("Issues with Parsing URL Parameter's - " + err);
        return "0"
      }
}
// takes a UNIX integer date, and produces a prettier human string
function dateOf(date) {
    const milliseconds = date * 1000 // 1575909015000
    const dateObject = new Date(milliseconds)
    const humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15
    return humanDateFormat
}

function showGameList(data) {
    // the data parameter will be a JS array of JS objects
    // this uses a combination of "HTML building" DOM methods (the document createElements) and
    // simple string interpolation (see the 'a' tag on title)
    // both are valid ways of building the html.
    const ul = document.getElementById('posts');
    const list = document.createDocumentFragment();

    data.map(function(post) {
        console.log("Game:", post);
        let li = document.createElement('li');
        let title = document.createElement('h3');
        let body = document.createElement('p');
        let by = document.createElement('p');
        title.innerHTML = `<a href="/gamedetail.html?id=${post.id}">${post.name}</a>`;
        body.innerHTML = `${post.category}`;
        //let postedTime = dateOf(post.time)
        by.innerHTML = `${post.minPlayers} - ${post.maxPlayers}`;

        li.appendChild(title);
        li.appendChild(body);
        li.appendChild(by);
        list.appendChild(li);
    });

    ul.appendChild(list);
}

function showGameDetail(post) {
    // the data parameter will be a JS array of JS objects
    // this uses a combination of "HTML building" DOM methods (the document createElements) and
    // simple string interpolation (see the 'a' tag on title)
    // both are valid ways of building the html.
    const ul = document.getElementById('post');
    const detail = document.createDocumentFragment();

    console.log("Game:", post);
    let li = document.createElement('div');
    let title = document.createElement('h2');
    let body = document.createElement('p');
    let by = document.createElement('p');
    title.innerHTML = `${post.name}`;
    body.innerHTML = `${post.category}`;
    //let postedTime = dateOf(post.time)
    by.innerHTML = `${post.minPlayers} - ${post.maxPlayers}`;

    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(by);
    detail.appendChild(li);

    ul.appendChild(detail);
}

function handlePages() {
    let gameid = parseGameId()
    console.log("ticketId: ",gameid)

    if (gameid != null) {
        console.log("found a gameId")
        fetchGame(gameid)
    } else {
        console.log("load all games")
        fetchGameData()
    }
}

handlePages()
