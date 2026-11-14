// Obiettivo: far generare una composizione tipografica animata o interattiva
// che cambi mantenendo la coerenza con il significato del testo, senza
// ripetere mai lo stesso identico risultato.

// Vincoli:
// - tela di riferimento 800x600; se serve un altro rapporto, solo uno dei due
//   lati può essere inferiore
// - solo caratteri tipografici (lettere, numeri, segni di interpunzione e
//   simboli) disegnati con text(): niente figure geometriche, a meno che non
//   facciano parte del font scelto, né punti o contorni ricavati dalle lettere
// - testo di partenza scritto nel codice, in una stringa o in un array di
//   stringhe, anche quando l'utente può aggiungerne altro con la tastiera
// - font TTF o OTF salvato nella cartella dello sketch e caricato con
//   loadFont() dentro preload()
// - composizione animata con valori ricavati da random() oppure interattiva
//   con mouse o tastiera: un'animazione che si ripete identica a ogni
//   esecuzione non basta
// - commento iniziale con il testo di partenza e il font usato, come qui sotto
// - anteprima preview.png con un fotogramma rappresentativo del risultato

// Testo: Giuseppe Ungaretti, "Mattina"
//   https://www.studenti.it/mattina-giuseppe-ungaretti-testo-parafrasi.html
// Font: Hollywood.ttf, https://www.dafont.com/it/
// Composizione: la frase «M'illumino d'immenso» sta al centro lungo un
//   cerchio, una lettera per posizione, e il cerchio ruota lentamente. La
//   spaziatura tra le parole è uniforme, anche tra «immenso» e «M'». Il cursore
//   lascia una breve scia luminosa e illumina le lettere vicine. Dopo due
//   secondi di inattività il cursore mostra «click», che scompare al movimento
//   o al clic; dopo ricompare dopo dodici secondi. Un clic attiva il bagliore;
//   dopo qualche secondo le lettere si disperdono lentamente, una alla volta
//   con ritardi casuali. Un altro clic ripristina la schermata iniziale e
//   permette di ricominciare.

const testo = "M'illumino d'immenso";

const dimensioneTesto = 42;
const raggio = 170;
const velocitaCerchio = 0.002;
const durataBagliore = 1000;
const velocitaMinimaDispersione = 0.25;
const velocitaMassimaDispersione = 0.65;
const ritardoMassimoDispersione = 3000;
const rotazioneMassima = 0.01;
const raggioIlluminazioneMouse = 55;
const durataSciaCursore = 450;
const ritardoInvitoClick = 2000;
const intervalloInvitoClick = 12000;
const dimensioneInvitoClick = 18;
const intervalloSciaCursore = 20;
const dimensioneSciaCursore = 14;
// bagliore giallo attorno alle lettere, sovrapposto a più raggi
const coloreBagliore = '#f3f34eb0';
const livelliBagliore = [5, 10, 20, 40, 80];
const livelliBaglioreMouse = [10, 20, 40, 80];
const passoAngolare = (2 * Math.PI) / (testo.length + 1);

let font;
let lettere = [];
let sciaCursore = [];
let angoloCerchio = 0;
let inizioEffetto = null;
let ultimoPuntoScia = 0;
let ultimoMovimentoMouse = 0;
let haInteragitoConLettera = false;
let disperse = false;
let invitoClickVisibile = false;
let prossimoInvitoClick = null;

async function setup() {
  font = await loadFont('Hollywood.ttf');
  createCanvas(800, 600);
  ultimoMovimentoMouse = millis();
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(dimensioneTesto);
  fill(255);

  for (let i = 0; i < testo.length; i++) {
    lettere.push({
      carattere: testo[i],
      angolo: i * passoAngolare,
      x: 0,
      y: 0,
      rotazione: 0,
      velocitaX: 0,
      velocitaY: 0,
      velocitaRotazione: 0,
      inizioDispersione: null,
      fuori: false
    });
  }
}

