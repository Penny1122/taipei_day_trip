const userName = document.querySelector(".user-name");
const orderId = document.querySelector(".orderId");
const paymentTime = document.querySelector(".payment-time");
const totalPrice = document.querySelector(".total-price");
const orderStatus = document.querySelector(".status");
const checkOrder = document.querySelector(".check");
let path = location.pathname;

window.onload = async function () {
  await getUserStatus();
  if (userStatus) {
    userName.textContent = `您好，${member}，您的行程如下：`;
    getOrderInfo();
  } else {
    window.location.href = "/";
  }
};

async function getOrderInfo() {
  try {
    const response = await fetch(`/api${path}`);
    const data = await response.json();
    const result = data.data;
    let paymentStatus = result.status == "success" ? "付款成功" : "付款失敗";
    orderId.textContent = result.number;
    paymentTime.textContent = result.payment_time;
    totalPrice.textContent = result.price;
    orderStatus.textContent = paymentStatus;
    checkOrder.addEventListener("click", function () {
      console.log("OK");
      getMoreOrderInfo(result);
    });
  } catch (error) {
    console.log("error", error);
  }
}

function getMoreOrderInfo(result) {
  console.log(result);
  const trip = result.trip;
  let information = "";
  trip.forEach((i) => {
    let time = i.time == "morning" ? "早上 9 點到 12 點" : "下午 1 點到 5 點";
    console.log(time);
    console.log(i.attraction.image);
    information += `
    <div class="detail-box">
        <div class="image-block">
            <img class="image" src=${i.attraction.image} />
        </div>
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
  <div class="contact-info">您的聯絡資訊</div>
  <div class="field contact-name">聯絡姓名：${result.contact.name}</div>
  <div class="field contact-email">連絡信箱：${result.contact.email}</div>
  <div class="field contact-phone">手機號碼：${result.contact.phone}</div>`;
  const detail = document.querySelector(".detail");
  const contactForm = document.querySelector(".contact-form");
  console.log(information);
  detail.innerHTML = information;
  contactForm.innerHTML = contact;
}
