const userName = document.querySelector(".user-name");
const detail = document.querySelector(".detail");
const section = document.querySelector(".section");
const content = document.querySelector(".content");
const info = document.querySelector(".information");

window.onload = function () {
  getData();
  getBookingInfo();
};
function getData() {
  let url = "/api/user/auth";
  fetch(url) //發送JSON格式資料給後端
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let result = data.data;
      if (result != null) {
        userName.textContent = `您好，${result.name}，待預訂的行程如下：`;
      } else {
        document.location.href = "/";
      }
    });
}
function getBookingInfo() {
  let url = "/api/booking";
  fetch(url) //發送JSON格式資料給後端
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let result = data.data;
      console.log(result);
      if (result != null) {
        let information = "";
        for (let i = 0; i < result.length; i++) {
          let time =
            result[i].time == "morning" ? "早上9點到12點" : "下午1點到5點";
          information += `
            <div class="section">
                <img class="image" src="${result[i].attraction.image}" />
                <div class="info">
                    <div class="name">台北一日遊：${result[i].attraction.name}</div>
                    <div class="frame">日期：<span class="frame-text">${result[i].date}</span></div>
                    <div class="frame">時間：<span class="frame-text">${time}</span></div>
                    <div class="frame">費用：<span class="frame-text">${result[i].price}</span></div>
                    <div class="frame">地點：<span class="frame-text">${result[i].attraction.address}</span></div>
                </div>
            <div class="delete"></div>   
            </div>`;
        }
        detail.innerHTML = information;
        info.style.display = "block";
      } else {
        detail.innerHTML = `<div><div class="null">目前沒有任何待預訂的行程</div></div>`;
      }
    });
}
