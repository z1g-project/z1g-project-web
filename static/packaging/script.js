var objPeople = [
	{ 
		username: "Sliqqo",
		password: "xLBC22m6Wu4hLFC7Fcny2qFFgnY8yr"
  	},
  	{
    	username: "Playallday383",
    	password: "GpM32xC5QF2K6rxHLvFbr2L32xtYgT"
  	},
    {
username: "Syferz",
password: "Bruno024!"

    },
    {
username: "zoom.exe",
password: "helloisaac"

    },
    {
username: "Admin",
password: "cuteware.xyzwinning"

    },
    {
username: "123",
password: "123"

    },
    {
      username: "Capital!#7390",
      password: "Terms@Service08"
    },
    {
username: "fishboy",
password: "quincy123"

    },
    {
username: "notlucas",
      password: "urmumhah"
    },
    {
    	username: "XSTARS",
    	password: "rich writes"
  	},
    {
    	username: "fatboy69",
    	password: "Hayden2415"
  	},
    {
    	username: "Showcase_Account",
    	password: "z1g-winning"
  	},
    {
    	username: "mcy123",
    	password: "cms123"
  	},
    {
    	username: "Imani",
    	password: "Quincy123"
  	}
]

function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		
		if(username == objPeople[i].username && password == objPeople[i].password) {
			console.log("Welcome Back " + username)
			alert("Welcome Back " + username)
			window.location.href = "/Premium/Home";
			return
		}
	}
	console.log("Inccorect username and/or password :(")
	alert("Incorect Username and Password")
}