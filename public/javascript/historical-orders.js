const userName = document.querySelector(".user-name");
const orderId = document.querySelector(".orderId");
const paymentTime = document.querySelector(".payment-time");
const totalPrice = document.querySelector(".total-price");
const orderStatus = document.querySelector(".status");
const test = document.querySelector(".test");
const detail = document.querySelectorAll(".detail");
let path = location.pathname;

window.onload = async function () {
  await getUserStatus();
  if (userStatus) {
    userName.textContent = `您好，${member}，您的歷史訂單如下：`;
    getAllOrderStatus();
  }
};

async function getAllOrderStatus() {
  try {
    const response = await fetch(`/api${path}`);
    const data = await response.json();
    const result = data.data;
    let information = "";
    result.forEach((i) => {
      let paymentStatus = i.status == "success" ? "付款成功" : "付款失敗";
      information += `
        <div class="order-box2">
        <span class="info-text orderId">${i.number}</span>
        <span class="info-text payment-time">${i.payment_time}</span>
        <span class="info-text total-price">${i.total_price}</span>
        <span class="info-text status">${paymentStatus}</span>
        <span class="info-text read">
          <button class="checkOrder">查看</button>
          <button class="closeOrder none">收起</button>
        </span>
        </div>
        <div class="detail"></div>
        <hr/>`;
    });
    test.innerHTML = information;
    const checkOrder = document.querySelectorAll(".checkOrder");
    checkOrder.forEach((e, index) => {
      e.addEventListener("click", function () {
        checkOrder[index].style.display = "none";
        getMoreOrderInfo(result[index], index, e);
      });
    });
  } catch (error) {
    console.log("error", error);
  }
}

function getMoreOrderInfo(result, index, e) {
  const trip = result.trip;
  let information = "";
  trip.forEach((i) => {
    let time = i.time == "morning" ? "早上 9 點到 12 點" : "下午 1 點到 5 點";
    information += `
    <div class="detail-box">
      <a href="/attraction/${i.attraction.id}">
        <div class="image-block">
          <img class="image" src=${i.attraction.image} />
        </div>
      </a>
      <div class="info">
            <div class="name">台北一日遊：${i.attraction.name}</div>
            <div class="frame">日期：${i.date}</div>
            <div class="frame">時間：${time}</div>
            <div class="frame">費用：${i.price}</div>
            <div class="frame">地點：${i.attraction.address}</div>
      </div>
    </div>
    <hr/>`;
  });
  let contact = `
  <div class="contact-form">
  <div class="contact-info">您的聯絡資訊</div>
  <div class="field contact-name">聯絡姓名：${result.contact.name}</div>
  <div class="field contact-email">連絡信箱：${result.contact.email}</div>
  <div class="field contact-phone">手機號碼：${result.contact.phone}</div>
  </div>`;
  const detail = document.querySelectorAll(".detail");
  const closeOrder = document.querySelectorAll(".closeOrder");
  closeOrder[index].style.display = "block";
  detail[index].style.display = "block";
  detail[index].innerHTML = information + contact;

  closeOrder[index].addEventListener("click", function () {
    closeOrder[index].style.display = "none";
    e.style.display = "flex";
    detail[index].style.display = "none";
  });
}
