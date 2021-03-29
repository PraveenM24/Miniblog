function validate() {
    var flag = 0;
    fetch('https://tpgitminiblog.herokuapp.com/register')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var name = document.getElementById('name').value;
            var password = document.getElementById('password').value;
            for (var i = 0; i < data.length; i++) {
                if (name == data[i].email && password == data[i].password) {
                    window.mailid = data[i].email;
                    window.name = data[i].firstname + " " + data[i].lastname;
                    window.location.href = ('./index.html');
                    flag = 1
                }
            }
            if (flag == 0) {
                var holder1 = document.getElementById('name')
                var holder2 = document.getElementById('nicon')
                var holder3 = document.getElementById('password')
                var holder4 = document.getElementById('pwdicon')

                holder1.style = "border-color:red"
                holder2.style = "border-color:red"
                holder3.style = "border-color:red"
                holder4.style = "border-color:red"
                setTimeout(function() {
                    holder1.style = "border-color:"
                }, 3500);
                setTimeout(function() {
                    holder2.style = "border-color:"
                }, 3500);
                setTimeout(function() {
                    holder3.style = "border-color:"
                }, 3500);
                setTimeout(function() {
                    holder4.style = "border-color:"
                }, 3500);

                document.getElementById("Error").innerHTML = "Invalid Credential"

                setTimeout(function() {
                    document.getElementById("Error").innerHTML = ""
                }, 3500);
                return false;
            }
        })
        .catch(function(error) {
            console.log(error);
        });

}