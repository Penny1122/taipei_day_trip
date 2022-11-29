let content = document.querySelector(".content");
let button = document.querySelector(".btn");
let input = document.querySelector(".input1");
let category = document.querySelector(".category");
let footer = document.querySelector(".footer");
let fail = document.querySelector(".fail");

window.onload = observe(0, "");
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
        fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            let clist = data.data;
            // console.log(clist[0].images[0]);
            if (clist != "") {
              for (let i = 0; i < clist.length; i++) {
                // let imageDiv = document.createElement("div");
                // imageDiv.setAttribute("class", "image");
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

                let aTag = document.createElement("a");
                aTag.setAttribute("class", "image");
                aTag.setAttribute("href", `/attraction/${clist[i].id}`);

                aTag.appendChild(imgTag);
                aTag.appendChild(attractionNameDiv);
                aTag.appendChild(titleDiv);
                content.appendChild(aTag);
                fail.style.display = "none";
              }
            } else {
              fail.style.display = "flex";
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

  observer.observe(footer);
  button.addEventListener("click", function () {
    observer.unobserve(footer);
  });
}
//關鍵字list呈現
input.addEventListener("click", function () {
  fetch("/api/categories")
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
//搜尋關鍵字
button.addEventListener("click", function () {
  let keyword = input.value;
  content.innerHTML = "";
  input.value = "";
  observe(0, keyword);
});
