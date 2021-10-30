import { httpGetAsync } from "./httphelpers.js"

var booktable = document.getElementById("books_table")
var authors = {}

function load_authors(response) {
    var list = JSON.parse(response)

    list.forEach((el) => { authors[el.id] = el })
    httpGetAsync("/api/Books", load_books)
}

function load_books(response) {
    var list = JSON.parse(response)

    list.forEach((el, idx) => {
        let row = `<tr><td>${idx}</td> <td>${el.name}</td> <td>${authors[el.authorId].name}</td> </tr>`
        booktable.innerHTML += row
    })
}

httpGetAsync("/api/Authors", load_authors)
