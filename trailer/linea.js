// Línea de tiempo común del video (index.html) y la música (audio.js), a 128 pulsos por minuto.
// Cada escena se escribió con sus propios tiempos internos; las anclas [interno, salida] los estiran o encogen
// para que los momentos clave (cada mezcla, cada cifra, la meta, el sello, el logo) caigan sobre un pulso.
(function (raiz) {
  const PULSO = 60 / 128;
  const B = n => +(n * PULSO).toFixed(5);
  const ESCENAS = [
    { n: 1, ini: B(0), fin: B(12), anclas: [[0, 0], [1.1, B(4) - .56], [1.66, B(4)], [2.5, B(4) + .84], [3.0, 5.0], [3.6, B(12)]] },
    { n: 2, ini: B(12), fin: B(24), anclas: [[3.6, B(12)], [4.17, B(13)], [5.02, B(16)], [5.82, B(19)], [6.62, B(22)], [7.6, B(24)]] },
    { n: 3, ini: B(24), fin: B(36), anclas: [[7.6, B(24)], [8.85, B(28)], [9.95, B(32)], [11.1, B(36)]] },
    { n: 4, ini: B(36), fin: B(50), anclas: [[10.8, B(36)], [12.75, B(42)], [13.45, B(43.5)], [15.6, B(50)]] },
    { n: 5, ini: B(50), fin: B(62), anclas: [[15.6, B(50)], [15.95, B(51)], [17.75, B(56)], [19.4, B(62)]] },
    { n: 6, ini: B(62), fin: B(78), anclas: [[19.4, B(62)], [19.95, 29.75], [20.8, B(70)], [21.5, B(72)], [22.3, 34.6], [23.4, B(78)]] },
    { n: 7, ini: B(78), fin: B(88), anclas: [[23.4, B(78)], [23.45, 36.6], [24.2, B(81)], [24.95, B(84)], [26.6, B(88)]] },
    { n: 8, ini: B(88), fin: B(96), anclas: [[26.6, B(88)], [27.95, 42.6], [29.6, B(96)]] },
    { n: 9, ini: B(96), fin: B(104), anclas: [[0, B(96)], [3.75, B(104)]] }
  ];
  const tramo = (a, x, i, o) => {
    if (x <= a[0][i]) return a[0][o];
    for (let j = 1; j < a.length; j++) if (x <= a[j][i]) { const [p, q] = [a[j - 1], a[j]]; return p[o] + (q[o] - p[o]) * (x - p[i]) / (q[i] - p[i]); }
    return a[a.length - 1][o];
  };
  const interno = (n, t) => tramo(ESCENAS[n - 1].anclas, t, 1, 0);   // tiempo de salida → tiempo interno de la escena
  const salida = (n, ti) => tramo(ESCENAS[n - 1].anclas, ti, 0, 1);  // tiempo interno → tiempo de salida
  const CORTES = ESCENAS.slice(1).map(e => e.ini);
  raiz.LINEA = { PULSO, B, ESCENAS, interno, salida, CORTES, DUR: B(104) };
})(typeof window !== "undefined" ? window : module.exports);
