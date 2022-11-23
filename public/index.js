let content = document.querySelector(".content");
let button = document.querySelector(".btn");
let input = document.querySelector(".input1");
let category = document.querySelector(".category");

window.onload = observe(0, "");

button.addEventListener("click", function () {
  let keyword = input.value;
  content.innerHTML = "";
  input.value = "";
  observe(0, keyword);
});
//無限滾動
function observe(page, keyword) {
  let configs = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  let observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fetch(
          `http://43.206.76.136:3000/api/attractions?page=${page}&keyword=${keyword}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            let clist = data.data;
            // console.log(clist[0].images[0]);
            for (let i = 0; i < clist.length; i++) {
              let imageDiv = document.createElement("div");
              imageDiv.setAttribute("class", "image");
              let titleDiv = document.createElement("div");
              titleDiv.setAttribute("class", "title");

              //最內層Div
              let mrtText = document.createTextNode(clist[i].mrt);
              let mrtDiv = document.createElement("div");
              mrtDiv.setAttribute("class", "mrt");
              mrtDiv.appendChild(mrtText);
              let catText = document.createTextNode(clist[i].category);
              let catDiv = document.createElement("div");
              catDiv.setAttribute("class", "cat");
              catDiv.appendChild(catText);
              //放入titleDiv
              titleDiv.appendChild(mrtDiv);
              titleDiv.appendChild(catDiv);

              let imgTag = document.createElement("img");
              imgTag.setAttribute("src", clist[i].images[0]);

              let attractionNameText = document.createTextNode(clist[i].name);
              let attractionNameDiv = document.createElement("div");
              attractionNameDiv.setAttribute("class", "attractionName");
              attractionNameDiv.appendChild(attractionNameText);

              imageDiv.appendChild(imgTag);
              imageDiv.appendChild(attractionNameDiv);
              imageDiv.appendChild(titleDiv);
              document.querySelector(".content").appendChild(imageDiv);
            }
            if (data.nextPage != null) {
              page = data.nextPage;
            } else {
              observer.unobserve(footer);
            }
          });
      }
    });
  }, configs);
  let footer = document.querySelector(".footer");
  observer.observe(footer);
  button.addEventListener("click", function () {
    observer.unobserve(footer);
  });
}

//關鍵字list呈現

input.addEventListener("click", function () {
  fetch("http://43.206.76.136:3000/api/categories")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let clist = data.data;
      category.innerHTML = "";
      for (let i = 0; i < clist.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "item");
        div.setAttribute("onclick", "value(this.innerHTML)");
        div.textContent = clist[i];
        category.appendChild(div);
      }
    });
  category.style.display = "flex";
});

document.addEventListener(
  "click",
  function () {
    category.style.display = "none";
  },
  true
);

function value(e) {
  input.value = e;
  // input.setAttribute("value", e);
}
