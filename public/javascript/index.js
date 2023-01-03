let content = document.querySelector(".content");
let section = document.querySelector(".section");
let button = document.querySelector(".btn");
let input = document.querySelector(".input1");
let category = document.querySelector(".category");
let footer = document.querySelector(".footer");
let fail = document.querySelector(".fail");
let loading = document.querySelector(".loading");

window.onload = function () {
  observe(0, "");
};

let bgImg = new Image();
// 當圖片載入完成時執行onload function
bgImg.onload = function () {
  console.log("載入完成！");
  // 在body放入背景圖位置
  document.body.style.backgroundImage = "url(" + bgImg.src + ")";
  // 停止loading動畫
  document.getElementById("load-wrapper").classList.add("d-none");
};

//無限滾動
function observe(page, keyword) {
  // setTimeout("testtest.style.display = 'none'", 1000);
  // testtest.style.display = "block";
  let configs = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };
  let imageIndex = 0;
  let observer = new IntersectionObserver(async function (entries) {
    loading.style.display = "block";
    entries.forEach(async function (entry) {
      if (entry.isIntersecting) {
        try {
          const response = await fetch(
            `/api/attractions?page=${page}&keyword=${keyword}`
          );
          const data = await response.json();
          let clist = data.data;
          // console.log(clist[0].images[0]);
          if (clist != null) {
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

              let divTag = document.createElement("div");
              divTag.setAttribute("class", "for-img");

              let aTag = document.createElement("a");
              aTag.setAttribute("class", "image");
              aTag.setAttribute("href", `/attraction/${clist[i].id}`);

              divTag.appendChild(imgTag);
              aTag.appendChild(divTag);
              aTag.appendChild(attractionNameDiv);
              aTag.appendChild(titleDiv);
              content.appendChild(aTag);
              fail.style.display = "none";
            }

            const img = document.querySelectorAll(".for-img");
            img.forEach((item) => {
              item.firstElementChild.addEventListener("load", function () {
                imageIndex += 1;
                if (imageIndex == img.length) {
                  loading.style.display = "none";
                  content.classList.remove("none");
                }
              });
            });
          } else {
            fail.style.display = "flex";
          }
          if (data.nextPage != null) {
            page = data.nextPage;
          } else {
            loading.style.display = "none";
            observer.unobserve(footer);
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  }, configs);

  observer.observe(footer);
  button.addEventListener("click", function () {
    observer.unobserve(footer);
  });
}
//關鍵字list呈現
input.addEventListener("click", async function () {
  try {
    const response = await fetch("/api/categories");
    const data = await response.json();
    const clist = data.data;
    category.innerHTML = "";
    for (let i = 0; i < clist.length; i++) {
      let div = document.createElement("div");
      div.setAttribute("class", "item");
      div.setAttribute("onclick", "value(this.innerHTML)");
      div.textContent = clist[i];
      category.appendChild(div);
    }
    category.style.display = "flex";
  } catch (error) {
    console.log("error", error);
  }
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
