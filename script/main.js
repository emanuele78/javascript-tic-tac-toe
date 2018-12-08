function createGameTree(tree, level, currentPlayer) {
	for (var cont = 0; cont < tree[level].length; cont++) {
		for (var i = 0; i < 9; i++) {
			if (tree[level][cont][i] == 0) {
				var before = tree[level][cont].substr(0, i);
				var after = tree[level][cont].substr(i + 1);
				tree[level + 1].push(before + currentPlayer + after);
			}
		}
	}
	if (level++ < 8) {
		currentPlayer = (currentPlayer == 1 ? 2 : 1);
		createGameTree(tree, level, currentPlayer);
	}
}

var tree = [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
];
tree[0].push("000000000")
var level = 0;
var currentPlayer = 1;
createGameTree(tree, level, currentPlayer);
console.log(tree);