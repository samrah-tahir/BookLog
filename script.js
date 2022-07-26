
/** Note: library must have these funcs:
 * add book (O)
 * delete book
 * search book
 * Book should have:
 * get read status
 * create book by returning book object
 */

/**PURPOSE: create books
 * 
 */
function Book(image, title, author, pages, status){

    return {
        image: image,
        title: title,
        author: author,
        noOfPages: pages,
        status: status,
    }
}

/**PURPOSE: manipulate UI
 * 
 */
function UI(){
    const displayBooks = function(myLibrary){
        const bookBox = document.querySelector('#book-container');
        
        if(myLibrary){
            bookBox.innerText = '';
            myLibrary.forEach((book, index) => {
                bookBox.appendChild(createBookCard(book, index));
            });
        }
        
    }

    const createBookCard = function(book, index){
        const newBook = document.createElement('div');
        const bookDetails = document.createElement('div');
        const bookImg = document.createElement('div');
        const bookTitle = document.createElement('h5');
        const bookAuthor = document.createElement('p');
        const readStatusIndicator = document.createElement('div');
        const bookThumbnail = book.image;
        const bookDeleteBtn = document.createElement('button');
        bookDeleteBtn.type = 'button';
        bookDeleteBtn.innerText = 'Delete';

        bookDeleteBtn.classList.add('delete-btn');
        newBook.classList.add('book');
        bookDetails.classList.add('book-details');
        bookImg.classList.add('book-img');

        newBook.dataset.id = index; //Adding id to each book for easy access
        // book.id = newBook.dataset.id;

        if(book.status == true){
            readStatusIndicator.classList.add('read-status');
            readStatusIndicator.innerText = 'Completed';
        }
        else {
            readStatusIndicator.classList.add('in-progress');
            readStatusIndicator.innerText = 'In Progress';
        }

        bookTitle.innerText = `${book.title}`;
        bookAuthor.innerText = `${book.author}`;
        bookImg.style.backgroundImage = `url(${bookThumbnail})`;
        
        newBook.appendChild(bookImg);
        bookImg.appendChild(bookDeleteBtn);
        newBook.appendChild(bookDetails);
        newBook.appendChild(readStatusIndicator);
        bookDetails.appendChild(bookTitle);
        bookDetails.appendChild(bookAuthor);

        return newBook;
    }   

    const createSearchRes = function(noRes){
        let search_result = document.createElement('div');
        search_result.classList.add('search_result');
    
        if(noRes.hasOwnProperty('imageLinks') && noRes.authors && noRes.title){
        
            let resultIimgDiv = document.createElement('div');
            resultIimgDiv.classList.add('result-img');

            let resultImg = document.createElement('img')
            resultImg.src = noRes.imageLinks.thumbnail;

            let resultBookDetails = document.createElement('div');
            resultBookDetails.classList.add('result-book-details');

            let bookName = document.createElement('h5');
            bookName.innerText = noRes.title;

            let authorName = document.createElement('p');
            authorName.innerText = noRes.authors[0];
            resultBookDetails.appendChild(bookName);
            resultBookDetails.appendChild(authorName);

            search_result.appendChild(resultIimgDiv);
            search_result.appendChild(resultBookDetails);

            resultIimgDiv.appendChild(resultImg);

            document.querySelector('.search-results').appendChild(search_result);
        }

    }
    return {displayBooks, 
            createBookCard, 
            createSearchRes,
        };
}

