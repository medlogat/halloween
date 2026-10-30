// Contenuti riservati: restano sul server e vengono inviati solo quando servono.

export const CHARS = ['falchi', 'beatrice', 'leone', 'vicky', 'tancredi', 'gaspare'];

const ul = (items) => '<ul>' + items.map((i) => `<li>${i}</li>`).join('') + '</ul>';
const block = (tag, body) => `<div class="block"><span class="tag">${tag}</span>${body}</div>`;

export const SECRETS = {
  falchi: [
    block('Chi sei', '<p>Non sei un sospettato: sei arrivato alle 20:50, quando Ottavio era già morto. Ieri Ottavio ti ha telefonato: «Domani sera ti servirà il tuo vecchio distintivo, Corrado. Qualcuno in famiglia mi tradisce da anni, e a mezzanotte lo dirò davanti a tutti.» Non ti ha detto chi.</p>'),
    block('Cosa sai all’inizio', ul([
      'Ottavio è andato a riposare in camera poco dopo le 20:00 ed è stato trovato morto alle 20:50 dal Dottor Lupo.',
      'Nessuno è entrato o uscito di casa: l’assassino è uno dei cinque.',
      'La busta di mezzanotte è sparita. Chi l’ha presa ha il movente più forte.',
    ])),
    block('I tuoi poteri', ul([
      'Guidi le tre perquisizioni: decidi l’ordine in cui si cerca e chi legge gli indizi.',
      'Hai due Domande di Verità in tutta la serata: una domanda sì o no a un sospettato, che deve rispondere sinceramente. Solo due: usale quando hai già un sospetto preciso.',
      'Al dolce parli per primo e ricostruisci il delitto davanti a tutti.',
    ])),
    block('Come indagare', ul([
      'Usa il Taccuino in questa app: una riga per ogni orario, una colonna per ogni sospettato.',
      'Chiedi a tutti: «Dove eri, minuto per minuto?», «Quando hai visto Ottavio vivo per l’ultima volta?», «Chi hai visto passare in corridoio?»',
      'Il Dottor Lupo è un medico: chiedigli cosa ha notato sul corpo.',
      'Confronta le versioni: due persone che si coprono a vicenda forse nascondono qualcos’altro.',
    ])),
    block('I tuoi obiettivi', ul([
      'Scoprire chi ha ucciso Ottavio, come e perché.',
      'Smascherare i segreti degli altri: 1 punto per ogni segreto scoperto e detto ad alta voce.',
    ])),
  ].join(''),

  beatrice: [
    block('Il tuo segreto', '<p>Tu e Leone siete al verde. Da mesi porti di nascosto al Monte dei Pegni i gioielli di famiglia, uno alla volta. Sei convinta che la busta di mezzanotte parli di te.</p><p>Per questo, alle 20:10, in cucina, hai sciolto due compresse del tuo sonnifero nella camomilla dello zio: volevi che dormisse, per poter prendere la busta dal comodino. Alle 20:15 gliel’hai portata in camera e lui l’ha bevuta, brontolando. Poi ti è mancato il coraggio e non sei tornata a prendere la busta.</p>'),
    block('Cosa hai fatto stasera', ul([
      '20:10 – 20:15: in cucina a preparare la camomilla. Leone cucinava a due passi da te.',
      '20:15: hai portato la camomilla in camera.',
      'Dalle 20:17 alle 20:50: in salotto ad accendere candele e sistemare la tavola.',
    ])),
    block('Cosa hai visto', ul([
      'Gaspare è rimasto in salotto a bere fino alle 20:25, poi è uscito dicendo «vado a sgranchirmi le gambe».',
      'Alle 20:28 hai visto Leone uscire dalla cucina e andare verso la camera. Ti preoccupa: non sai perché.',
      'Alle 20:33 è arrivata in salotto Vicky, con il trucco rifatto. Alle 20:38 è uscita «a prendere il rossetto in bagno» ed è tornata alle 20:42.',
      'Alle 20:42 è entrato in salotto anche Gaspare. Aveva le mani umide e se le asciugava sui pantaloni.',
      'Dalle 20:33 alle 20:42 Gaspare in salotto non c’era: ne sei sicura.',
    ])),
    block('I tuoi obiettivi (1 punto ciascuno)', ul([
      'Non far scoprire i gioielli al Monte dei Pegni.',
      'Proteggere Leone da ogni sospetto.',
      'Farti dire da qualcuno che sei una padrona di casa impeccabile.',
    ])),
    '<p class="note">Non sei l’assassina. Puoi mentire solo per proteggere il tuo segreto, e il sonnifero fa parte del tuo segreto.</p>',
  ].join(''),

  leone: [
    block('Il tuo segreto', '<p>Il tuo ristorante è sull’orlo del fallimento. Un anno fa Ottavio ti ha prestato 50.000 euro e ti ha fatto firmare una cambiale che scade il 1° novembre: dopodomani. La teneva nel cassetto del comodino. Stasera l’hai rubata e l’hai bruciata sul fornello.</p>'),
    block('Cosa hai fatto stasera', ul([
      'Dalle 20:00 alle 20:28: in cucina a preparare la cena.',
      '20:28 – 20:32: in camera da letto. Ottavio dormiva profondamente e russava. Hai preso la cambiale dal cassetto e hai lasciato lì la cartellina vuota.',
      'Dalle 20:33 alle 20:50: di nuovo in cucina. Hai bruciato la cambiale e buttato i resti nel forno spento.',
      'Dalle 20:34 alle 20:44 il Dottor Lupo è stato in cucina con te, a rubare assaggi.',
    ])),
    block('Cosa hai visto e sentito', ul([
      'Alle 20:10 Beatrice ha preparato la camomilla per lo zio e l’ha mescolata a lungo. Non ci hai fatto caso.',
      'Alle 20:30 Ottavio era vivo: russava forte.',
      'Sul comodino c’era una busta chiusa con scritto “Da aprire a mezzanotte”. Non l’hai toccata.',
      'Uscendo dalla camera, alle 20:32, hai sentito l’acqua scorrere in bagno e due voci bisbigliare: un uomo e una donna.',
      'Nel corridoio hai incrociato Gaspare, fermo vicino alla porta della camera, con le mani in tasca. Ti ha fatto un sorrisetto.',
    ])),
    block('I tuoi obiettivi (1 punto ciascuno)', ul([
      'Non far scoprire la cambiale.',
      'Farti fare almeno tre complimenti per la cena.',
      'Difendere Beatrice ogni volta che qualcuno la accusa.',
    ])),
    '<p class="note">Non sei l’assassino. Se ti chiedono quando hai visto Ottavio vivo l’ultima volta, devi dire la verità. Sul motivo per cui eri in camera puoi mentire.</p>',
  ].join(''),

  vicky: [
    block('Il tuo segreto', '<p>Hai una relazione segreta con il Dottor Tancredi Lupo. Ottavio l’aveva scoperto: aveva pagato un investigatore privato per farvi fotografare insieme.</p>'),
    block('Cosa hai fatto stasera', ul([
      '20:20 – 20:24: in camera da letto. Ottavio era strano, mezzo addormentato. Ti ha detto che sapeva tutto, che il matrimonio era annullato e che a mezzanotte vi avrebbe svergognati. Mentre litigavate ti ha stretto forte il polso. Sei uscita in lacrime e lui si stava già riaddormentando.',
      '20:25 – 20:32: in bagno con Tancredi, a decidere cosa fare. Lui ti ha detto che le foto erano nel cassetto del comodino e che ci avrebbe pensato lui. Intanto ti sei sistemata lo smalto con l’acetone che tieni in borsetta.',
      '20:33 – 20:38: in salotto con Beatrice.',
      '20:38 – 20:42: sei tornata in bagno a riprendere il rossetto dimenticato, poi di nuovo in salotto.',
    ])),
    block('Cosa hai visto', ul([
      'Alle 20:39 la porta del bagno era chiusa a chiave e dentro l’acqua scorreva da parecchio.',
      'Alle 20:41 dal bagno è uscito un uomo e si è allontanato in fretta. Il corridoio era buio e l’hai visto solo di spalle: non sai chi fosse. Nell’aria è rimasto un odore pungente.',
      'Il tuo glitter dorato è dappertutto: sul polso, sul vestito, sul divano.',
    ])),
    block('I tuoi obiettivi (1 punto ciascuno)', ul([
      'Non far scoprire la relazione con Tancredi.',
      'Chiamare ogni ospite “tesoro” almeno una volta.',
      'Scoprire chi ha preso le foto dal cassetto.',
    ])),
    '<p class="note">Non sei l’assassina. Puoi mentire solo per proteggere il tuo segreto.</p>',
  ].join(''),

  tancredi: [
    block('Il tuo segreto', '<p>Hai una relazione segreta con Vicky, la fidanzata di Ottavio. Lui lo aveva scoperto e teneva le foto nel cassetto del comodino. Quando hai trovato il corpo, prima di dare l’allarme, hai preso le foto. Nella fretta ne hai strappato un angolo.</p>'),
    block('Cosa hai fatto stasera', ul([
      '20:05: hai dato a Ottavio un’aspirina per il mal di testa. Era sveglio e lucido.',
      '20:25 – 20:32: in bagno con Vicky. Hai perso lì uno dei tuoi gemelli d’oro.',
      '20:34 – 20:44: in cucina con Leone, ad assaggiare il sugo.',
      '20:45: sei andato in camera per il controllo della pressione delle 20:45, come ogni sera. Ottavio era morto. Hai preso le foto dal cassetto e solo alle 20:50 hai gridato.',
      'Nella confusione, poco dopo, hai nascosto le foto sotto il cuscino della poltrona in salotto.',
    ])),
    block('Cosa hai notato sul corpo', '<p>È la verità, devi dirla se qualcuno ti chiede del corpo:</p>' + ul([
      'Ottavio è morto soffocato: piccole macchie rosse negli occhi, una piuma tra le labbra, il cuscino a terra.',
      'Le pupille erano strettissime: aveva preso un sonnifero. La dose però non era mortale, lo ha solo fatto dormire profondamente.',
      'Era morto da poco, una decina di minuti al massimo: tra le 20:33 e le 20:45.',
      'Alle 20:45 sul comodino la busta di mezzanotte non c’era più.',
    ])),
    block('I tuoi obiettivi (1 punto ciascuno)', ul([
      'Non far scoprire la relazione con Vicky.',
      'Dare almeno due consigli medici non richiesti.',
      'Far cadere i sospetti su Leone o su Beatrice.',
    ])),
    '<p class="note">Non sei l’assassino. Puoi mentire solo per proteggere il tuo segreto: anche i cinque minuti tra le 20:45 e le 20:50 fanno parte del segreto.</p>',
  ].join(''),

  gaspare: [
    block('Il tuo segreto', '<p class="kill">Sei tu l’assassino.</p><p>Tre anni fa, pieno di debiti, hai venduto di nascosto la vera Bauta d’oro a un collezionista svizzero e l’hai sostituita con una copia dipinta da te, cartapesta e vernice dorata. Ottavio ha fatto fare una perizia: la busta di mezzanotte conteneva la prova e un biglietto per te. A mezzanotte ti avrebbe denunciato.</p>'),
    block('Cosa hai fatto stasera', ul([
      'Fino alle 20:25: in salotto a bere vino rosso.',
      '20:28 – 20:33: nel corridoio, ad aspettare il momento giusto. Hai visto Leone entrare in camera e uscire alle 20:32.',
      '20:34: sei entrato in camera. Ottavio dormiva come un sasso. Hai preso la busta dal comodino, ma lui si è svegliato a metà e ti ha afferrato la mano. Lo hai soffocato con il cuscino.',
      '20:38 – 20:41: in bagno, a togliere dalle dita la vernice dorata con l’acquaragia. Hai nascosto l’asciugamano sporco in fondo alla cesta.',
      '20:42: sei entrato in salotto con la busta sotto il gilet. Quando tutti sono corsi in camera, l’hai infilata dentro un libro.',
    ])),
    block('La tua versione (falsa)', '<p class="paper">«Dalle 20:25 alle 20:45 ero in salotto a guardare la collezione di maschere. Non mi sono mosso da lì.»</p><p class="note">Se qualcuno ti smentisce, inventa: eri in bagno, il vino ti aveva fatto male allo stomaco.</p>'),
    block('Come salvarti', ul([
      'Hai visto Leone entrare in camera alle 20:28: usalo.',
      'La camomilla l’ha portata Beatrice: insinua il dubbio.',
      'Vicky ha litigato con Ottavio, è coperta di glitter dorato e gira con l’acetone per lo smalto: ricordalo a tutti.',
      'Leone aveva debiti con Ottavio: se salta fuori la storia della maschera venduta, chiunque avesse bisogno di soldi poteva farlo.',
      'Alla Domanda di Verità devi rispondere sinceramente. Per il resto, menti con eleganza.',
    ])),
    block('I tuoi obiettivi (1 punto ciascuno)', ul([
      'Far accusare qualcun altro dall’ispettore.',
      'Criticare almeno un oggetto della casa.',
      'Proporre un brindisi “all’arte”.',
    ])),
    '<p class="note">Puoi mentire su tutto. Non confessare mai.</p>',
  ].join(''),
};

