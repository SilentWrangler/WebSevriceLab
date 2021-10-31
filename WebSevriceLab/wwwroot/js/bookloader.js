import { httpDelAsync, httpGetAsync, httpPostAsync, httpPutAsync } from "./httphelpers.js"

//Elements
var booktable = document.getElementById("books_table")
var book_details = document.getElementById("book_details")
//Elements -- Book form
var book_id = document.getElementById("book_id")
var book_name = document.getElementById("book_name")
var book_author = document.getElementById("book_author")
var book_description = document.getElementById("book_description")

var book_close = document.getElementById("book_close")
var book_delete = document.getElementById("book_delete")
var book_submit = document.getElementById("book_submit")

var book_form = document.getElementById("book_window_form")
//-------------------------------
var open_create = document.getElementById("open_create")
var book_create = document.getElementById("book_create")
var cbook_author = document.getElementById("cbook_author")
var cbook_close = document.getElementById("cbook_close")
var cbook_submit = document.getElementById("сbook_submit")
var create_form = document.getElementById("cbook_window_form")
//---------
var authors = {}

var current_book_id=0

function load_authors(response) {
    var list = JSON.parse(response)

    list.forEach((el) => {
        authors[el.id] = el
        let option = document.createElement("option")
        let option2 = document.createElement("option")
        option.innerText = el.name
        option.value = el.id
        option2.innerText = el.name
        option2.value = el.id
        book_author.add(option)
        cbook_author.add(option2)
    })
    httpGetAsync("/api/Books", load_books)
}

function load_books(response) {
    var list = JSON.parse(response)

    //Очищаем таблицу
    booktable.innerHTML = "<tr> \
            <td>#</td> \
            <td>Название</td>\
            <td>Автор</td>\
        </tr >"
    list.forEach((el, idx) => {
        //let row = `<tr><td>${idx}</td> <td>${el.name}</td> <td>${authors[el.authorId].name}</td> </tr>`
        let tr = document.createElement("tr") // make row

        //add number
        let number = document.createElement("td")
        number.innerText = `${idx}`
        tr.appendChild(number)

        //add name
        let name_td = document.createElement("td")
        let name = document.createElement("a")
        name.innerText = el.name
        name.addEventListener("click", nameClickHandlerFactory(el.id)) //create and add function that opens PUT form window
        name_td.appendChild(name)
        tr.appendChild(name_td)


        //add author
        let author = document.createElement("td")
        author.innerText = authors[el.authorId].name
        tr.appendChild(author)

        booktable.appendChild(tr)
    })
}

httpGetAsync("/api/Authors", load_authors)


function nameClickHandlerFactory(bookid) {
    function nameClickHandler(event) {
        event.preventDefault();
        book_details.style.left = `${event.pageX}`
        book_details.style.top = `${event.pageY}`
        bookdetails(bookid)
    }

    return nameClickHandler
}

function bookdetails(bookid) {
    current_book_id = bookid
    httpGetAsync(`/api/Books/${bookid}`, load_book_details)
}


function on_book_update(response) {
    console.log("Book updated")
    httpGetAsync(`/api/Books/${current_book_id}`, load_book_details)
    httpGetAsync("/api/Books", load_books)
}

function update_book() {
    let data = new FormData(book_form)
    httpPutAsync(`/api/Books/${current_book_id}`, on_book_update, stringifyFormdata(data))
}

function stringifyFormdata(data) {
    let debug = {}
    data.forEach((v, k) => { debug[k] = v })
    return JSON.stringify(debug)
}

book_submit.addEventListener("click", (ev) => {
    update_book()
})

function delete_book() {
    httpDelAsync(`/api/Books/${current_book_id}`, on_book_delete)
    close_detail()
}

function on_book_delete(response) {
    httpGetAsync("/api/Books", load_books)
}

book_delete.addEventListener("click", (ev) => {
    if (confirm("Точно удалить книгу?")) {
        delete_book()
    }
})

function load_book_details(response) {
    let book = JSON.parse(response)

    book_id.value = book.id
    book_name.value = book.name
    book_description.innerText = book.description
    book_details.classList.add("open")
}

//Button to close window
function close_detail() {
    book_details.classList.remove("open")
    current_book_id = 0;
}

book_close.addEventListener("click", (ev) => {
    ev.preventDefault()
    close_detail()
})

open_create.addEventListener("click", (ev) => {
    book_create.classList.add("open")
})

cbook_close.addEventListener("click", (ev) => {
    book_create.classList.remove("open")
})

function on_book_create(r) {
    httpGetAsync("/api/Books", load_books)
}

cbook_submit.addEventListener("click", (ev) => {
    let data = new FormData(create_form)
    httpPostAsync("/api/Books", on_book_create, stringifyFormdata(data))
})