function draw() {
  background('#020222');
  angoloCerchio += velocitaCerchio;

  const tempoEffetto = inizioEffetto === null ? 0 : millis() - inizioEffetto;
  const conBagliore = inizioEffetto !== null;

  if (inizioEffetto !== null && !disperse && tempoEffetto >= durataBagliore) {
    disperse = true;
    for (const lettera of lettere) {
      const angolo = atan2(lettera.y - height / 2, lettera.x - width / 2);
      const velocita = random(velocitaMinimaDispersione, velocitaMassimaDispersione);
      lettera.velocitaX = cos(angolo) * velocita;
      lettera.velocitaY = sin(angolo) * velocita;
      lettera.velocitaRotazione = random(-rotazioneMassima, rotazioneMassima);
      lettera.inizioDispersione = millis() + random(0, ritardoMassimoDispersione);
    }
  }

  fill(255);
  for (const lettera of lettere) {
    if (lettera.fuori) {
      continue;
    }

    const inDispersione = disperse && millis() >= lettera.inizioDispersione;
    if (inDispersione) {
      lettera.x += lettera.velocitaX;
      lettera.y += lettera.velocitaY;
      lettera.rotazione += lettera.velocitaRotazione;

      if (lettera.x < -dimensioneTesto || lettera.x > width + dimensioneTesto ||
          lettera.y < -dimensioneTesto || lettera.y > height + dimensioneTesto) {
        lettera.fuori = true;
        continue;
      }
    } else {
      const angolo = lettera.angolo + angoloCerchio;
      lettera.x = width / 2 + cos(angolo) * raggio;
      lettera.y = height / 2 + sin(angolo) * raggio;
      // ogni lettera segue la tangente del cerchio
      lettera.rotazione = angolo + HALF_PI;
    }

    const illuminataDalMouse =
      mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height &&
      dist(mouseX, mouseY, lettera.x, lettera.y) < raggioIlluminazioneMouse;

    push();
    translate(lettera.x, lettera.y);
    rotate(lettera.rotazione);
    if (conBagliore || illuminataDalMouse) {
      drawingContext.shadowColor = illuminataDalMouse ? '#f3f34b' : coloreBagliore;
      // il testo viene ridisegnato per ogni raggio, così il bagliore si somma
      const livelli = illuminataDalMouse ? livelliBaglioreMouse : livelliBagliore;
      for (const bagliore of livelli) {
        drawingContext.shadowBlur = bagliore;
        text(lettera.carattere, 0, 0);
      }
    } else {
      drawingContext.shadowColor = 'transparent';
      drawingContext.shadowBlur = 0;
      text(lettera.carattere, 0, 0);
    }
    pop();
  }

  const cursoreNelCanvas =
    mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  const adesso = millis();
  const primoInvitoPronto = prossimoInvitoClick === null &&
    adesso - ultimoMovimentoMouse >= ritardoInvitoClick;
  const invitoSuccessivoPronto = prossimoInvitoClick !== null &&
    adesso >= prossimoInvitoClick;
  if (!invitoClickVisibile && haInteragitoConLettera &&
      (primoInvitoPronto || invitoSuccessivoPronto)) {
    invitoClickVisibile = true;
  }
  sciaCursore = sciaCursore.filter(punto => millis() - punto.tempo < durataSciaCursore);
  if (cursoreNelCanvas) {
    noCursor();
    push();
    textAlign(CENTER, CENTER);
    if (invitoClickVisibile) {
      fill(255, 240, 150);
      textSize(dimensioneInvitoClick);
      drawingContext.shadowColor = '#f3f34b';
      drawingContext.shadowBlur = 18;
      text('click', mouseX, mouseY);
    } else {
      for (const punto of sciaCursore) {
        const eta = (millis() - punto.tempo) / durataSciaCursore;
        fill(255, 255 * (1 - eta));
        textSize(dimensioneSciaCursore * (1 - eta * 0.5));
        drawingContext.shadowColor = `rgba(243, 243, 75, ${1 - eta})`;
        drawingContext.shadowBlur = 12 * (1 - eta);
        text('*', punto.x, punto.y);
      }
      fill(255, 240, 150);
      textSize(dimensioneSciaCursore);
      drawingContext.shadowColor = '#f3f34b';
      drawingContext.shadowBlur = 18;
      text('*', mouseX, mouseY);
    }
    pop();
  } else {
    cursor(ARROW);
  }
}

function mouseMoved() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    aggiungiPuntoScia();
  }
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    aggiungiPuntoScia();
  }
}

function aggiungiPuntoScia() {
  const adesso = millis();
  ultimoMovimentoMouse = adesso;
  if (invitoClickVisibile) {
    invitoClickVisibile = false;
    prossimoInvitoClick = adesso + intervalloInvitoClick;
  }
  if (lettere.some(lettera =>
    dist(mouseX, mouseY, lettera.x, lettera.y) < raggioIlluminazioneMouse
  )) {
    haInteragitoConLettera = true;
  }
  if (adesso - ultimoPuntoScia >= intervalloSciaCursore) {
    sciaCursore.push({ x: mouseX, y: mouseY, tempo: adesso });
    ultimoPuntoScia = adesso;
  }
}

function mousePressed() {
  if (invitoClickVisibile) {
    invitoClickVisibile = false;
    prossimoInvitoClick = millis() + intervalloInvitoClick;
  }

  if (inizioEffetto !== null) {
    inizioEffetto = null;
    disperse = false;
    angoloCerchio = 0;
  } else {
    inizioEffetto = millis();
  }

  for (const lettera of lettere) {
    lettera.fuori = false;
    lettera.velocitaX = 0;
    lettera.velocitaY = 0;
    lettera.velocitaRotazione = 0;
    lettera.inizioDispersione = null;
  }
}
