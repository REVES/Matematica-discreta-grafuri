/*
	Reprezentarea grafurilor
	Miron Constantin | REVES
*/
$(document).ready(function() {



var maxVirfuri = 20;
var nVirfuri = 0;
var a = [], list = [];
var radPrima = 0;



/*
 *	Nr. de virfuri
 */
$('#nVirfuri').on('input', function() {

	clearLista();
	$('#listaTitle').hide();
	nVirfuri = 0;
	$("#error").html('&nbsp;');

	var data = $(this).val();
	var errorCode = 0;

	if( data && Math.floor(data) == data && $.isNumeric(data) ) {

		if( data > 0 && data <= maxVirfuri ) nVirfuri = data;
		else if(data>maxVirfuri) errorCode = 1;
		else errorCode = 2;

	}
	else if( !data ) {
		errorCode = 0;
		$('#listaTitle').hide();
	} else errorCode = 3;

	switch(errorCode) {

		case 1:
			$('#nVirfuriError').text('Cel mult '+maxVirfuri+' vârfuri, pentru comoditate');
			break;

		case 2:
			$('#nVirfuriError').text('Cel puțin un vârf');
			break;

		case 3:
			$('#nVirfuriError').text('Introduceți un număr întreg');
			break;

		default:
			$('#nVirfuriError').text('');
			break;

	}

	if(!errorCode && data) {
		$('#listaTitle').show();
		drawListaInput();
	}

});


/*
 *	Lista de adiacenta
 */
var table = $('#matrice');

function clearLista(introdus) {
	clearParcurgeri();
	$('#error').html('&nbsp;');
	$('#grafWrapper').hide();
	$('#algoritm').hide();
	a = [];

	if(introdus) return;
	table.empty();
	list = [];
}

// Draw matrix
function drawListaInput() {

	clearLista();

	if( !nVirfuri ) {
		$('#error').text('Introduceți numărul de vârfuri');
		return;
	}

	for(var i=0; i<=nVirfuri; i++) {
		table.append('<tr>');

		var line = table.find('tr:last-child');

		if(i != 0) {

			line.append('<td>X' + i + '</td><td><input class="list" type="text" i="'+i+'"></td>');
			list[i] = [];
			list[i].push(0);

		} else line.append('<td>Xj</td><td>F(Xj)</td>');

		table.append('</tr>');
	}

}

// Verify data
$(document).on('input', '#matrice input.list', function() {

	clearLista(true);

	var $this = $(this), regex = /^([0-9]+,?)+$/, error='', incomplete = 0;

	$('#matrice input.list').each(function() {

		var data = $(this).val();
		var i = $(this).attr('i');

		// ,, => ,
		if( data.length >= 2 && data[data.length-1] == ',' && data[data.length-2] == ',' ) {

			data = data.substring(0, data.length - 1);
			$(this).val(data);
			data = $(this).val();

		}

		if( !data ) return;

		// Formatul
		if( data && !regex.test(data) ) {

			error = 'Pentru X'+i+' datele au fost introduse greșit';
			return false;
		}

		// Sterg repetarile
		var virfuri = data.split(',');
		var lastNum = null;
		var unique = [];
		var changes = false;

		$.each(virfuri, function(q, el) {
			if($.inArray(el, unique) === -1) unique.push(el);
			else changes = true;
		});

		if(changes) {
			$(this).val(unique.join(','));
			data = $(this).val();
			virfuri = data.split(',');
		}

		// Zeroul de la sfirsit
		if( virfuri[virfuri.length-1] == ',' ) lastNum = parseInt(virfuri[virfuri.length-2], 10);
		else lastNum = parseInt(virfuri[virfuri.length-1], 10);

		if( lastNum != 0 ) {

			error = 'Pentru X'+i+' este cerut "0" la sfârșit.';
			return false;

		}

		// 0000... => 0
		if( virfuri[virfuri.length-1] == '00' ) {

			virfuri[virfuri.length-1] = '0';
			$(this).val(virfuri.join(','));
			data = $(this).val();

		}

		// Virfuri care nu exista
		var preaMari = 0;

		$.each(virfuri, function(q, el) {
			if( parseInt(el,10) > nVirfuri ) preaMari++;
		});

		if( preaMari ) {
			error = 'Pentru X'+i+' a fost introdus un vârf ce nu există';
			return false;
		}

		// Bucle
		if( $.inArray(i, virfuri) != -1 ) {
			error = 'Nu se acceptă bucle. Eroare la X'+i;
			return false;
		}

	});

	if( error ) {
		$('#error').text(error);
		return;
	}

	var data = $(this).val();
	var i = $(this).attr('i');

	list[i] = [];

	if( data ) {

		var virfuri = data.split(',');

		$.each(virfuri, function(q, el) {
			if(el && el != '0') list[i].push( parseInt(el,10) );
		});

	}

	$('#matrice input.list').each(function(q, el) {
		if( !$(this).val() ) incomplete++;
	});

	if( !incomplete ) {
		
		// Intitializez Matricea de Adiacenta
		for(var i=1; i<=nVirfuri; i++) {
			a[i] = [];
			for(var j=1; j<=nVirfuri; j++) a[i][j] = 0;
		}
		
		// Convertez
		for(var i=1; i<=nVirfuri; i++) {
			for(var j=0; j<list[i].length; j++) {a[i][list[i][j]] = 1;};
		}

		graf();
		$('#grafWrapper').show();

		$('#algoritm').show();

	}

});

function graf() {
	var elems = {nodes:[], edges:[]};

	for(var i=1;i<=nVirfuri;i++) {
		elems.nodes.push({ data:{id:'X'+i} });
		var s=0, t=0;

		for(var j=1;j<=nVirfuri;j++) {

			if( a[i][j] == 1 ) { s = i; t = j; }
			if( s && t ) elems.edges.push({ data:{id:'X'+s+'X'+t, source:'X'+s, target:'X'+t} });

		}

	}

	localStorage.setItem('grafStorage', JSON.stringify(elems));
}



/*
	Arbore
*/
var RadacinaPrincipala = 0;
var list2 = [];
var a2 = [];

function clearParcurgeri() {
	$('#parcurgeri').hide();
	$('#largime, #adancime').html('');
	$('radacinaError').html('');
	RadacinaPrincipala = 0; radPrima = 0; list2 = []; a2 = [];
}

$('#radacina').on('input', function() {

	clearParcurgeri();

	var data = $(this).val();
	if( !data ) {
		$('#radacinaError').html('');
		return;
	}

	var regex = /^\d+$/;

	if( !regex.test(data) ) {
		$('#radacinaError').html('Se admit doar cifre');
		return;
	}

	data = parseFloat(data,10);

	if( data < 1 || data > nVirfuri ) {
		$('#radacinaError').html('Astfel de vârf nu există');
		return;
	}

	RadacinaPrincipala = data;
	$('#radacinaError').html('');
	

	for (var i=1; i<=nVirfuri; i++) list2[i] = list[i].slice();

	// Găsesc rădăcina primă
	for(var j=1;j<=nVirfuri;j++) {
		var zeros = 0;
		for(var i=1;i<=nVirfuri;i++) if(a[i][j] == 0) zeros++;
		if(zeros == nVirfuri) {radPrima = j;break;}
	}

	// Rescriu lista de adiacență
	if( RadacinaPrincipala != radPrima) {


		var parinte = null;
		var elemCurent = RadacinaPrincipala;

		for(var i=1;i<=nVirfuri;i++) if(a[i][elemCurent] == 1) {parinte = i;break;}//console.log('printe='+parinte);

		while(parinte) {
			// adaug legatura elemCurent->parinte
			list2[elemCurent].push(parinte);
			// sterg legatura parinte->elemCurent
			for(var i=0;i<list2[parinte].length;i++)
				if(list2[parinte][i] == elemCurent) {list2[parinte].splice(i,1);break;}

			// mă mișc cu un nivel în sus
			elemCurent = parinte; parinte = null;
			for(var i=1;i<=nVirfuri;i++) if(a[i][elemCurent] == 1) {parinte = i;break;}

		}
	
	}


	// Intitializez Matricea de Adiacenta 2
	for(var i=1; i<=nVirfuri; i++) {
		a2[i] = [];
		for(var j=1; j<=nVirfuri; j++) a2[i][j] = 0;
	}
	
	// Convertez
	for(var i=1; i<=nVirfuri; i++) {
		for(var j=0; j<list2[i].length; j++) {a2[i][list2[i][j]] = 1;};
	}


	var ar = new Arbore();

	for(var i=1; i<=nVirfuri; i++) {
		for(var j=0; j<list2[i].length; j++) {ar.adaugaArc(i,list2[i][j]);}
	}
	
	var pAdancime = ar.getListAdancime();
	var pLargime = ar.getListLargime();
	
	for(var i=0;i<pAdancime.length;i++) {
		if(i != 0) $('#adancime').append(',');
		$('#adancime').append(pAdancime[i]);
	}
	
	for(var i=0;i<pLargime.length;i++) {
		if(i != 0) $('#largime').append(',');
		$('#largime').append(pLargime[i]);
	}

	$('#parcurgeri').show();

});

var Arc = function(source, target) {
	this.source = source;
	this.target = target;
	this.reverseArc = null;
};

var Arbore = function() {

	this.arcuri = {};
	this.listaAdancime = [];
	this.listaLargime = [];

	// Adaugarea arcelor
	this.adaugaArc = function(source, target) {
		if(source == target) return;
		
		var arc = new Arc(source, target);
		var reverseArc = new Arc(target, source);
		
		arc.reverseArc = reverseArc;
		reverseArc.reverseArc = arc;
		
		if(this.arcuri[source] === undefined) this.arcuri[source] = [];
		if(this.arcuri[target] === undefined) this.arcuri[target] = [];   
		
		this.arcuri[source].push(arc);
		this.arcuri[target].push(reverseArc);
	};

	// Parcurgeri ale arborelui
	this.addListAdancime = function(radacina, parent) {

		this.listaAdancime.push(radacina);// console.log(this.listaAdancime);

		for(var i=0;i<this.arcuri[radacina].length;i++) {
			var arc = this.arcuri[radacina][i];

			if(arc.target == parent) continue;
			this.addListAdancime(arc.target, radacina);

		}

	}

	this.addListLargime = function(listaRadacini) {
		var listaRadaciniNew = []; // lista pentru apelul recursiv (urmator)
		var parinte = null;

		for(var i=0;i<listaRadacini.length;i++) {
			var radacina = listaRadacini[i];

			for(var j=0;j<this.arcuri[radacina].length;j++) {
				var arc = this.arcuri[radacina][j];

				for(var k=1;k<=nVirfuri;k++) if(a2[k][radacina] == 1) {parinte = k;break;}

				if(arc.target == parinte) continue;			

				this.listaLargime.push(arc.target);
				listaRadaciniNew.push(arc.target);
			}

		}

		if( listaRadaciniNew.length ) this.addListLargime(listaRadaciniNew);
	}

	// Afisarea listelor
	this.getListAdancime = function() {

		this.addListAdancime(RadacinaPrincipala, 0);

		return this.listaAdancime;
	}

	this.getListLargime = function() {

		this.listaLargime.push(RadacinaPrincipala);
		this.addListLargime([RadacinaPrincipala]);

		return this.listaLargime;
	}

};

});