export const CLUE_TEXT = {
  1: '<p>Ottavio è supino sul letto. La federa del cuscino è strappata, ci sono piume d’oca sul lenzuolo e una piuma tra le sue labbra.</p><p>Sotto le unghie della mano destra: tracce di una sostanza dorata e brillante.</p>',
  2: '<p>Sul comodino, una tazza di camomilla vuota.</p><p>Sul fondo è rimasta una polvere bianca, dall’odore amaro.</p>',
  3: '<p>Il cassetto del comodino è stato frugato. Dentro ci sono una cartellina vuota con scritto “Cambiali – L. Varani”, una busta vuota dell’agenzia investigativa “Occhio di Lince” e l’angolo strappato di una foto: una mano di donna con un anello a serpente stretta a una mano d’uomo con un gemello d’oro.</p>',
  4: '<p>Un blister di sonnifero “Dormilux”. Mancano due compresse.</p><p>Etichetta della farmacia: <em>“Sig.ra Beatrice Musagu”</em>.</p>',
  5: '<p>Frammenti di carta bruciata, anneriti dal fuoco.</p><p>Si legge ancora: <em>“…cambiale… Leone Varani… € 50.000… scadenza 1 novembre…”</em></p>',
  6: '<p>Nel cestino, fazzoletti sporchi di mascara nero e glitter dorato.</p><p>Sul lavandino, un gemello d’oro a forma di caduceo, il simbolo dei medici. Accanto, due flûte di prosecco: una ha il segno del rossetto.</p>',
  7: '<p>Sotto gli asciugamani puliti c’è un asciugamano bianco arrotolato e ancora umido. Ha macchie dorate dense e untuose, che l’acqua non ha tolto, e un forte odore di solvente.</p>',
  8: '<p>È la Bauta d’oro, la maschera più preziosa di Ottavio. Graffiando il bordo con un’unghia, sotto l’oro compare la cartapesta.</p><p>È un falso. La vera Bauta non è più in questa casa.</p>',
  9: '<p class="doc">Perizia · Studio Ferrante, Venezia</p><p>«La maschera esaminata non è la Bauta d’oro del 1740, ma una copia recente in cartapesta, dorata a vernice a olio. L’originale risulta venduta tre anni fa a un collezionista di Lugano. Il venditore, un uomo, ha pagato la commissione in contanti e ha lasciato un nome falso.»</p><p class="hand">«Ti ho perdonato i debiti e le bugie. Questo no. A mezzanotte lo sapranno tutti. — O.»</p>',
  10: '<p>Sotto il cuscino, un mazzetto di fotografie con il timbro “Agenzia Occhio di Lince”.</p><p>Ritraggono Vicky e il Dottor Lupo abbracciati. A una delle foto manca un angolo.</p>',
};

