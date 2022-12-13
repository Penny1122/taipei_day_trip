const userName = document.querySelector(".user-name");
const detail = document.querySelector(".detail");
const section = document.querySelector(".section");
const content = document.querySelector(".content");
const info = document.querySelector(".information");
const total = document.querySelector(".total-price");

window.onload = async function () {
  await getUserStatus();
  if (userStatus) {
    userName.textContent = `您好，${member}，待預訂的行程如下：`;
    getBookingInfo();
  } else {
    window.location.href = "/";
  }
};

async function getBookingInfo() {
  try {
    const response = await fetch("/api/booking");
    const data = await response.json();
    const result = data.data;
    if (result != null) {
      let information = "";
      let totalPrice = 0;
      for (let i = 0; i < result.length; i++) {
        let times =
          result[i].time == "morning" ? "早上9點到12點" : "下午1點到5點";
        information += `
          <div class="section">
            <a href="/attraction/${result[i].attraction.id}">
              <img class="image" src="${result[i].attraction.image}" />
            </a>
            <div class="info">
                <div class="name">台北一日遊：${result[i].attraction.name}</div>
                <div class="frame">日期：<span class="frame-text">${result[i].date}</span></div>
                <div class="frame">時間：<span class="frame-text">${times}</span></div>
                <div class="frame">費用：<span class="frame-text">${result[i].price}</span></div>
                <div class="frame">地點：<span class="frame-text">${result[i].attraction.address}</span></div>
            </div>
          <div class="delete"></div>
          </div>
          <hr/>`;
        totalPrice += result[i].price;
      }
      total.textContent = `總價：新台幣 ${totalPrice} 元`;
      detail.innerHTML = information;
      info.style.display = "block";
      const deleteButton = document.querySelectorAll(".delete");
      deleteButton.forEach(function (item, index) {
        item.addEventListener("click", function () {
          let id = result[index].attraction.id;
          let date = result[index].date;
          let time = result[index].time;
          deleteInfo(id, date, time);
        });
      });
    } else {
      detail.innerHTML = `<div><div class="null">目前沒有任何待預訂的行程</div></div>`;
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function deleteInfo(id, date, time) {
  try {
    const response = await fetch("/api/booking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attractionId: id,
        date: date,
        time: time,
      }),
    });
    const data = await response.json();
    if (data.ok) {
      location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}
