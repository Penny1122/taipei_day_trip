const accountInfo = document.querySelector(".account-info");
const inputName = document.querySelector(".input-name");
const inputOriginPassword = document.querySelector(".input-origin-password");
const inputNewPassword = document.querySelector(".input-new-password");
const changeNameTitle = document.querySelector(".change-name-title");
const changePasswordTitle = document.querySelector(".change-password-title");
const changeNameBox = document.querySelector(".change-name");
const changePasswordBox = document.querySelector(".change-password");
const changeName = document.querySelector(".change-button");
const changePassword = document.querySelector(".change-password-button");
const changeMessage = document.querySelector(".change-message");
const changeMessage2 = document.querySelector(".change-message2");
const memberSystem = document.querySelector(".member-system");

window.onload = async function () {
  await getUserStatus();
  console.log(userStatus);
  console.log(email);
  if (userStatus) {
    accountInfo.textContent = `　帳號　：　${email}`;
    inputName.value = member;
  } else {
    window.location.href = "/";
  }
};

changeName.addEventListener("click", async function () {
  try {
    let name = inputName.value;
    let url = "/api/member";
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
      }),
    });
    const data = await response.json();
    if (data.ok) {
      changeMessage.textContent = "修改成功";
    } else if (data.error) {
      changeMessage.textContent = data.message;
    }
  } catch (error) {
    console.log("error", error);
  }
});

changePassword.addEventListener("click", async function () {
  try {
    let originPassword = inputOriginPassword.value;
    let newPassword = inputNewPassword.value;
    let url = "/api/member";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originPassword: originPassword,
        newPassword: newPassword,
      }),
    });
    const data = await response.json();
    if (data.ok) {
      console.log("ok");
      changeMessage2.textContent = "修改成功";
    } else if (data.error) {
      changeMessage2.textContent = data.message;
    }
  } catch (error) {
    console.log("error", error);
  }
});

changeNameTitle.addEventListener("click", function () {
  changeNameTitle.style.fontWeight = 700;
  changeNameTitle.style.color = "#448899";
  changePasswordTitle.style.fontWeight = 400;
  changePasswordTitle.style.color = "#666666";
  changeNameBox.classList.remove("none");
  changePasswordBox.classList.add("none");
});

changePasswordTitle.addEventListener("click", function () {
  changePasswordTitle.style.fontWeight = 700;
  changePasswordTitle.style.color = "#448899";
  changeNameTitle.style.fontWeight = 400;
  changeNameTitle.style.color = "#666666";
  changePasswordBox.classList.remove("none");
  changeNameBox.classList.add("none");
});

memberSystem.addEventListener("click", function () {
  document.location.href = "/member";
});
