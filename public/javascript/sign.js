const sign = document.querySelector(".sign");
const signin = document.querySelector(".signin");
const signup = document.querySelector(".signup");
const signout = document.querySelector(".signout");
const order = document.querySelector(".order");
const goToSignUp = document.querySelector(".goToSignUp");
const goToSignIn = document.querySelector(".goToSignIn");
const close = document.querySelectorAll(".close");
const signButton = document.querySelector(".signButton");
const signInButton = document.querySelector(".signInButton");
const signupButton = document.querySelector(".signupButton");
const signInEmail = document.querySelector("#signInEmail");
const signInPassword = document.querySelector("#signInPassword");
const opacity = document.querySelector(".opacity");
const success = document.querySelector(".success");
const wrong = document.querySelector(".wrong");
const wrong2 = document.querySelector(".wrong2");
const Path = location.pathname;
const passwordRule = document.querySelector(".password-rule");
const errorImg1 = document.querySelector(".error-img1");
const errorImg2 = document.querySelector(".error-img2");
let member;
let userStatus = false;

getUserStatus();

function check(element, type) {
  let rule;
  if (type == "email") {
    rule = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  } else if (type == "password") {
    rule = /[0-9a-zA-z]{6,12}/;
  } else if (type == "name") {
    rule = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,20}$/;
  }

  let regex = new RegExp(rule);
  if (regex.test(element.value)) {
    element.style.backgroundImage = "url(/image/correct_icon.png)";
  } else {
    element.style.backgroundImage = "url(/image/incorrect_icon.png)";
  }
}

async function getUserStatus() {
  try {
    const response = await fetch("/api/user/auth");
    const data = await response.json();
    const clist = data.data;
    if (clist != null) {
      member = clist.name;
      sign.classList.add("none");
      signout.classList.remove("none");
      userStatus = true;
    } else {
      sign.classList.remove("hidden");
      sign.classList.remove("none");
      signout.classList.add("none");
      userStatus = false;
    }
  } catch (error) {
    console.log("error", error);
  }
}

sign.addEventListener("click", function () {
  opacity.style.display = "block";
  signin.style.display = "block";
});
goToSignUp.addEventListener("click", function () {
  errorImg1.style.display = "none";
  wrong.style.display = "none";
  signin.style.display = "none";
  signup.style.display = "block";
});
goToSignIn.addEventListener("click", function () {
  errorImg2.style.display = "none";
  wrong2.style.display = "none";
  signin.style.display = "block";
  signup.style.display = "none";
});
close.forEach((item) => {
  item.addEventListener("click", function () {
    signin.style.display = "none";
    signup.style.display = "none";
    opacity.style.display = "none";
    wrong.style.display = "none";
    wrong2.style.display = "none";
    errorImg1.style.display = "none";
    errorImg2.style.display = "none";
  });
});

signInButton.addEventListener("click", function () {
  let email = document.querySelector("#signInEmail").value;
  let password = document.querySelector("#signInPassword").value;
  let url = "/api/user/auth";
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }), //發送JSON格式資料給後端
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ok) {
        document.location.href = Path;
      } else if (data.error) {
        errorImg1.style.display = "block";
        wrong.textContent = `${data.message}`;
        wrong.style.display = "block";
      }
    });
});
signupButton.addEventListener("click", async function () {
  try {
    let name = document.querySelector("#signUpName").value;
    let email = document.querySelector("#signUpEmail").value;
    let password = document.querySelector("#signUpPassword").value;
    let url = "/api/user";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }), //發送JSON格式資料給後端
    });
    const data = await response.json();
    if (data["ok"]) {
      success.textContent = "註冊成功";
    } else if (data["error"]) {
      errorImg2.style.display = "block";
      wrong2.textContent = `${data.message}`;
      wrong2.style.display = "block";
    }
  } catch (error) {
    console.log("error", error);
  }
});

order.addEventListener("click", function () {
  if (userStatus) {
    document.location.href = "/booking";
  } else {
    signin.style.display = "block";
  }
});

signout.addEventListener("click", async function () {
  try {
    const response = await fetch("/api/user/auth", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data["ok"]) {
      document.location.href = "/";
    }
  } catch (error) {
    console.log("error", error);
  }
});
