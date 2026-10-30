# Il Mistero di Casa Musagu: app per la serata

L'app è un sito unico con tre modalità:

- **Telefoni.** Al primo accesso il sito chiede «Chi sei?» (Andrea, Giulia, Danilo, Marco, Matteo, Sara). Da quel momento il telefono mostra solo le schermate di quella persona: la fase in corso, la sua scheda segreta, il suo personaggio, gli indizi trovati e le regole. Marco ha in più il Taccuino dell'ispettore.
- **iPad · Regia.** Comanda la TV: le fasi della serata, gli indizi da mostrare, la bacheca, la Domanda di Verità, il timer e la soluzione in tre tempi. Sull'iPad la soluzione e il testo delle buste sigillate non compaiono mai.
- **Schermo TV.** Mostra in grande quello che sceglie la regia. Serve un solo clic su «Avvia a schermo intero».

## Contenuto del pacchetto

```
api/page.js     pagina unica, con l'anteprima per WhatsApp
style.css       grafica (stessa linea dell'invito)
app.js          logica: scelta identità, telefono, regia, TV
music.js        colonna sonora generata dal vivo (nessun file audio)
og.jpg          immagine di anteprima per WhatsApp (1200×630)
favicon.svg, apple-touch-icon.png   icone
api/state.js    stato condiviso della serata (GET / POST)
api/me.js       scheda segreta del personaggio richiesto
api/_data.js    schede segrete, testi degli indizi, soluzione (restano sul server)
api/_store.js   salvataggio dello stato su Upstash Redis
package.json, vercel.json
```

Non c'è niente da compilare: nessuna dipendenza npm, nessuna build.

## 1. Pubblicare su Vercel

**Via GitHub (consigliato)**
1. Crea un repository privato e carica il contenuto della cartella `casa-musagu`.
2. Su Vercel: **Add New → Project → Import** del repository.
3. Framework Preset: **Other**. Lascia vuoti Build Command e Output Directory.
4. Clicca **Deploy**.

**Via terminale**
```bash
npm i -g vercel
cd casa-musagu
vercel          # prima pubblicazione di prova
vercel --prod   # pubblicazione definitiva
```

## 2. Attivare la sincronizzazione (obbligatorio)

Telefoni, iPad e TV condividono lo stato tramite un piccolo database Redis gratuito.

1. Apri il progetto su Vercel, scheda **Storage → Create Database**.
2. Scegli **Upstash for Redis** (Marketplace) con il piano gratuito.
3. Collegalo al progetto (**Connect**), per tutti gli ambienti.
4. Rifai il deploy: **Deployments → … → Redeploy**.

