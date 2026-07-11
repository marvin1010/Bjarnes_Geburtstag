# Bjarnes Geburtstags-Glücksrad 🎉

Eine komplett statische, mobiloptimierte Geburtstagsseite für GitHub Pages. Das Glücksrad entscheidet fair zwischen:

- **kofookoo**
- **Mr Kao**
- **Mr. Cherng**

## GitHub Pages veröffentlichen

1. Neues öffentliches GitHub-Repository anlegen, zum Beispiel `bjarne-26`.
2. Den gesamten Inhalt dieses Ordners in die oberste Ebene des Repositorys hochladen.
3. In GitHub **Settings → Pages** öffnen.
4. Unter **Build and deployment** als Source **Deploy from a branch** wählen.
5. Branch **main**, Ordner **/(root)** auswählen und speichern.
6. Nach kurzer Zeit erscheint die öffentliche URL in den Pages-Einstellungen.

## Lokal testen

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen.

## Glücksrad zurücksetzen

Die Entscheidung wird im Browser gespeichert, damit Neuladen kein erneutes Drehen ermöglicht. Zum Testen die Seite einmal mit `?reset=1` öffnen, zum Beispiel:

```text
https://DEIN-NAME.github.io/bjarne-26/?reset=1
```

## Technik

- Keine Frameworks oder externen Bibliotheken
- Responsive HTML/CSS/JavaScript
- Fairer Zufall über `crypto.getRandomValues`
- Konfetti, Web-Audio und Web-Share mit Fallback
- Keine Analyse- oder Trackingdienste

## Markenhinweis

Die Restaurantnamen und Logos werden ausschließlich für einen privaten, nicht kommerziellen Geburtstagsgutschein verwendet. Alle Markenrechte verbleiben bei den jeweiligen Rechteinhabern. Das kofookoo-Logo stammt vom offiziellen Restaurantauftritt; das Mr.-Cherng-Logo wurde aus der offiziellen Speisekarte freigestellt. Die Mr-Kao-Wortmarke wurde für die kleine Glücksrad-Darstellung anhand der aktuellen Restaurantbeschilderung als SVG nachgezeichnet.


## Version 2

- Behebt die Logo-Position im Ergebnisdialog auf iPhone/Safari.
- Das Ergebnislogo wird nun innerhalb der weißen Fläche absolut begrenzt und abgeschnitten, sodass es unabhängig von Safari-Bildgrößenberechnungen nicht über den Container hinausrutschen kann.
- Versionsparameter an CSS und JavaScript vermeiden, dass Mobilgeräte nach dem Upload noch alte Dateien aus dem Browser-Cache laden.


## PDF-Gutscheine

Im Ordner `gutscheine/` liegen drei fertig erzeugte PDF-Dateien:

- `Bjarne-Gutschein-kofookoo.pdf`
- `Bjarne-Gutschein-Mr-Kao.pdf`
- `Bjarne-Gutschein-Mr-Cherng.pdf`

Nach der Entscheidung des Glücksrads erhält Bjarne automatisch den passenden Download-Button. Die PDFs sind statisch, benötigen keinen Server und können direkt über GitHub Pages ausgeliefert werden. Auf iPhone und iPad öffnet Safari die PDF gegebenenfalls zunächst in der Vorschau; dort kann sie über das Teilen-Menü gespeichert oder weitergeleitet werden.

Die PDFs sind bewusst als **private Einladungsgutscheine** gekennzeichnet. Sie wurden nicht von den Restaurants ausgestellt und sind nicht gegen Bargeld einlösbar.

## Version 3

- Ergänzt drei restaurantabhängige, druckfertige PDF-Gutscheine.
- Zeigt im Ergebnisdialog einen passenden Button „PDF-Gutschein herunterladen“.
- Der Downloadname und die PDF werden automatisch anhand des ausgelosten Restaurants gesetzt.
- Versionsparameter an CSS und JavaScript wurden auf `v=3` erhöht, um alten Browser-Cache zu vermeiden.
