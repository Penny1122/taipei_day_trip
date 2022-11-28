const attractionName = document.querySelector(".profile-text1");
const position = document.querySelector(".profile-text2");
const description = document.querySelector(".description");
const address = document.querySelector(".address");
const transport = document.querySelector(".transport");
const amButton = document.querySelector("#radioId");
const pmButton = document.querySelector("#radioId2");
const price = document.querySelector(".fieldPrice-text2");

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
  });

amButton.addEventListener("click", function () {
  price.textContent = "新台幣 2000 元";
});
pmButton.addEventListener("click", function () {
  price.textContent = "新台幣 2500 元";
});
