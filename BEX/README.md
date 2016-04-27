SLP_WebApp
==========

<h2>Tutorial per il WebServer</h2>
<h3>Requisiti</h3>
<ul>
	<li> Node.js v0.8 o maggiore. (<a href="http://nodejs.org/">Nodejs.org</a>, <a href="https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server">How To Install Node.js on an Ubuntu</a>)</li>
	<li> Package manager npm: <a href="https://www.npmjs.com/package/npm">https://www.npmjs.com/package/npm</a></li>
</ul>
<h3>Lanciare il server</h3>
<ul>
	<li>installare http-server tramite npm: $ npm install http-server -g</li>
	<li>posizionarsi nella directory principale dell'applicazione (contenente index.html)</li>
	<li>lanciare il server: $ http-server -a [indirizzo da usare (default 0.0.0.0)] -p [porta da usare (default 8080)]</li>
</ul>
<p>per ulteriori dettagli sulla configurazione di http-server: <a href="https://www.npmjs.com/package/http-server">https://www.npmjs.com/package/http-server</a></p>

<div>
<h3>Per far girare l'applicazione con un server fuseki disponibile in locale:</h3>
<ul>
  <li>aprire /SLP_WebApp/app/js/custom/services/info-articles.js </li>
<li>scommentare la riga 10 fornendo l'indirizzo dell'endpoint locale </li>
</ul>

</div>
