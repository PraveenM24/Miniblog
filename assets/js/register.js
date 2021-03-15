function postData() {

    var fname = document.getElementById('firstname').value;
    var lname = document.getElementById('lastname').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;
    var cpwd = document.getElementById('confirm-password').value;
    var batch = document.getElementById('batch').value;
    var dep = document.getElementById('department').value;

    if (pwd != cpwd) {
        var holder1 = document.getElementById('password');
        var holder2 = document.getElementById('pwdicon');
        var holder3 = document.getElementById('confirm-password');
        var holder4 = document.getElementById('cpwdicon');

        holder1.style = "border-color:red";
        holder2.style = "border-color:red";
        holder3.style = "border-color:red";
        holder4.style = "border-color:red";

        setTimeout(function() {
            holder1.style = "border-color:";
        }, 3500);
        setTimeout(function() {
            holder2.style = "border-color:";
        }, 3500);
        setTimeout(function() {
            holder3.style = "border-color:";
        }, 3500);
        setTimeout(function() {
            holder4.style = "border-color:";
        }, 3500);
        return false;
    }

    fetch('https://tpgitminiblog.herokuapp.com/register', {
            method: 'POST',
            body: JSON.stringify({
                firstname: fname,
                lastname: lname,
                email: email,
                password: pwd,
                batch: batch,
                department: dep
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            window.location.href = ("./login.html")
        })
        .catch(function(error) {
            console.log(error);
        });
}