export const SOLUTION = {
  name: 'Gaspare Musagu',
  player: 'Andrea',
  html: [
    '<p><strong>Perché.</strong> Tre anni fa Gaspare ha venduto di nascosto la vera Bauta d’oro e l’ha sostituita con un falso dipinto da lui. Ottavio lo ha scoperto con una perizia: la busta di mezzanotte conteneva la prova e il suo biglietto. A mezzanotte lo avrebbe denunciato davanti a tutti.</p>',
    '<p><strong>Come.</strong> Alle 20:34 Gaspare è entrato in camera. Ottavio dormiva profondamente per il sonnifero di Beatrice. Gaspare ha preso la busta, Ottavio si è svegliato a metà e gli ha afferrato la mano, e lui lo ha soffocato con il cuscino. Le unghie di Ottavio hanno graffiato la vernice dorata dalle dita del pittore. Poi Gaspare si è chiuso in bagno a pulirsi con l’acquaragia e, nella confusione, ha infilato la busta in un libro del salotto.</p>',
    '<p><strong>Come lo si scopre.</strong> Leone ha sentito Ottavio russare alle 20:30 e il dottore lo ha trovato morto alle 20:45: il delitto è avvenuto in quei quindici minuti. Leone e il dottore erano insieme in cucina. Beatrice e Vicky erano in salotto. Gaspare diceva di essere in salotto anche lui, ma nessuna delle due lo ha visto prima delle 20:42, e Leone lo aveva incrociato alle 20:32 davanti alla camera. L’uomo uscito dal bagno alle 20:41 non poteva essere Leone o il dottore, che erano in cucina. L’oro sotto le unghie di Ottavio non era il glitter di Vicky, che va via con l’acqua: era vernice a olio, la stessa dell’asciugamano e della maschera falsa. E in casa c’era un solo pittore.</p>',
    '<p><strong>I colpevoli che non hanno ucciso.</strong> Beatrice ha drogato lo zio per rubare la busta, ma non ha avuto il coraggio di farlo. Leone ha rubato e bruciato la cambiale, ma alle 20:30 Ottavio era vivo. Vicky e il Dottor Lupo erano amanti e si sono chiusi in bagno insieme; il dottore ha preso le foto dopo aver trovato il corpo e ha dato l’allarme cinque minuti dopo.</p>',
  ].join(''),
};
