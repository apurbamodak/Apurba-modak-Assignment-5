document.getElementById("signIn-btn").addEventListener("click", function () {
    const inputUsername = document.getElementById("input-username");
    const userName = inputUsername.value;
    console.log(userName);

    const inputPassword = document.getElementById("input-password");
    const Password = inputPassword.value;
    console.log(Password);

    if (userName == "admin" && Password == "admin123") {
        alert("Sign In successfully");
        window.location.assign("/home.html");
    } else {
        alert("Sign in failed");
        return;
    }
});