const library = (function(){
    const bookStorage = [];
    const bookUI = UI();
    //cached DOM
    const bookContainer = document.querySelector('#book-container');
    const modal = document.querySelector('.book-modal');
    const close = document.querySelectorAll('.close');
    const activeBookModal = document.querySelector('.add-book');
    let bookTitle = document.querySelector('form')[0];
    let bookAuthor = document.querySelector('form')[1];
    let bookImg = document.querySelector(".book-modal #book-container .sample-book-img");
    let pages = document.querySelector('form')[2];
    let uploaded_image;
    let state = 0;
    const submitBookBtn = document.querySelector('.submit-book-btn');
    const image_input = document.querySelector('#image-input');
    const readStatus = document.getElementById('read-status');
    const searchOnline_modal =  document.querySelector('.search-online-form');
    const searchOnline_btn = document.querySelector('.online-opt button');
    const search_book = document.querySelector('.search-online-book');
    const searchResContainer = document.querySelector('.search-results');
    const addSelectedBookBtn = document.querySelector('.add');
    //bind events


    function addBookToDashboard(book){
        bookStorage.push(book);
       _resetForm();
        bookUI.displayBooks(bookStorage);
    }

    function deleteBook(e){
        e.stopPropagation();
 
        let book = e.target.parentElement.parentElement;
        bookStorage.splice(book.dataset.id, 1);
        bookUI.displayBooks(bookStorage);
    }

    //to get book from API
    function searchBookOnline(bookName, bookAuthor){
        YOUR_KEY_HERE = ''
        fetch('https://www.googleapis.com/books/v1/volumes?q='+bookName+'+'
        +'inauthor:'+bookAuthor+'&fields=kind,items(volumeInfo(authors,title,imageLinks))'
        +YOUR_KEY_HERE, {mode: 'cors'})
            .then(function(response) {
                 if(response.ok)
                    return response.json();
            })
            .then(function(response) {
                let searchResults = response.items;
                searchResults.forEach((res) => bookUI.createSearchRes(res.volumeInfo));
                //createSearchRes(response.items[0].volumeInfo);
               // document.querySelector('.result-img > img').src = response.items[0].volumeInfo.imageLinks.thumbnail;
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
        // createSearchRes('yuh');
    }

    searchResContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('search_result')){
            let book = getBookInfo(e.target.firstChild.firstChild.src, 
                e.target.lastChild.lastChild.innerText,
                e.target.lastChild.lastChild.innerText, 0, false);

            addBookToDashboard(book);
            modal.classList.remove('active')
        }
        
        
    });

    //addSelectedBookBtn.addEventListener('click', addBookToDashboard);
    
    search_book.addEventListener('click', () => {
        //document.querySelector('.search-online_name');
        //document.querySelector('.search-online_author');
        document.querySelector('.search-results').innerText = '';
        searchBookOnline( document.querySelector('.search-online_name').value, document.querySelector('.search-online_author').value);
    })

    bookContainer.addEventListener('click', (e) => {
        
        if(e.target.classList.contains('sample-book-img'))
            modal.classList.add('active');
        else if(e.target.classList.contains('delete-btn'))
           deleteBook(e);
    });
    
    searchOnline_btn.addEventListener('click', () => {
        searchOnline_modal.classList.add('active');
    })
    // console.log(close);
    close.forEach( (el) => {
            el.addEventListener('click', (e) => {
                e.target.parentElement.classList.remove('active');
            })
        });
    
    
        activeBookModal.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    image_input.addEventListener('change', function() {
        uploaded_image = '';
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            uploaded_image = reader.result;
            console.log( reader.result)
            bookImg.style.backgroundImage = `url(${uploaded_image})`;
            bookImg.style.backgroundSize = 'cover';
        });
        reader.readAsDataURL(this.files[0]);
        console.dir(this);
    });

    readStatus.addEventListener('click', () => {
        if(state){
            state = 0;
            readStatus.checked = false;
        }
        else {
            state = 1;
        }
    });

    submitBookBtn.addEventListener('click', () => {
        let book = getBookInfo(uploaded_image, bookTitle.value, 
            bookAuthor.value, pages.value, readStatus.checked);
        addBookToDashboard(book);
    });

    function getBookInfo(image, title, author, pages, status){
        let newBook = Book(image, title, author, pages, status);
        return newBook;
    }

    function _resetForm(){
        bookImg.style.backgroundImage = '';
        bookImg.style.backgroundSize = '';
        bookTitle.value = '';
        bookAuthor.value = '';
        pages.value = '';
    }

    
})();


