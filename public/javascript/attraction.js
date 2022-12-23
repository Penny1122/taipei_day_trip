const attractionName = document.querySelector(".profile-text1");
const position = document.querySelector(".profile-text2");
const description = document.querySelector(".description");
const address = document.querySelector(".address");
const transport = document.querySelector(".transport");
const amButton = document.querySelector("#radioId");
const pmButton = document.querySelector("#radioId2");
const money = document.querySelector(".money");
const slides = document.querySelector(".slides");
const circle = document.querySelector(".circle");
const start = document.querySelector(".start");
const errorMessage = document.querySelector(".error-message");
const errorImage = document.querySelector(".error-image");
const bookingSuccess = document.querySelector(".booking-success");
const bookingClose = document.querySelector(".booking-success-close");
const chooseDate = document.querySelector(".input");
let slideIndex = 0;
let path = location.pathname;
let today = new Date();

// console.log(path);
window.onload = function () {
  getInfo();
  getToday();
};

function getToday() {
  today = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  chooseDate.min = today;
}

async function getInfo() {
  try {
    const response = await fetch(`/api${path}`);
    const data = await response.json();
    const clist = data.data;
    attractionName.textContent = clist.name;
    position.textContent = `${clist.category} at ${clist.mrt}`;
    description.textContent = clist.description;
    address.textContent = clist.address;
    transport.textContent = clist.transport;
    let image = "";
    let dot = "";
    for (let i = 0; i < clist.images.length; i++) {
      image += `<div class="img fade"><img src=${clist.images[i]} /></div>`;
      dot += `<span class="circleDot" onclick="currentSlide(${i})"></span>`;
    }
    slides.innerHTML = image;
    circle.innerHTML = dot;

    showSlides(slideIndex);
  } catch (error) {
    console.log("error", error);
  }
}

amButton.addEventListener("click", function () {
  money.textContent = " 2000 ";
  amButton.setAttribute("checked", "checked");
  pmButton.removeAttribute("checked");
});
pmButton.addEventListener("click", function () {
  money.textContent = " 2500 ";
  amButton.removeAttribute("checked");
  pmButton.setAttribute("checked", "checked");
});

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let img = document.querySelectorAll(".img");
  let circleDot = document.querySelectorAll(".circleDot");
  if (n >= img.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = img.length - 1;
  }
  for (i = 0; i < img.length; i++) {
    img[i].style.display = "none";
    circleDot[i].className = circleDot[i].className.replace(" active", "");
  }
  img[slideIndex].style.display = "block";
  circleDot[slideIndex].className += " active";
}

start.addEventListener("click", function () {
  const inputDate = document.querySelector(".input");
  const inputTime = document.querySelector("[name=ellipse]:checked").id;
  let attractionId = path.replace("/attraction/", "");
  let date = inputDate.value;
  let time = inputTime == "radioId" ? "morning" : "afternoon";
  let price = time == "morning" ? 2000 : 2500;
  booking(attractionId, date, time, price);
});

async function booking(attractionId, date, time, price) {
  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attractionId: attractionId,
        date: date,
        time: time,
        price: price,
      }),
    });
    let myStatus = response.status;
    if (myStatus == 403) {
      signin.style.display = "block";
    }
    const data = await response.json();
    if (data.ok) {
      errorImage.style.display = "none";
      errorMessage.textContent = "";
      bookingSuccess.style.display = "block";
      // setTimeout("location.href = '/booking'", 3000);
      // document.location.href = "/booking";
    } else if (data.error) {
      errorImage.style.display = "block";
      errorMessage.textContent = data.message;
    }
  } catch (error) {
    console.log("error", error);
  }
}
bookingClose.addEventListener("click", function () {
  bookingSuccess.style.display = "none";
});
