const userName = document.querySelector(".user-name");
const detail = document.querySelector(".detail");
const section = document.querySelector(".section");
const content = document.querySelector(".content");
const info = document.querySelector(".information");
const total = document.querySelector(".total-price");
const inputName = document.querySelector(".input-name");
const inputEmail = document.querySelector(".input-email");
const inputPhone = document.querySelector(".input-phone");
const checkCard = document.querySelector(".check-card");
const checkCardMonth = document.querySelector(".check-card-month");
let totalTrip = [];
let totalPrice = 0;

window.onload = async function () {
  await getUserStatus();
  if (userStatus) {
    userName.textContent = `您好，${member}，待預訂的行程如下：`;
    inputName.value = member;
    inputName.style.backgroundImage = "url(/image/correct_icon.png)";
    inputEmail.value = email;
    inputEmail.style.backgroundImage = "url(/image/correct_icon.png)";
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
      for (let i = 0; i < result.length; i++) {
        let times =
          result[i].time == "morning" ? "早上9點到12點" : "下午1點到5點";
        information += `
          <div class="section">
            <a href="/attraction/${result[i].attraction.id}">
              <div class="image-block">
                <img class="image" src="${result[i].attraction.image}" />
              </div>
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
        let attraction = {
          attraction: result[i].attraction,
          date: result[i].date,
          time: result[i].time,
        };
        totalTrip.push(attraction);
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

const confirmBtn = document.querySelector(".confirm-btn");
confirmBtn.addEventListener("click", function (event) {
  let order = {
    price: totalPrice,
    trip: totalTrip,
    contact: {
      name: inputName.value,
      email: inputEmail.value,
      phone: inputPhone.value,
    },
  };
  event.preventDefault();

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }
    console.log(result.card.prime);

    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    payment(order, result.card.prime);
  });
});

async function payment(order, prime) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prime: prime,
        order: order,
      }),
    });
    const data = await response.json();
    const result = data.data;
    if (result) {
      console.log(result.payment.message);
      document.location.href = `/thankyou?number=${result.number}`;
    } else {
      console.log(data.message);
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

// checkCard.addEventListener("keyup", function () {
//   this.value = this.value.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
//   let regex = new RegExp(/^\d{16}$/);
//   if (regex.test(this.value.replace(/\s*/g, ""))) {
//     this.style.color = "black";
//   } else {
//     this.style.color = "#fa5252";
//   }
// });
// checkCardMonth.addEventListener("keyup", function () {
//   this.value = this.value.replace(/^(0[0-9]|1[0-9])$/, "$& / ");
//   let regex = new RegExp(/^(0[0-9]|1[012]\d{2})$/);
//   let checkNum = this.value.replace(/\s\/\s/g, "");
//   if (regex.test(checkNum)) {
//     this.style.color = "black";
//   } else {
//     this.style.color = "#fa5252";
//   }
// });
TPDirect.setupSDK(
  126839,
  "app_qCcYPB9xdWeSW0GKopYt03YIVxBvBRyyn2xmuX0XUV4Wk2p1eo3lvmHT7yck",
  "sandbox"
);
let fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "CCV",
  },
};
TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "#fa5252",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "#fa5252",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});
TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    // submitButton.removeAttribute('disabled')
  } else {
    // Disable submit Button to get prime.
    // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
});
