const text1 = document.querySelector(".text1");
const text2 = document.querySelector(".text2");
const text3 = document.querySelector(".text3");

let path = location.href;
console.log(path);
orderId = path.replace("http://127.0.0.1:3000/thankyou?number=", "");
console.log(orderId);

window.onload = async function () {
  await getOrderInfo();
};

async function getOrderInfo() {
  try {
    const response = await fetch(`/api/order/${orderId}`);
    const data = await response.json();
    const clist = data.data;
    console.log(clist.status);
    if (clist.status == "success") {
      text1.textContent = "行程訂購成功";
      text2.textContent = `${orderId}`;
      text3.textContent = "5秒後跳轉至訂單頁面";
      setTimeout(`document.location.href = '/member?number=${orderId}'`, 5000);
    } else {
      text1.textContent = "行程訂購失敗";
      text2.textContent = `${orderId}`;
      text3.textContent = "5秒後跳轉至訂單頁面";
      setTimeout(`document.location.href = '/member?number=${orderId}'`, 5000);
    }
  } catch (error) {
    console.log("error", error);
  }
}
