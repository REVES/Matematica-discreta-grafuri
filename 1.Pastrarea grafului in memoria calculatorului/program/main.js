/*
	Reprezentarea grafurilor
	Miron Constantin | REVES
*/
$(document).ready(function(){



var maxVirfuri = 20;
var table = $('#matrice');
var nVirfuri = 0;
var nArcuri = 0;
var a = [], inc = [], list = [];



/*
 *	Nr. de virfuri
 */
$('#nVirfuri').on('input', function() {

	init();
	initExport();
	nVirfuri = 0;

	var data = $(this).val();
	var errorCode = 0;

	if( data && Math.floor(data) == data && $.isNumeric(data) ) {

		if( data > 0 && data <= maxVirfuri ) nVirfuri = data;
		else if(data>maxVirfuri) errorCode = 1;
		else errorCode = 2;

	}
	else if( !data ) errorCode = 0;
	else errorCode = 3;

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

	$("#error").html('&nbsp;');

});



function init(virf) {

	a = []; inc = []; list = [];

	table.empty();
	initExport();

	if(!virf) {
		$('#nArcuriWrapper').hide();
		$('#nArcuriWrapper input').val('');
	}

	if( !nVirfuri ) $('#error').text('Introduceți numărul de vârfuri');
	else $("#error").html('&nbsp;');

	$('#nArcuriError').text('');

}



/*
 *	Matricea de adiacenta
 */
// Draw matrix
$('#mAdiacenta').click(function() {	

	init();

	if( !nVirfuri ) return;

	for(var i=0; i<=nVirfuri; i++) {
		table.append('<tr>');
		if( i>0 ) a[i] = [];		

		for(var j=0; j<=nVirfuri; j++) {

			if( i>0 && j>0 ) a[i][j] = 0;

			var line = table.find('tr:last-child');

			if( i == 0 && j == 0 ) line.append('<td></td>');
			else if( i == 0 ) line.append('<td>X' + j + '</td>');
			else if(j == 0) line.append('<td>X' + i + '</td>');
			else line.append('<td><input class="adiacenta" type="text" i="'+i+'" j="'+j+'"></td>');

		}

		table.append('</tr>');
	}

});

// Verify data
$(document).on('input', '#matrice input.adiacenta', function() {

	initExport();
	inc = []; list = [];

	var incomplete = 0;
	var data = $(this).val();
	var i = $(this).attr('i');
	var j = $(this).attr('j');

	switch(data) {

		case '1':
			data = 1;
			break;

		case '0':
			data = 0;
			break;

		case '11':
			$(this).val('1');
			data = 1;
			break;

		case '00':
			$(this).val('0');
			data = 0;
			break;

		default:
			$(this).val('');
			data = 0;
			break;

	}

	a[i][j] = data;

	$('#matrice input.adiacenta').each(function() {
		if( !$(this).val() ) {
			incomplete++;
			return;
		}
	});

	if(!incomplete) exportAll();

});



/*
 *	Matricea de incidenta
 */
// Show input
$('#mIncidenta').click(function() {

	init();

	if( !nVirfuri ) return;

	$('#nArcuriWrapper').show();

});

// Input
$('#nArcuri').on('input', function() {

	var data = $(this).val();
	var errorCode = 0;
	nArcuri = 0;

	init(1);

	if( !nVirfuri ) return;

	var maxArcuri = nVirfuri*nVirfuri;

	if( data && Math.floor(data) == data && $.isNumeric(data) ) {

		if( data > 0 && data <= maxArcuri) nArcuri = data;
		else if(data>maxArcuri) errorCode = 1;
		else errorCode = 2;

	}
	else if( !data ) errorCode = 0;
	else errorCode = 3;

	switch(errorCode) {

		case 1:
			$('#nArcuriError').text('Cel mult '+maxArcuri+' arcuri posibile');
			break;

		case 2:
			$('#nArcuriError').text('Cel putin un arc');
			break;

		case 3:
			$('#nArcuriError').text('Introduceți un număr întreg');
			break;

		default:
			$('#nArcuriError').text('');
			break;

	}

	if( !nArcuri ) return;

	initExport();

	for(var i=0; i<=nArcuri; i++) {
		table.append('<tr>');
		if( i>0 ) inc[i] = [];

		for(var j=0; j<=nVirfuri; j++) {

			if( i>0 && j>0 ) inc[i][j] = 0;

			var line = table.find('tr:last-child');

			if( i == 0 && j == 0 ) line.append('<td></td>');
			else if( i == 0 ) line.append('<td>X' + j + '</td>');
			else if(j == 0) line.append('<td>U' + i + '</td>');
			else line.append('<td><input class="incidenta" type="text" i="'+i+'" j="'+j+'"></td>');

		}

		table.append('</tr>');
	}

});

// Verify data
$(document).on('input', '#matrice input.incidenta', function() {
	
	initExport();
	a = []; list = [];

	var incomplete = 0;
	var data = $(this).val();
	var i = $(this).attr('i');
	var j = $(this).attr('j');
	var error = '';

	switch(data) {

		case '1':
			data = 1;
			break;

		case '-':
			data = -1;
			break;

		case '-1':
			data = -1;
			break;

		case '0':
			data = 0;
			break;

		case '2':
			data = 2;
			break;

		case '11':
			$(this).val('1');
			data = 1;
			break;

		case '-11':
			$(this).val('-1');
			data = -1;
			break;

		case '00':
			$(this).val('0');
			data = 0;
			break;

		case '22':
			$(this).val('2');
			data = 2;
			break;

		default:
			$(this).val('');
			data = 0;
			break;

	}

	inc[i][j] = parseInt(data,10);

	for(var k=1;k<inc.length;k++) {

		// Corectitudinea valorilor
		var cTwo=0, cOne=0, cMinusOne=0, cZero=0;

		for(var l=1;l<inc[k].length;l++) {

			if( inc[k][l] == 2 ) cTwo++;
			else if( inc[k][l] == 1 ) cOne++;
			else if( inc[k][l] == -1 ) cMinusOne++;
			else if( inc[k][l] == 0 ) cZero++;

		}

		if( cTwo > 1 ) error = 'Pentru vârful U'+k+' au fost introduse mai multe valori de "2"';
		else if( cOne > 1 ) error = 'Pentru vârful U'+k+' au fost introduse mai multe valori de "1"';
		else if( cMinusOne > 1 ) error = 'Pentru vârful U'+k+' au fost introduse mai multe valori de "-1"';
		else if( cTwo && cOne || cTwo && cMinusOne ) error = 'Pentru vârful U'+k+' se admite "2" sau "1 si -1" și restul "0"';
		else if( cOne && !cMinusOne ) error = 'Pentru vârful U'+k+' se cere "-1"';
		else if( !cOne && cMinusOne ) error = 'Pentru vârful U'+k+' se cere "1"';
		else if( cZero == nVirfuri ) error = 'Pentru vârful U'+k+' se cer careva valori diferite de 0';

		// Arcurile identice
		for(var l=1;l<inc.length;l++) {

			if(l==k) continue;
			var theSame = false;

			for(var col=1;col<inc[k].length;col++) {

				if( !inc[k][1] ) break;

				if(inc[k][col] != inc[l][col]) {
					
					theSame = false;
					break;

				} else theSame = true;

			}

			if( theSame ) error='Au fost introduse 2 arcuri identice: U'+k+' si U'+l;
		
		}

		if( error ) {
			$('#error').html(error);
			return;
		}

	}

	$('#error').html('');


	$('#matrice input.incidenta').each(function() {
		if( !$(this).val() ) {
			incomplete++;
			return;
		}
	});

	if(!incomplete) exportAll();

});

$(document).on('focusout', '#matrice input.incidenta', function() {

	data = $(this).val();
	if( data == '-' ) $(this).val('-1');

});



/*
 *	Lista de adiacenta
 */
 // Draw matrix
$('#lAdiacenta').click(function() {

	init();

	if( !nVirfuri ) return;

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

});

// Verify data
$(document).on('input', '#matrice input.list', function() {

	initExport();
	a = []; inc = [];

	var $this = $(this);
	var regex = /^([0-9]+,?)+$/;
	var error='';
	var incomplete = 0;

	$('#matrice input.list').each(function() {

		var data = $(this).val();
		var i = $(this).attr('i');

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

	});

	if( error ) {

		$('#error').text(error);
		return;

	}

	$('#error').html('&nbsp;');


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
	if(!incomplete) exportAll();

});



/*
 *	Export
 */



var EnArcuri = 0;
var Etable;



function initExport() {
	$('#export').hide();
	$('#export table').html('');
}

function exportAll() {

	$('#export table').html('');
	$('#export').show();

	EnArcuri = 0;
	Etable = null;

	if( a.length ) {

		convertMAdiacentaToMIncidenta();
		convertMAdiacentaToLista();

	} else if( inc.length ) {

		convertMIncidentaToMAdiacenta();
		convertMAdiacentaToLista();

	} else if( list.length ) {

		convertListaToMAdiacenta();
		convertMAdiacentaToMIncidenta();

	}

	exportMAdiacenta();
	exportMIncidenta();
	exportLista();

	graf();

}


function exportMAdiacenta() {

	Etable = $('#exportAdiacenta');

	for(var i=0; i<=nVirfuri; i++) {
		Etable.append('<tr>');

		for(var j=0; j<=nVirfuri; j++) {

			var line = Etable.find('tr:last-child');

			if( i == 0 && j == 0 ) line.append('<td></td>');
			else if( i == 0 ) line.append('<td>X' + j + '</td>');
			else if(j == 0) line.append('<td>X' + i + '</td>');
			else line.append('<td><span>'+a[i][j]+'</span></td>');

		}

		Etable.append('</tr>');
	}

}

function exportMIncidenta() {

	Etable = $('#exportIncidenta');

	if(!EnArcuri) EnArcuri = nArcuri;

	for(var i=0; i<=EnArcuri; i++) {
		Etable.append('<tr>');

		for(var j=0; j<=nVirfuri; j++) {

			var line = Etable.find('tr:last-child');

			if( i == 0 && j == 0 ) line.append('<td></td>');
			else if( i == 0 ) line.append('<td>X' + j + '</td>');
			else if(j == 0) line.append('<td>U' + i + '</td>');
			else line.append('<td><span>'+inc[i][j]+'</span></td>');

		}

		Etable.append('</tr>');
	}

}

function exportLista() {

	Etable = $('#exportLista');

	for(var i=0; i<=nVirfuri; i++) {
		Etable.append('<tr>');

		var line = Etable.find('tr:last-child');

		if( i == 0 ) line.append('<td>Xj</td><td>F(Xj)</td>');
		else if( list[i].length ) line.append('<td>X' + i + '</td><td><span>'+list[i].join(',')+',0</span></td>');
		else line.append('<td>X' + i + '</td><td><span>0</span></td>');

		Etable.append('</tr>');
	}

}

function convertMAdiacentaToMIncidenta() {

	// Numar arcurile
	for( var i=1; i<=nVirfuri; i++ ) {
		for( var j=1; j<=nVirfuri; j++ ) if(a[i][j] == 1) EnArcuri++;
	}

	// Initializez Matricea de Incidenta
	for( var i=1; i<=EnArcuri; i++ ) {

		inc[i] = [];
		for(var j=1; j<=nVirfuri; j++) inc[i][j]=0;

	}

	// Convertez
	var arc = 0;

	for( var i=1; i<=nVirfuri; i++ ) {
		for( var j=1; j<=nVirfuri; j++ ) {

			if(a[i][j] == 1) {

				arc++;

				if(i==j) inc[arc][i] = 2;
				else {
					inc[arc][i]=-1;
					inc[arc][j]=1;
				}

			}

		}
	}

}

function convertMAdiacentaToLista() {

	// Intitializez Lista de Adiacenta
	for( var i=1; i<=nVirfuri; i++) list[i] = [];

	// Convertez
	for( var i=1; i<=nVirfuri; i++ ) {
		for( var j=1; j<=nVirfuri; j++ ) if(a[i][j] == 1) list[i].push(j);
	}

}

function convertMIncidentaToMAdiacenta() {
	
	// Intitializez Matricea de Adiacenta
	for(var i=1; i<=nVirfuri; i++) {
		a[i] = [];
		for(var j=1; j<=nVirfuri; j++) a[i][j] = 0;
	}
	
	// Convertez
	for(var i=1; i<=nArcuri; i++) {

		var ai = 0;
		var aj = 0;

		for(var j=1; j<=nVirfuri; j++) {

			if( inc[i][j] == -1 ) ai = j;
			else if( inc[i][j] == 1 ) aj = j;
			else if( inc[i][j] == 2 ) {
				ai = j;
				aj = j;
			}

		}

		if( ai && aj ) a[ai][aj] = 1;

	}

}

function convertListaToMAdiacenta() {

	// Intitializez Matricea de Adiacenta
	for(var i=1; i<=nVirfuri; i++) {
		a[i] = [];
		for(var j=1; j<=nVirfuri; j++) a[i][j] = 0;
	}
	
	// Convertez
	for(var i=1; i<=nVirfuri; i++) {
		for(var j=0; j<list[i].length; j++) {a[i][list[i][j]] = 1;};
	}

}

function graf() {

	var elems = {nodes:[], edges:[]};

	for(var i=1; i<=nVirfuri; i++) elems.nodes.push({ data:{id:'X'+i} });

	for(var i=1; i<=EnArcuri; i++) {

		var s='',t='';

		for(var j=1; j<=nVirfuri; j++) {

			if( inc[i][j] == -1 ) s = 'X'+j;
			if( inc[i][j] == 1 ) t = 'X'+j;
			if( inc[i][j] == 2 ) {
				s = 'X'+j;
				t = 'X'+j;
			}

		}

		if( s.length && t.length ) elems.edges.push({ data:{id:s+t, weight:i, source:s, target:t} });

	}

	localStorage.setItem('grafStorage', JSON.stringify(elems));

}

});