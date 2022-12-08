const attractionName = document.querySelector(".profile-text1");
const position = document.querySelector(".profile-text2");
const description = document.querySelector(".description");
const address = document.querySelector(".address");
const transport = document.querySelector(".transport");
const amButton = document.querySelector("#radioId");
const pmButton = document.querySelector("#radioId2");
const price = document.querySelector(".fieldPrice-text2");
const slides = document.querySelector(".slides");
const circle = document.querySelector(".circle");

let slideIndex = 0;
let path = location.pathname;

// console.log(path);
fetch(`/api${path}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let clist = data.data;
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
  });

amButton.addEventListener("click", function () {
  price.textContent = "新台幣 <span class='price'>2000</span> 元";
});
pmButton.addEventListener("click", function () {
  price.textContent = "新台幣 <span class='price'>2500</span> 元";
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
