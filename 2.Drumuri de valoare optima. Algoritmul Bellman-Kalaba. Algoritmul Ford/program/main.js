/*
	Reprezentarea grafurilor
	Miron Constantin | REVES
*/
$(document).ready(function() {



var maxVirfuri = 20;
var ponderiTable = $('#ponderi');
var nVirfuri = 0;
var nArcuri = 0;
var nArcuriFaraBucle = 0;
var a = [], inc = [], incFaraBucle = [], list = [], p = [];
var pMax = 100000, pDiff=10000;



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
	clearPonderi();
	$('#ponderileTitle').hide();
	$('#error').html('&nbsp;');
	incFaraBucle = []; nArcuriFaraBucle = 0; nArcuri = 0; a = []; inc = [];

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

};

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

	if(!incomplete) {
		convertListaToMAdiacenta();
		convertMAdiacentaToMIncidenta();
		$('#ponderileTitle').show();
		drawPonderiInput();
	}

});

function convertMAdiacentaToMIncidenta() {

	// Numar arcurile
	for( var i=1; i<=nVirfuri; i++ ) {
		for( var j=1; j<=nVirfuri; j++ ) {
			if(a[i][j] == 1) {
				nArcuri++;
				if(i!=j) nArcuriFaraBucle++;
			}
		}
	}

	// Initializez Matricea de Incidenta
	for( var i=1; i<=nArcuri; i++ ) {

		inc[i] = [];
		for(var j=1; j<=nVirfuri; j++) inc[i][j]=0;

	}

	// Initializez Matricea de Incidenta fara bucle
	for( var i=1; i<=nArcuriFaraBucle; i++ ) {

		incFaraBucle[i] = [];
		for(var j=1; j<=nVirfuri; j++) incFaraBucle[i][j] = 0;

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

	arc = 0;

	for( var i=1; i<=nVirfuri; i++ ) {
		for( var j=1; j<=nVirfuri; j++ ) {

			if(a[i][j] == 1) {

				if(i==j) continue;
				arc++;
				incFaraBucle[arc][i]=-1;
				incFaraBucle[arc][j]=1;
			}

		}
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


/*
 *	Ponderile arcelor
 */
var arcuriCuPondere = 0;

function clearPonderi(introdusPonderi) {
	clearFord();
	clearBellman_Kalaba();
	$('#grafWrapper, #algoritmi').hide();
	$('#vFinal').val('');
	$('#vInit').val('');
	$('#errorPonderi').html('');
	
	if(introdusPonderi) return;
	ponderiTable.empty();
	p = []; arcuriCuPondere = 0;
}

function drawPonderiInput() {

	clearPonderi();

	if( !nArcuri ) {
		$('#errorPonderi').html('Nu sunt arcuri!');
		return;
	} else if( !nArcuriFaraBucle ) {
		$('#errorPonderi').html('Sunt doar bucle!');
		return;
	}

	for( var i=1; i<=nVirfuri; i++ ) {
		if(i==1) ponderiTable.append('<tr><td>(Xi,Xj)</td><td>P(Xi,Xj)</td></tr>');

		p[i] = [];

		for( var j=1; j<=nVirfuri; j++ ) {

			if(i==j) p[i][j] = 0;
			else p[i][j] = pMax;

			if(a[i][j] == 1) {

				if(i==j) continue;

				arcuriCuPondere++;
				ponderiTable.append('<tr><td>(X'+i+',X'+j+')</td><td><input class="ponderi" type="text" i="'+i+'" j="'+j+'"></td></tr>');

			}

		}
	}

	if( !arcuriCuPondere ) {
		ponderiTable.empty();
		$('#errorPonderi').html('Nu exisă arcuri pentru care s-ar putea indica ponderea.');
	}

};

$(document).on('input', '#ponderi input.ponderi', function() {

	clearPonderi(true);

	var $this = $(this);
	var regex = /^\d+$/;
	var error='';
	var incomplete = 0;

	$('#ponderi input.ponderi').each(function() {

		var data = $(this).val();
		var i = $(this).attr('i');
		var j = $(this).attr('j');

		if( !data ) return;

		// Formatul
		if( data && !regex.test(data) ) {
			error = 'Pentru (X'+i+',X'+j+') ponderea a fost introdusă greșit';
			return false;
		}

		// 0000... => 0
		if( data == '00' ) {
			$(this).val('0');
			data = $(this).val();
		}

		// P > 0
		if( parseFloat(data,10) < 0 || parseFloat(data,10) == 0 ) {
			error = 'Pentru (X'+i+',X'+j+') ponderea are sens doar având valoarea > 0 .';
			return false;
		}

	});

	if( error ) {

		$('#errorPonderi').text(error);
		return;

	}

	var data = $(this).val();
	var i = $(this).attr('i');
	var j = $(this).attr('j');

	p[i][j] = parseInt(data,10);

	$('#ponderi input.ponderi').each(function() {
		if( !$(this).val() ) incomplete++;
	});

	if( !incomplete ) {
		graf();
		$('#grafWrapper').show();
		$('#algoritmi').show();
	}

});

function graf() {

	var elems = {nodes:[], edges:[]};

	for(var i=1; i<=nVirfuri; i++) elems.nodes.push({ data:{id:'X'+i} });

	for(var i=1; i<=nArcuri; i++) {

		var s=0, t=0;

		for(var j=1; j<=nVirfuri; j++) {

			if( inc[i][j] == -1 ) s = j;
			if( inc[i][j] == 1 )  t = j;
			if( inc[i][j] == 2 ) {
				s = j;
				t = j;
			}

		}

		if( s && t ) elems.edges.push({ data:{id:'X'+s+'X'+t, weight:p[s][t], source:'X'+s, target:'X'+t} });

	}

	localStorage.setItem('grafStorage', JSON.stringify(elems));

}


/*
	Find Way
*/
function findWay(way, sum, max, final) {
	var last, j, waySum, temp;

	last = way[way.length-1];

	for(j=1;j<=nVirfuri;j++) {

		if( last == j || !a[last][j] ) continue;

		waySum = sum + p[last][j];

		if( waySum < max ) {

			temp = [];
			temp = way.slice();
			temp.push(j);
			findWay(temp, waySum, max, final);

		} else if ( waySum == max && j == final ) {

			temp = [];
			temp = way.slice();
			temp.push(j);
			Ways.push(temp);

		}

	}

}


/*
	Bellman-Kalaba
*/
var vFinal = 0;
var BKmin = null;
var BKmax = null;
var pDrumurilor = $('#pDrumurilor');
var Ways = [];

function clearBellman_Kalaba() {
	pDrumurilor.hide();
	pDrumurilor.find('td:first-child').html('');
	pDrumurilor.find('td:last-child').html('');
	$('#vFinalError').html('');
	vFinal = 0; BKmin = null; BKmax = null; Ways = [];
}

$('#vFinal').on('input', function() {

	clearBellman_Kalaba();

	var data = $(this).val();
	if( !data ) return;

	var regex = /^\d+$/;

	if( !regex.test(data) ) {
		$('#vFinalError').html('Se admit doar cifre');
		return;
	}

	data = parseFloat(data,10);

	if( data < 1 || data > nVirfuri ) {
		$('#vFinalError').html('Astfel de vârf nu există');
		return;
	}

	vFinal = data;
	$('#vFinalError').html('');

	BKmin = Bellman_Kalaba('min');
	BKmax = Bellman_Kalaba('max');

	pDrumurilor.show();

	for(var i=1;i<=nVirfuri;i++) {

		if( !(BKmin[i] >= (pMax-pDiff)) ) {

			pDrumurilor.find('td:first-child').append('P[d_min(X'+i+',X'+vFinal+')] = '+BKmin[i]+'<br>');

			Ways = [];
			findWay([i],0,BKmin[i], vFinal);

			for( var k=0; k<Ways.length; k++ ) {

				pDrumurilor.find('td:first-child').append('d'+(k+1)+'_min(X'+i+',X'+vFinal+') = (');

				for( var j=0;j<Ways[k].length;j++ ) {
					pDrumurilor.find('td:first-child').append('X'+Ways[k][j]);
					if(j != (Ways[k].length-1)) pDrumurilor.find('td:first-child').append(',');				
				}

				pDrumurilor.find('td:first-child').append(')<br>');

			}

			if( i!= nVirfuri ) pDrumurilor.find('td:first-child').append('<hr>');

		}
		
		if( !(BKmax[i] <= (pMax*(-1)+pDiff)) ) {

			pDrumurilor.find('td:last-child').append('P[d_max(X'+i+',X'+vFinal+')] = '+BKmax[i]+'<br>');

			Ways = [];
			findWay([i],0,BKmax[i], vFinal);

			for( var k=0; k<Ways.length; k++ ) {

				pDrumurilor.find('td:last-child').append('d'+(k+1)+'_max(X'+i+',X'+vFinal+') = (');

				for( var j=0; j<Ways[k].length; j++ ) {
					pDrumurilor.find('td:last-child').append('X'+Ways[k][j]);
					if(j != (Ways[k].length-1)) pDrumurilor.find('td:last-child').append(',');				
				}

				pDrumurilor.find('td:last-child').append(')<br>');

			}

			if( i!= nVirfuri ) pDrumurilor.find('td:last-child').append('<hr>');

		}

	}

});

function Bellman_Kalaba(mode) {

	if(mode == 'max') {
		var p2=[];
		for(var i=1;i<=nVirfuri;i++) {
			p2[i]=[];
			for(var j=1;j<=nVirfuri;j++) {
				if(p[i][j] == pMax) p2[i][j]=pMax*(-1); else p2[i][j]=p[i][j];
			}
		}
	}

	var m = [], mLast = [], adunate = [], stop = 0, i, j;

	// m(1)
	for(var i=1; i<=nVirfuri; i++) {
		if(mode == 'min') 	   m[i] = p[i][vFinal];
		else if(mode == 'max') m[i] = p2[i][vFinal];
	}

	// m(2), ...
	while( !(m.length == mLast.length && m.every(function(el,i){return el === mLast[i];})) ) {

		stop++;
		if(stop>20) {m=[];mLast=[];console.log('Infinite "WHILE" - Bellman_Kalaba');continue;}

		mLast = m.slice();
		m = [];

		for(i=1; i<=nVirfuri; i++) {

			adunate = [];

			if(mode == 'min') {

				for(j=1;j<=nVirfuri;j++) adunate.push(mLast[j] + p[i][j]);
				m[i] = Math.min.apply(Math, adunate);

			} else if(mode == 'max') {

				for(j=1;j<=nVirfuri;j++) adunate.push(mLast[j] + p2[i][j]);
				m[i] = Math.max.apply(Math, adunate);

			}

		}

	}

		return m;
};



/*
	Ford
*/
var vInit = 0;
var Fmin = null;
var Fmax = null;
var pDrumurilorFord = $('#pDrumurilorFord');

function clearFord() {
	pDrumurilorFord.hide();
	pDrumurilorFord.find('td:first-child').html('');
	pDrumurilorFord.find('td:last-child').html('');
	$('#vInitError').html('');
	vInit = 0; Fmin = null; Fmax = null; Ways = [];
}

$('#vInit').on('input', function() {

	clearFord();	

	var data = $(this).val();
	if( !data ) return;

	var regex = /^\d+$/;

	if( !regex.test(data) ) {
		$('#vInitError').html('Se admit doar cifre');
		return;
	}

	data = parseFloat(data,10);

	if( data < 1 || data > nVirfuri ) {
		$('#vInitError').html('Astfel de vârf nu există');
		return;
	}

	vInit = data;

	Fmin = Ford('min');
	Fmax = Ford('max');

	pDrumurilorFord.show();

	for(var i=1;i<=nVirfuri;i++) {

		if( Fmin[i] < (pMax-pDiff) ) {

			pDrumurilorFord.find('td:first-child').append('P[d_min(X'+vInit+',X'+i+')] = '+Fmin[i]+'<br>');

			Ways = [];
			findWay([vInit],0,Fmin[i],i);

			for( var k=0;k<Ways.length;k++ ) {

				pDrumurilorFord.find('td:first-child').append('d'+(k+1)+'_min(X'+vInit+',X'+i+') = (');

				for( var j=0; j<Ways[k].length; j++ ) {
					pDrumurilorFord.find('td:first-child').append('X'+Ways[k][j]);
					if(j != (Ways[k].length-1)) pDrumurilorFord.find('td:first-child').append(',');				
				}

				pDrumurilorFord.find('td:first-child').append(')<br>');

			}

			if( i != nVirfuri ) pDrumurilorFord.find('td:first-child').append('<hr>');

		}

		if( Fmax[i] > (pMax*(-1)+pDiff) ) {

			pDrumurilorFord.find('td:last-child').append('P[d_max(X'+vInit+',X'+i+')] = '+Fmax[i]+'<br>');

			Ways = [];
			findWay([vInit],0,Fmax[i],i);

			for( var k=0;k<Ways.length;k++ ) {

				pDrumurilorFord.find('td:last-child').append('d'+(k+1)+'_max(X'+vInit+',X'+i+') = (');

				for( var j=0; j<Ways[k].length; j++ ) {
					pDrumurilorFord.find('td:last-child').append('X'+Ways[k][j]);
					if(j != (Ways[k].length-1)) pDrumurilorFord.find('td:last-child').append(',');				
				}

				pDrumurilorFord.find('td:last-child').append(')<br>');

			}

			if( i != nVirfuri ) pDrumurilorFord.find('td:last-child').append('<hr>');

		}

	}

});

function Ford( mode ) {

	var h = [], hLast = [], stop = 0, i=1;

	// T1
	for(i=1;i<=nVirfuri;i++) {
		if( i == vInit ) h[i] = 0;
		else if(mode == 'min') h[i] = pMax;
		else if(mode == 'max') h[i] = (-1)*pMax;
	}

	// T1', ...
	while( !(h.length == hLast.length && h.every(function(el,i){return el === hLast[i];})) ) {

		stop++;
		if(stop>20) {h=[];hLast=[];console.log('Infinite "WHILE" - Ford_min');continue;}

		hLast = h.slice();

		for(i=1;i<=nArcuriFaraBucle;i++) {

			var xi = 0, xj = 0;

			for(var j=1; j<=nVirfuri; j++) {
				if(incFaraBucle[i][j] == -1) xi = j;
				if(incFaraBucle[i][j] == 1)  xj = j;
			}
			
			if( mode == 'min' && (hLast[xj] - hLast[xi]) > p[xi][xj] ) h[xj] = h[xi] + p[xi][xj];
			else if(mode == 'max' && (hLast[xj] - hLast[xi]) < p[xi][xj] ) h[xj] = h[xi] + p[xi][xj];

		}
		
	}

	return h;
};

});