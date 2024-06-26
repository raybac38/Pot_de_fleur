light_level = 4;
temperature_level = 0;
air_humidity_level = 0;
dirt_humidity_level = 0;

const socket = io();
function Charger_menu_pots() {
    window.location.href = "pots.html";
}

function Charger_menu_principale() {
    window.location.href = "menu.html";
}

function load() {
    ///Fonction s'occupant du chargement
    //document.getElementById("thermometre_ascii_art")

}

function show_air_humidity_level_ui(level)
{
    document.getElementById("air_humidity_value").innerText = "Air :" + level + "%";

    code = Math.floor(level / 20);

    if(code < 0) code = 0;
    if(code > 4) code = 4;

    link_code = "/ascii_art/pourcentage" + code + ".txt";

    fetch(link_code)
    .then((res) => res.text())
    .then((text) => {
        document.getElementById("air_humidity").innerText = text;
    })
    .catch((e) => console.error(e));

}

function show_dirt_humidity_level_ui(level)
{
    document.getElementById("dirt_humidity_value").innerText = "Terre :" + level + "%";


    code = Math.floor(level / 20);

    if(code < 0) code = 0;
    if(code > 4) code = 4;

    link_code = "/ascii_art/pourcentage" + code + ".txt";

    fetch(link_code)
    .then((res) => res.text())
    .then((text) => {
        document.getElementById("dirt_humidity").innerText = text;
    })
    .catch((e) => console.error(e));

}

function show_temperature_level_ui(level)
{
    document.getElementById("temperature_value").innerText = "Temperature : " + level + "°C";
	level = Math.round(level / 10);
    if(level < -2) level = -2;
    if(level > 10) level = 10;

    code = level + 2;

    link_code = "/ascii_art/thermometre"+code+".txt";

    fetch(link_code)
    .then((res) => res.text())
    .then((text) => {
        document.getElementById("thermometre").innerText = text;
    })
    .catch((e) => console.error(e));

}


function show_light_level_ui(level)
{
    link_code = "/ascii_art/";
    switch (level) {
        case 0:
            link_code += "luny";
            break;
        case 1:
            link_code += "cloudy";
            break;
        case 2:
            link_code += "cloudy&sunny";
            break;        
        case 3:
            link_code += "sunny";
            break;    
        default:
            link_code += "error";
            break;
    }
    link_code += ".txt";

    fetch(link_code)
    .then((res) => res.text())
    .then((text) => {
        document.getElementById("brightness").innerText = text;
    })
    .catch((e) => console.error(e));
}

///////////////////
/// EVENT FROM SERVER


socket.on('light_level', (data) =>
{
    console.log("Reciving light level data : " + data);

    if(data != light_level)
    {
        light_level = data;
        show_light_level_ui(data);
        console.log("mise a jours de L UI");
    }
});

socket.on('temperature', (data) =>
{
    console.log("Reciving temperature level data : " + data);

    if(data != temperature_level)
    {
        temperature_level = data;
        show_temperature_level_ui(data);
        console.log("mise a jours de L UI");
    }
});

socket.on('air_humidity', (data) =>
{
    console.log("Reciving air humidity level data : " + data);

    if(data != air_humidity_level)
    {
        air_humidity_level = data;
        show_air_humidity_level_ui(data);
        console.log("mise a jours de L UI");
    }
});


socket.on('dirt_humidity', (data) =>
{
    console.log("Reciving dirt humidity level data : " + data);

    if(data != dirt_humidity_level)
    {
        dirt_humidity_level = data;
        show_dirt_humidity_level_ui(data);
        console.log("mise a jours de L UI");
    }
});

socket.on('is_arduino_connected', (data) =>
{
    console.log("Etat de l'arduino : " + data);

    if(data) 
    {
        //Elle est connecter
        document.getElementById('overlay').style.display = "none";
    }else
    {
        document.getElementById('overlay').style.display = 'flex';
    }

})

socket.on('motor_on_off', (data) =>
{
    document.getElementById('motor_on_off').checked = data;
})

socket.on('motor_auto',(data) => 
{
    document.getElementById('motor_auto').checked = data;
})

socket.on('arrosage', (data) =>
{

    let watering_status = document.getElementById('wattering_status');
    if(data == true)
    {
        watering_status.innerText = "Watering status : ON";
    }
    else
    {
        watering_status.innerText = "Watering status : OFF";
    }
})

socket.on('is_active_mode', (data) =>
{
    document.getElementById('activ_mode').checked = data;
})

socket.on('is_lcd_on', (data) =>
{
    document.getElementById('screen_on_off').checked = data;

})

function arduino_change_active()
{
    let value = document.getElementById('activ_mode').checked;
    if(value == true)
    {
        emit_commande("mode actif");
    }
    else
    {
        emit_commande("mode auto");
    }
}

function motor_manuel()
{
    let value = document.getElementById('motor_on_off').checked;

    if(value == true)
    {
        emit_commande("moteur on");
    }
    else
    {
        emit_commande("moteur off");
    }
}

function motor_manuel_auto()
{
    let value = document.getElementById('motor_auto').checked;


    if(value == true)
    {
        emit_commande("moteur auto");
    }
}

function change_screen_mode()
{
    let value = document.getElementById('screen_on_off').checked;



    if(value == true)
    {
        emit_commande("moteur on");
    }
    else
    {
        emit_commande("screen off")
    }
}

function emit_commande(message)
{
    socket.emit('cmd_arduino', (message));
}