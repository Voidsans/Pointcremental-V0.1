function onLoad() {
	player = {};
	let d = localStorage.getItem('incremental-creationsPoint-Incremental-(but-its-bad)');
	let saveData = d?JSON.parse(atob(d)):{}
	if (Object.keys(saveData).includes('Points')) player['Points'] = new OmegaNum(saveData['Points']);
	else player['Points'] = new OmegaNum(0);
	if (Object.keys(saveData).includes('PointGain')) player['PointGain'] = new OmegaNum(saveData['PointGain']);
	else player['PointGain'] = new OmegaNum(1);
	if (Object.keys(saveData).includes('DoublerCost')) player['DoublerCost'] = new OmegaNum(saveData['DoublerCost']);
	else player['DoublerCost'] = new OmegaNum(10);
	if (Object.keys(saveData).includes('DoublerNumber')) player['DoublerNumber'] = new OmegaNum(saveData['DoublerNumber']);
	else player['DoublerNumber'] = new OmegaNum(0);
	if (Object.keys(saveData).includes('TripleCost')) player['TripleCost'] = new OmegaNum(saveData['TripleCost']);
	else player['TripleCost'] = new OmegaNum(5);
	if (Object.keys(saveData).includes('TriplerNumber')) player['TriplerNumber'] = new OmegaNum(saveData['TriplerNumber']);
	else player['TriplerNumber'] = new OmegaNum(0);
};
OmegaNum.prototype.toSWDP = function(digits) {
	return new OmegaNum(this).times(OmegaNum.pow(10, digits)).round().div(OmegaNum.pow(10, digits));
}
function Click() {
	player['Points'] = player['Points'].plus(player['PointGain']);
}
function Upgrade() {
	if (!player['Points'].gte(player['DoublerCost'])) return;
	player['Points'] = player['Points'].minus(player['DoublerCost']).max(0);
	player['PointGain'] = player['PointGain'].times('2');
	player['DoublerCost'] = player['DoublerCost'].times('3');
	player['DoublerNumber'] = player['DoublerNumber'].plus('1');
}
function Upgrade2() {
	if (!player['DoublerNumber'].gte(player['TripleCost'])) return;
	player['DoublerNumber'] = player['DoublerNumber'].minus(player['TripleCost']).max(0);
	player['PointGain'] = player['PointGain'].times('3');
	player['DoublerCost'] = player['DoublerCost'].div(player['DoublerCost']);
	player['TripleCost'] = player['TripleCost'].times('2');
	player['TriplerNumber'] = player['TriplerNumber'].plus('1');
}
var updater_starts = {};
updater_starts['textPoints2'] = '{{Points}}';
updater_starts['buttonsUpgrade-One'] = 'Point Doubler (Costs: {{DoublerCost}})';
updater_starts['buttonswhat'] = '+{{PointGain}} Points';
updater_starts['textNumber-of-Doublers'] = 'You have {{DoublerNumber}}';
updater_starts['textNumber-of-Triplers'] = 'You have {{TriplerNumber}}';
updater_starts['buttonsUpgrade-Two'] = '(Costs Doublers) Tripler (Cost: {{TripleCost}})';
function parseForUpdates(id) {
	let txt = updater_starts[id];
	if (txt.includes('{{') && txt.includes('}}')) {
		let content = txt.slice(txt.indexOf('{{')+2, txt.indexOf('}}')).split(' ').join('');
		let act;
		if (player[content]===undefined) act = window[content]();
		else act = player[content];
		document.getElementById(id).textContent = txt.slice(0, txt.indexOf('{{'))+act+txt.slice(txt.indexOf('}}')+2, txt.length);
	}
}
function save() {
	localStorage.setItem('incremental-creationsPoint-Incremental-(but-its-bad)', btoa(JSON.stringify(player)))}
function hardReset(force=false) {
	if (!force) if (!confirm('Are you sure you want to reset everything?')) return;
	localStorage.removeItem('incremental-creationsPoint-Incremental-(but-its-bad)');
	onLoad();
}
function gameLoop(diff) {
	parseForUpdates('textPoints2');
	parseForUpdates('buttonsUpgrade-One');
	parseForUpdates('buttonswhat');
	parseForUpdates('textNumber-of-Doublers');
	parseForUpdates('textNumber-of-Triplers');
	parseForUpdates('buttonsUpgrade-Two');
}
var lastTime = new Date().getTime();
let interval = setInterval(function() {
	gameLoop(new Date().getTime()-lastTime);
	lastTime = new Date().getTime();
}, 50)
let saveInterval = setInterval(function() {
	save();
}, 4000)
