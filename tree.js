/*

	treeコマンドで、フォルダのみ表示するときの出力イメージ

*/

//--------------------------------------------------------------------------------
//■Facade:ファーストクラスコレクション(的位置づけ)

var ItemManager = function(name, weight) {
	//CompositeのrootのItemオブジェクト
	this.root;
};

ItemManager.prototype.buildComposite = function(records) {
	this._createRoot(records);
	this._createChildren(this.root, records);
};

ItemManager.prototype._createRoot = function(records) {
	var len = records.length;
	for (var i = 0; i < len; i++) {
		if (records[i].parentName === '-') {
			this.root = new Item(records[i].name, records[i].weight);
			break;
		}
	}
};

//再帰的に実行
ItemManager.prototype._createChildren = function(parent, records) {
	var len = records.length;
	for (var i = 0; i < len; i++) {
		if (records[i].parentName === parent.name) {
			var item = new Item(records[i].name, records[i].weight);
			parent.add(item);
			this._createChildren(item, records)
		}
	}
};


ItemManager.prototype.getTreeString = function() {
	return this.root.toTreeString();
};

ItemManager.prototype.getWeightSum = function() {
	return this.root.getWeightSum();
};


//--------------------------------------------------------------------------------
//■階層構造を持つItem（Composite）

var Item = function(name, weight) {
	this.name = name;
	this.weight = parseInt(weight, 10);
	//自分直下のItemたちを保持
	this.children = [];
};

Item.prototype.add = function(item) {
	this.children.push(item);
};


Item.prototype.toTreeString = function() {
	var treeTexts = [];
	this._createTreeTexts(treeTexts, 0, '', '');

	var text = this._convToString(treeTexts);
	return text;
};

Item.prototype._convToString = function(treeTexts) {
	var text = '';
	var len = treeTexts.length;
	for (var i = 0; i < len; i++) {
		//console.log(treeTexts[i]);
		text += treeTexts[i] + '\n';
	}
	return text;
};

//子Itemのメソッドも連鎖的に呼ぶ
//level: rootがゼロ, 以降 1～
Item.prototype._createTreeTexts = function(treeTexts, level, prefixForSelf, prefixForChild) {
	var treeText;

	//見易さのため、カラ行１行を追加
	if (level === 1) {
		treeTexts.push('│');
	}

	//自分の出力
	//console.log(prefixForSelf + this.name);
	var weightText = '';
	if (level > 0) {
		weightText = ' (' + this.weight + 'g)';
	}
	var weightSumText = '';
	var len = this.children.length;
	if (level > 0 && len > 0) {
		var sum = this.getWeightSum();
		weightSumText = (sum > 0) ? ' <span class="sum">(合計[' + sum + ']g)</span>' : '';
	}
	treeTexts.push(prefixForSelf + this.name + weightText + weightSumText);

	//子どもたちの出力
	var prefix1;
	var prefix2;
	var len = this.children.length;
	for (var i = 0; i < len; i++) {
		//最後の子でない場合
		if (i < (len - 1)) {
			prefix1 = prefixForChild + '├─';
			prefix2 = prefixForChild + '│  ';
		}else{
			prefix1 = prefixForChild + '└─';
			prefix2 = prefixForChild + '    ';
		}
		this.children[i]._createTreeTexts(treeTexts, (level + 1), prefix1, prefix2);
	}
};


//子Itemのメソッドも連鎖的に呼ぶ
Item.prototype.getWeightSum = function() {
	var sum = this.weight;
	var len = this.children.length;
	for (var i = 0; i < len; i++) {
		sum += this.children[i].getWeightSum();
	}
	return sum;
};


//--------------------------------------------------------------------------------
