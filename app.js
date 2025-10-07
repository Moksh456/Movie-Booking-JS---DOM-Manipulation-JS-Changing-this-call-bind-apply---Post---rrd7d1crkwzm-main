import { fetchMovieAvailability, fetchMovieList } from "./api.js";

const mainElement = document.querySelector("main");
const bookerElement = document.querySelector("#booker")
const bookerGridElement = document.querySelector("#booker-grid-holder");
const bookTicketBtn = document.querySelector("#book-ticket-btn");




// convert to html dom
function convertToHtmlDom(htmlInStringFormat) {
   const element = document.createElement("div");
   element.innerHTML = htmlInStringFormat;
   return element.firstElementChild;
}

const loader = convertToHtmlDom(`<div class="loader"><h1> Loading...............</h1></div>`)

let selectedSeats = [];
let selectedRate = 0;
let selectedMovieName = "";

let totalAmount = selectedRate * selectedSeats.length;

bookTicketBtn.addEventListener("click", onBookTicketClickHandler);

const onseatclick = (event) => {
    console.log(event.target.innerText);
    event.target.classList.toggle("selected-seat");

    
    if(event.target.classList.contains("selected-seat")) {
        selectedSeats.push(event.target.innerText);
    } else {
        selectedSeats = selectedSeats.filter(seat => seat !== event.target.innerText);
    }
    
    console.log(selectedSeats);

    if(selectedSeats.length > 0) {
        document.querySelector("#book-ticket-btn").classList.remove("v-none");
    } else {
        document.querySelector("#book-ticket-btn").classList.add("v-none");
    }
}


const renderSuccessMessage = (mobileNumber, email) => {
    const totalAmount = selectedRate * selectedSeats.length;

    const successMsg = convertToHtmlDom(`
        <div id="Success" class="ticket-horizontal">
            <div class="ticket-left">
                <h2>${selectedMovieName}</h2>
                <p><strong>Seats:</strong> ${selectedSeats.join(", ")}</p>
                <p><strong>Rate:</strong> ₹${selectedRate} per ticket</p>
                <p><strong>Total:</strong> ₹${totalAmount}</p>
            </div>
            <div class="ticket-right">
                <p><strong>Phone:</strong> ${mobileNumber}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p class="ticket-msg">🎬 Enjoy your movie! 🍿</p>
                <button id="download-ticket-btn">Download Ticket</button>
            </div>
        </div>
    `);

    bookerElement.innerHTML = ""; 
    bookerElement.appendChild(successMsg);

    // Add download functionality
    document.querySelector("#download-ticket-btn").addEventListener("click", () => {
        html2canvas(document.querySelector("#Success")).then(canvas => {
            const link = document.createElement("a");
            link.download = `${selectedMovieName}_ticket.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });
}



const onPurchaseBtnClickHandler = (event) => {
    event.preventDefault();
    const mobileNumber = document.querySelector("#mobile").value;
    const email = document.querySelector("#email_movie").value;
    bookerElement.innerHTML = "";
    renderSuccessMessage(mobileNumber,email);
}



function renderConfirmPurchaseForm() {
                    const form = convertToHtmlDom(`
    <div id="confirm-purchase">
        <h3>Confirm your booking for seat numbers:${selectedSeats.join(",")} and Pay ${selectedRate * selectedSeats.length} ₹ for the movie Which NAme is ${selectedMovieName}</h3> 
        <form id="customer-detail-form" >
        <div>
            <label for="email_movie">Email: </label>
            <input type="email" id="email_movie" required />
            </div>
            <div>
            <label for="mobile">Phone Number : </label>
            <input type="tel" id="mobile" required />
            </div>
            <button id="movie_submit_btn" type="submit">Purchase</button>
        </form>
    </div>
    `);
 bookerElement.appendChild(form);
    document.querySelector("form").addEventListener("submit", onPurchaseBtnClickHandler);
}

function onBookTicketClickHandler () {
    bookerElement.innerHTML = "";
    renderConfirmPurchaseForm();
}


const renderTheatreLayout = (listOfUnavailableSeats = [], seatNoOffset = 1) => {

    const grid = convertToHtmlDom(`<div class="booking-grid"></div>`);
    let theatreSeats = "";

    for(let i = 0; i < 12; i++) {
        theatreSeats = theatreSeats + 
        `<div id="booking-grid-${i+seatNoOffset}" class="grid-cell ${listOfUnavailableSeats.includes(i+seatNoOffset ) ? "unavailable-seat": "available-seat"}">${i+seatNoOffset}</div>`
    }
    grid.innerHTML = theatreSeats;
    bookerGridElement.appendChild(grid);

    // add event listener to available seats
   document.querySelectorAll(".grid-cell").forEach(cell => cell.addEventListener("click", onseatclick));
}
const renderMovieTheatre = (event) => {
    event.preventDefault();

    // Get the movie name from the clicked movie
    const movieName = selectedMovieName;

    // Reset seats for new movie
    selectedSeats = [];
    bookTicketBtn.classList.add("v-none"); // hide book button
    bookerGridElement.innerHTML = "";       // clear previous grid

    bookerElement.appendChild(loader);

    fetchMovieAvailability(movieName).then((listOfUnavailable) => {
        loader.remove();

        // Show "Select your favourite seat" message
        let seatSelectorMsg = document.querySelector(".selector-seat");
        if(!seatSelectorMsg) {
            seatSelectorMsg = convertToHtmlDom(`<h3 class="selector-seat">Select your favourite seat.</h3>`);
            bookerElement.prepend(seatSelectorMsg);
        }
        seatSelectorMsg.classList.remove("v-none"); // show it

        // Render theatre layout for the new movie
        renderTheatreLayout(listOfUnavailable);       // first 12 seats
        renderTheatreLayout(listOfUnavailable, 13);  // next 12 seats
    });
}




const renderMoviesList = async () => {
    mainElement.appendChild(loader)
    const moveiList = await fetchMovieList();
    console.log(moveiList);

    const movieHolderElement = convertToHtmlDom(`<div class="movieHolder"></div>`)

    moveiList.forEach(movie => {
     var movieElement =   convertToHtmlDom(`
        <div class="movie-ele">
        

        <a class="movie-link" href="${movie.name}">
        
<div class="rate">
  Movie-rate: ${movie.rate}
</div>
         <div class="movie" data-id="${movie.name}">
             <div class="movie-img-wrapper" style="background-image: url(${movie.imgUrl});">  
                 
             </div>
             <h4>${movie.name}</h4>
         </div>
    </a>
          <div class="lang">
 languege:   ${movie.languege}
</div>
    <div class="date"> Movie-Relesing-Date: ${movie.Date}</div> 
  
</div> 


        `) ;
  

    movieHolderElement.appendChild(movieElement);
     movieElement.addEventListener("click", (event) => {
    // Store rate globally
    selectedRate = parseInt(movie.rate); // "250 INR" → 250

    // Store selected movie name if you want
    selectedMovieName = movie.name;

    // Call theatre renderer
    renderMovieTheatre(event)
});
    });
    
    loader.remove();
    mainElement.appendChild(movieHolderElement);
}

console.log(selectedRate)
renderMoviesList();