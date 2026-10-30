// Obiettivo: animare un'illusione ottica geometrica composta da elementi
// uguali ripetuti, con un movimento che ne conserva l'effetto oppure lo
// annulla e lo ripristina a intervalli.

// Vincoli:
// - illusione geometrica in bianco e nero, formata da molti elementi uguali
//   ripetuti secondo una regola (escluse quelle di due sole figure)
// - tela di riferimento 800x600; se serve un altro rapporto, solo uno dei
//   due lati può essere inferiore
// - solo bianco, nero e grigi, indicati con un solo valore (più l'eventuale
//   trasparenza)
// - elementi ripetuti generati con cicli for, non disegnati uno per uno
// - parametri numerici in variabili dichiarate all'inizio del file,
//   compresi quelli critici
// - movimento in draw(), applicato agli elementi o ai parametri critici:
//   ruotare o spostare l'intera immagine non basta
// - alla consegna va aggiunta l'anteprima preview.png, con un fotogramma in
//   cui l'effetto è visibile

// Illusione: Out of Focus, di Akiyoshi Kitaoka
// Fonte: https://michaelbach.de/ot/mot-eyeJitter/
// Regola: lo sfondo è un pattern di piccoli quadrati neri disposti come un
// codice QR; sopra, un rettangolo grande quanto il canvas con rombi bianchi
// e neri sfumati. Il rettangolo ruota e si sposta rispetto allo sfondo, e i
// suoi vuoti lasciano vedere i quadrati. I quadrati scorrono; tenendo premuto
// il mouse diventano grigi, rilasciandolo tornano neri.
// Parametri critici:
// - latoQuadrato: lato dei quadrati dello sfondo
// - passoGriglia: distanza fra i quadrati dello sfondo
// - latoRombo: lato dei rombi
// - sfumatura: quantità di sfocatura dei rombi
//   effetto più evidente con ..., nessun effetto con ...

let latoQuadrato = 24
let passoGriglia = 30
let latoRombo = 20
let sfumatura = 6
let velocita = 0.5
let velocitaRotazione = 0.001
let velocitaQuadrati = 1
let grigioQuadrati = 128

let rettangoloX
let rettangoloY
let angoloRettangolo = 0
let mouseAttivo = false
let spostamentoQuadrati = 0

function setup() {
    createCanvas(600, 600)
    rettangoloX = width / 2
    rettangoloY = height / 2
    noStroke()
}

function draw() {
    background(255)
    // il rettangolo ruota continuamente
    angoloRettangolo = angoloRettangolo + velocitaRotazione
    // i quadrati scorrono in orizzontale
    spostamentoQuadrati = (spostamentoQuadrati + velocitaQuadrati) % passoGriglia
    disegnaQuadratiSfondo()
    muoviRettangolo()
    disegnaRettangolo()
}

// il mouse deve essersi mosso almeno una volta, altrimenti il rettangolo
// partirebbe verso l'angolo in alto a sinistra
function mouseMoved() {
    mouseAttivo = true
}

function disegnaQuadratiSfondo() {
    if (mouseIsPressed) {
        fill(grigioQuadrati)
    } else {
        fill(0)
    }
    for (let y = 0; y < height; y = y + passoGriglia) {
        for (let x = -passoGriglia; x < width + passoGriglia; x = x + passoGriglia) {
            square(x + spostamentoQuadrati, y, latoQuadrato)
        }
    }
}

// il rettangolo si avvicina al cursore
function muoviRettangolo() {
    if (!mouseAttivo) {
        return
    }
    let dx = mouseX - rettangoloX
    let dy = mouseY - rettangoloY
    let distanza = sqrt(dx * dx + dy * dy)
    if (distanza > velocita) {
        rettangoloX = rettangoloX + dx / distanza * velocita
        rettangoloY = rettangoloY + dy / distanza * velocita
    }
}

function disegnaRettangolo() {
    let raggio = sqrt(width * width + height * height) / 2
    let celle = ceil(raggio / latoRombo) + 2

    push()
    translate(rettangoloX, rettangoloY)
    rotate(angoloRettangolo)

    // il ritaglio rettangolare tiene il pattern dentro il rettangolo
    drawingContext.save()
    drawingContext.beginPath()
    drawingContext.rect(-width / 2, -height / 2, width, height)
    drawingContext.clip()

    // la sfocatura è ciò che rende "out of focus" il pattern interno
    drawingContext.filter = 'blur(' + sfumatura + 'px)'
    disegnaRombi(celle)

    drawingContext.restore()
    pop()
}

function disegnaRombi(celle) {
    for (let i = -celle; i <= celle; i = i + 1) {
        for (let j = -celle; j <= celle; j = j + 1) {
            let x = i * latoRombo
            let y = j * latoRombo
            if ((i + j) % 2 === 0) {
                fill(0)
            } else {
                fill(255)
            }
            quad(x, y - latoRombo / 2, x + latoRombo / 2, y, x, y + latoRombo / 2, x - latoRombo / 2, y)
        }
    }
}
