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

function get() {
  let url = "/api/user/auth";
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }) //發送JSON格式資料給後端
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.data != null) {
        sign.classList.add("none");
        signout.classList.remove("none");
      } else {
        sign.style.display = "block";
        signout.style.display = "none";
      }
    });
}
get();

sign.addEventListener("click", function () {
  opacity.style.display = "block";
  signin.style.display = "block";
});
goToSignUp.addEventListener("click", function () {
  signin.style.display = "none";
  signup.style.display = "block";
});
goToSignIn.addEventListener("click", function () {
  signin.style.display = "block";
  signup.style.display = "none";
});
close.forEach((close) => {
  close.addEventListener("click", function () {
    signin.style.display = "none";
    signup.style.display = "none";
    opacity.style.display = "none";
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
      if (data["ok"]) {
        document.location.href = Path;
      } else if (data["error"]) {
        wrong.textContent = `${data.message}`;
      }
    });
});
signupButton.addEventListener("click", function () {
  let name = document.querySelector("#signUpName").value;
  let email = document.querySelector("#signUpEmail").value;
  let password = document.querySelector("#signUpPassword").value;
  let url = "/api/user";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }), //發送JSON格式資料給後端
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data["ok"]) {
        success.textContent = "註冊成功";
      } else if (data["error"]) {
        wrong2.textContent = `${data.message}`;
      }
    });
});

order.addEventListener("click", function () {
  let url = "/api/user/auth";
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }) //發送JSON格式資料給後端
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.data != null) {
        document.location.href = "/booking";
      } else {
        signin.style.display = "block";
      }
    });
});

signout.addEventListener("click", function () {
  let url = "/api/user/auth";
  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data["ok"]) {
        document.location.href = "/";
      }
    });
});