Vercel aggiunge da solo le variabili d'ambiente. L'app riconosce sia `KV_REST_API_URL` / `KV_REST_API_TOKEN` sia `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.

Per controllare: apri il sito, scegli **iPad · Regia** e guarda in alto a destra. Deve comparire il pallino verde con la scritta **Sincronizzato**. Se il pallino è arancione, la sincronizzazione non è attiva: in quel caso lo stato resta nella memoria del server e su Vercel non è affidabile.

Consumi: la TV interroga il server ogni 1,5 secondi, l'iPad ogni 3 secondi e i telefoni ogni 6 secondi (solo con lo schermo acceso). In una serata di 4 ore sono circa 20-25 mila richieste, dentro il piano gratuito di Upstash.

## 3. Prova generale (il giorno prima)

1. Sull'iPad apri il link, scegli **iPad · Regia** e conferma.
2. Sulla TV apri il link con Amazon Silk, scegli **Schermo TV** e premi **Avvia a schermo intero**.
3. Da un telefono scegli un nome e prova i tasti **Avanti** e **Indietro** dell'iPad: la TV deve cambiare in 1-2 secondi.
4. Per tornare alla scelta del nome, tieni premuto 3 secondi il tasto in fondo «Non sei tu?».
5. **Alla fine della prova**, sull'iPad, in **Nuova partita**, tieni premuto 3 secondi per azzerare tutto.

Attenzione: durante la prova non aprire indizi sigillati, soluzione o schede segrete degli altri, altrimenti li vedi tu.

## 4. La sera

- Manda il link nel gruppo. Ognuno lo apre sul suo telefono e sceglie il proprio nome.
- La scelta viene salvata nel browser di quel telefono, non legata all'indirizzo IP: a casa tutti escono con lo stesso IP del Wi-Fi, quindi l'IP non distinguerebbe le persone. Se qualcuno apre il link in navigazione anonima o cancella i dati del browser, gli verrà richiesto di nuovo il nome.
- La scheda segreta si apre solo toccando «Leggi la mia scheda» e si richiude da sola quando il telefono va in standby.
- Sulla Fire TV conviene disattivare il salvaschermo (Impostazioni → Display e audio → Salvaschermo → Mai), così la TV non si spegne durante la cena.

### Scaletta sulla regia

| Fase | Cosa fare con l'iPad |
|---|---|
| Copertina | Mentre arrivano gli ospiti |
| Prologo 1/3, 2/3, 3/3 | Marco legge, tu premi Avanti |
| Schede segrete | Tutti leggono sul telefono |
| Presentazioni | Galleria dei personaggi sulla TV |
| Regole | — |
| Antipasto | Si mangia e si interroga |
| Perquisizione I | **10 minuti** nel timer; tocca ogni indizio quando viene trovato |
| Primo · Perquisizione II · Secondo · Perquisizione III | Come sopra |
| Domanda di Verità | Dopo ogni perquisizione (massimo 3) |
| Bacheca indizi | Quando volete rivedere tutti gli indizi trovati |
| Accusa finale | **5 minuti** nel timer per scrivere i foglietti |
| Soluzione | 1 · attesa, 2 · nome (due tocchi), 3 · spiegazione |
| Punteggio | Tabella dei punti |

«Torna alla fase» chiude l'indizio o la bacheca e riporta la TV alla fase in corso. La × accanto a un indizio lo toglie dai trovati, se lo hai toccato per sbaglio.

## Musica

La musica la suona solo la TV. Parte con il clic su «Avvia schermo e musica» e cambia da sola a ogni fase:

| Fase | Brano |
|---|---|
| Copertina, mentre gli ospiti scelgono il nome | Il carillon di Ottavio |
| Prologo | La notte della cena (archi scuri e vento) |
| Schede segrete, accusa finale | L'orologio della camera (ticchettio e battito) |
| Presentazioni, punteggio | Danza delle maschere (clavicembalo) |
| Regole, antipasto, primo, secondo | Cena a lume di candela (pianoforte morbido) |
| Perquisizioni | La perquisizione (pizzicato teso e battito) |
| Domanda di Verità | Rintocchi di campana |
| Soluzione 1 · 2 · 3 | L'attesa · La rivelazione · Requiem per Ottavio |

Ogni volta che la regia mostra un indizio parte un breve colpo di scena sonoro. Dall'iPad, nel riquadro **Musica sulla TV**, puoi spegnerla o regolare il volume a passi del 10%. La musica è composta e generata nel browser con Web Audio: nessun file da scaricare e nessun problema di diritti d'autore.

Se la pagina della TV viene ricaricata, bisogna premere di nuovo il tasto di avvio: senza un clic i browser non lasciano partire l'audio.

## Anteprima su WhatsApp

Quando mandi il link, WhatsApp mostra la copertina `og.jpg` con titolo e descrizione. L'indirizzo dell'immagine viene costruito automaticamente dal dominio Vercel da cui apri il sito.

- Manda il link con `https://` davanti, per esempio `https://casa-musagu.vercel.app`.
- WhatsApp salva l'anteprima la prima volta che vede un link. Se l'hai già mandato prima di questo aggiornamento e compare la vecchia anteprima, aggiungi in fondo `/?v=2`.

## Riservatezza

Le schede segrete, i testi degli indizi e la soluzione non stanno nel codice della pagina. Il server li invia solo quando servono: la scheda a chi la apre, gli indizi quando la regia li mostra, la soluzione quando viene svelata. Così nessuno li legge per sbaglio. Chi volesse davvero barare con gli strumenti da sviluppatore potrebbe comunque chiederli al server: per una cena tra amici va bene così.
