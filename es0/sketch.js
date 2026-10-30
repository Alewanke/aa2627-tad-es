// Obiettivo: realizzare un primo sketch seguendo la guida «Programmazione di
// base con p5.js e VS Code», poi modificarlo con l'assistenza dell'agente.

// Vincoli:
// - seguire la guida dal capitolo 1 alla fine, scrivendo il codice a mano qui
// - tenere aperta l'anteprima con Live Server e controllare il risultato a ogni passaggio
// - nella seconda fase chiedere all'agente due o tre modifiche, una per volta,
//   leggendo il codice proposto prima di applicarlo
// - la tela è 800 × 600, come nella guida
// - non c'è un risultato da raggiungere: le modifiche possono riguardare forme,
//   colori, movimento o reazione al mouse
// - alla consegna va aggiunta l'anteprima preview.png

let tono

function setup() {
    createCanvas(800, 600)
    colorMode(HSL)
    tono = random(360)
    background(20)
}

function draw() {
    if (mouseIsPressed) {
        stroke(100)
        fill(tono, 100, 40)
        let x = mouseX
        let y = mouseY
        let dx = 2
        let dy = 2
        for (let i = 0; i < 50; i = i + 1) {
            x = x + dx
            y = y + dy
            square(x, y, (50-i)/2)
            if (random() < 0.1) {
                dx = random(-10, 10)
                dy = random(-10, 10)
            }
        }
        if (random() < 0.02) {  // due volte su cento...
            tono = random(360)  // cambia il tono del riempimento
        }
    }
}