// Quadro: Vassily Kandinsky, "Color Study: Squares with Concentric Circles", 1913
// Fonte: https://it.wikipedia.org/wiki/File:Vassily_Kandinsky,_1913_-_Color_Study,_Squares_with_Concentric_Circles.jpg
// Regola cromatica: le combinazioni di colori cambiano ad ogni tocco del cursore, ogni forma è a sé
//   base in bianco e nero, alternata a scacchiera fra i quadrati e fra gli anelli;
//   al clic solo la forma cliccata prende un colore saturo della palette,
//   scelto in modo indipendente dalle altre forme

// griglia: 4 colonne per 3 righe, quadrati di 200 px
let colonne = 4;
let lato = 200;

// diametri dei cerchi concentrici, dal più grande al più piccolo
let diametri = [170, 125, 80, 40];

// piccoli scostamenti del centro dei cerchi, per mantenere il disegno a mano libera
let scarti = [
  [0, 0], [-6, 4], [5, -3], [-4, 6],
  [6, 2], [-5, -5], [4, 3], [-3, -4],
  [2, 5], [-6, 2], [5, 4], [-4, -3]
];

// colori iniziali in HSL: il bianco è [0, 0, 100], il nero è [0, 0, 0]
// per ogni quadrato: sfondo e quattro cerchi, in alternanza
let configurazioni = [
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]],
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]],
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]],
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]],
  [[0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100]],
  [[0, 0, 0], [0, 0, 100], [0, 0, 0], [0, 0, 100], [0, 0, 0]]
];

// toni ammessi per la forma cliccata: primari e pochi secondari
let toniAmmessi = [0, 25, 50, 130, 210, 280];

// limiti di saturazione e luminosità per il colore della forma cliccata
let saturazioneMinima = 70;
let saturazioneMassima = 100;
let luminositaMinima = 30;
let luminositaMassima = 75;

function setup() {
  createCanvas(800, 600);
  colorMode(HSL);
  rectMode(CENTER);
}

function draw() {
  background(0, 0, 8);

  for (let i = 0; i < configurazioni.length; i++) {
    let x = (i % colonne) * lato + lato / 2;
    let y = floor(i / colonne) * lato + lato / 2;
    let colori = configurazioni[i];

    stroke(0, 0, 10);
    strokeWeight(3);
    let sfondo = colori[0];
    fill(sfondo[0], sfondo[1], sfondo[2]);
    rect(x, y, lato, lato);

    noStroke();
    for (let j = 0; j < diametri.length; j++) {
      let colore = colori[j + 1];
      fill(colore[0], colore[1], colore[2]);
      circle(x + scarti[i][0], y + scarti[i][1], diametri[j]);
    }
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) {
    return;
  }

  // individuo il quadrato cliccato
  let colonnaCliccata = floor(mouseX / lato);
  let rigaCliccata = floor(mouseY / lato);
  let indice = rigaCliccata * colonne + colonnaCliccata;
  if (indice < 0 || indice >= configurazioni.length) {
    return;
  }

  let x = colonnaCliccata * lato + lato / 2;
  let y = rigaCliccata * lato + lato / 2;
  let distanza = dist(mouseX, mouseY, x + scarti[indice][0], y + scarti[indice][1]);

  // i cerchi vanno dal più grande al più piccolo: l'ultimo che contiene
  // il cursore è quello che si vede sopra gli altri
  let elemento = 0;
  for (let j = 0; j < diametri.length; j++) {
    if (distanza <= diametri[j] / 2) {
      elemento = j + 1;
    }
  }

  // solo la forma cliccata esce dal bianco e nero: sceglie il proprio tono
  // dentro la palette, senza legami con le altre forme
  let tono = random(toniAmmessi);
  let saturazione = random(saturazioneMinima, saturazioneMassima);
  let luminosita = random(luminositaMinima, luminositaMassima);

  configurazioni[indice][elemento] = [tono, saturazione, luminosita];
}
