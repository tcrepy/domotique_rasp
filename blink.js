let Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
let LED = new Gpio(4, 'out'); //use GPIO pin 12, and specify that it is output
// var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

let request = require('request');

let initialData;

let params = {};

request({
    url: "http://149.202.41.94:8080/select",
    method: "POST",
    json: true,
    body: params
}, function (error, response, body) {
    initialData = body;
    console.log(initialData);
    setInterval(function () {
        request({
            url: "http://149.202.41.94:8080/select",
            method: "POST",
            json: true,
            body: params
        }, function (error, response, body) {

            //on verifie qu'il n'y a pas eu de suppression ou d'ajout de lampes
            if (body.length !== initialData.length) {
                initialData = body;
            }
            else {
                for (let i = 0; i < body.length; i++) {
                    //on verifie l'etat de la lampe, si il a changé, on allume ou on eteint
                    //verification de LED.read() si il est dans le meme etat que la bdd
                    if (body[i]['SW_BOOL'] !== initialData[i]['SW_BOOL']) {
                        //TODO::Faire le LED.write()
                        blinkLED(body[i]);
                        console.log(body[i]['SW_GPIO_ID']);
                        initialData = body;
                    }
                }
            }

        });
    }, 500);
});


function blinkLED(body) { //function to start blinking
    if (LED.readSync() != body['SW_BOOL']) { //check the pin state, if the state is 0 (or off)
        LED.writeSync(body['SW_BOOL']); //set pin state to 1 (turn LED on)
    }
}
//
// function endBlink() { //function to stop blinking
//   clearInterval(blinkInterval); // Stop blink intervals
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
//   console.log('endBlink');
// }
//
// setTimeout(endBlink, 5000); //stop blinking after 5 seconds
