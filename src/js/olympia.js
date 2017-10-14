(() => {

	/**
	*	private variable
	*/

	let _hasOlympia = 0;

	let _optionalWish = [];

	let _wishList = [];

	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	const $hasOlympiaForm = $('#form-hasOlympia'); // 是否有「奧林匹亞獎項」表單
	const $hasOlympia = $hasOlympiaForm.find('.hasOlympia'); // 是否有「奧林匹亞獎項」選項
	const $olympiaSelectForm = $('#form-olympiaSelect'); // 奧林匹亞志願選擇表單
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const optionalWishList = document.getElementById('optionalWish-list'); // 招生校系清單，渲染用
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$hasOlympia.on('change', _changeHasOlympia); // 監聽是否曾獲得國際數理奧林匹亞競賽或美國國際科展獎項
	$optionFilterSelect.on('change', _filterOptionalWishList); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _filterOptionalWishList); // // 監聽「招生校系清單」關鍵字
	$saveBtn.on('click', _handleSave);

	async function _init() {
		try {
			const response = await student.getOlympiaAspirationOrder()
			if (!response[0].ok) { throw response[0]; }

			const resOlympia = await response[0].json();
			const resOrder = await response[1].json();

			const groupName = ["", "第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.card_code,
					group: groupName[value.group_code],
					school: value.school.title,
					dept: value.title,
					engDept: value.eng_title
				};
				_optionalWish.push(add);
			})

			// checked 是否曾獲得獎項
			_hasOlympia = +resOlympia.student_misc_data.has_olympia_aspiration;
			$hasOlympia[_hasOlympia].checked = true;

			// 整理已選志願
			let order = [];
			resOlympia.student_olympia_aspiration_order.forEach((value, index) => {
				order.push(value.department_data.card_code);
			});
			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.map(function(x) {return x.id; }).indexOf(value);
				_wishList.push(_optionalWish[orderIndex]);
				_optionalWish.splice(orderIndex, 1);
			});

			student.setHeader();
			_generateOptionalWish();
			_generateWishList();
			_showWishList();

			console.log(resOlympia);
			console.log(_optionalWish);
		} catch (e) {
			console.log('Boooom!!');
			console.log(e);
		}
	}

	function _changeHasOlympia() {
		_hasOlympia = Number($(this).val());
		_showWishList();
	}

	function _showWishList() { // 不參加申請，即不顯示聯分表單
		if (_hasOlympia === 0) {
			$olympiaSelectForm.fadeOut();
		} else if (_hasOlympia === 1) {
			$olympiaSelectForm.fadeIn();
		}
	}

	function _filterOptionalWishList() { // 篩選校系清單項目
		const filterSelect = Number($optionFilterSelect.val());
		const filter = $optionFilterInput.val().toUpperCase();
		const tr = $optionalWishList.find('tr');
		for (let i = 0; i < tr.length; i++) {
			let spanVal = $(tr[i].getElementsByTagName("span")[filterSelect]).text();
			if (spanVal) {
				if (spanVal.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 3) {
			let optionalIndex = $(this).data("optionalindex");
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish();
			_generateWishList();
			_filterOptionalWishList();
		} else {
			alert('志願數量已達上限。');
		}
	}

	function _findRowIndex(row) { // 尋找該志願選項 index（移動或刪除志願時使用）
		const tableRow = row.closest('tr');
		const index = tableRow.data('wishindex');
		return index;
	}

	function _prevWish() { // 志願上調
		const rowIndex = _findRowIndex($(this));
		if (rowIndex > 0) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex - 1];
			_wishList[rowIndex - 1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() { // 志願下調
		const rowIndex = _findRowIndex($(this));
		if (rowIndex < _wishList.length - 1) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex + 1];
			_wishList[rowIndex + 1] = swap;
			_generateWishList();
		}
	}

	function _removeWish() { // 刪除志願
		const rowIndex = _findRowIndex($(this));
		_optionalWish.push(_wishList[rowIndex]);
		_wishList.splice(rowIndex, 1);
		_optionalWish.sort(function(a, b) {
			return parseInt(a.id) - parseInt(b.id);
		});
		_generateOptionalWish();
		_generateWishList();
		_filterOptionalWishList();
	}

	function _savePrevWishIndex() { // 暫存志願序號
		_prevWishIndex = $(this).val() - 1;
	}

	function _chWishIndex() { // 修改志願序號
		let currentNum = $(this).val();

		if (currentNum > _wishList.length) {
			currentNum = _wishList.length;
		} else if (currentNum < 1 ) {
			currentNum = 1;
		}
		_currentWishIndex = currentNum - 1;

		const element = _wishList[_prevWishIndex];
		_wishList.splice(_prevWishIndex, 1);
		_wishList.splice(_currentWishIndex, 0, element);
		_generateWishList();
	}

	function _generateOptionalWish() { // 渲染「招生校系清單」
		let rowHtml = '';

		for(let i in _optionalWish) {
			rowHtml = rowHtml + `
			<tr>
			<td>
			<span>` + _optionalWish[i].id + `</span> ｜ <span>` + _optionalWish[i].group + `</span> ｜ <span>` + _optionalWish[i].school + `</span> <br>
			<span>` + _optionalWish[i].dept + ` ` + _optionalWish[i].engDept + `</span>
			</td>
			<td class="text-right">
			<button type="button" data-optionalIndex="` + i + `" class="btn btn-info btn-sm add-wish">
			<i class="fa fa-plus" aria-hidden="true"></i>
			</button>
			</td>
			</tr>
			`;
		}
		optionalWishList.innerHTML = rowHtml;

		const $addWish = $optionalWishList.find('.add-wish');
		$addWish.on("click", _addWish);
	}

	function _generateWishList() { // 「渲染已填選志願」
		let rowHtml = '';
		for(let i in _wishList) {
			rowHtml = rowHtml + `
			<tr data-wishIndex="` + i + `">
			<td>
			<button type="button" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			` + _wishList[i].id + ` ｜ ` + _wishList[i].group + ` ｜ ` + _wishList[i].school + ` <br>
			` + _wishList[i].dept + ` ` + _wishList[i].engDept + `
			</td>
			<td class="text-right">
			<div class="input-group">
			<input type="text" class="form-control wish-num" value="` + (Number(i) + 1) + `">
			<div class="input-group-btn">
			<button type="button" class="btn btn-secondary btn-sm up-arrow">
			<i class="fa fa-chevron-up" aria-hidden="true"></i>
			</button>
			<button type="button" class="btn btn-secondary btn-sm down-arrow">
			<i class="fa fa-chevron-down" aria-hidden="true"></i>
			</button>
			</div>
			</div>
			</td>
			</tr>
			`;
		}
		wishList.innerHTML = rowHtml;

		const $removeWish = $wishList.find('.remove-wish');
		const $wishNum = $wishList.find('.wish-num');
		const $upArrow = $wishList.find('.up-arrow');
		const $downArrow = $wishList.find('.down-arrow');
		$removeWish.on("click", _removeWish);
		$wishNum.on("focusin", _savePrevWishIndex);
		$wishNum.on("change", _chWishIndex);
		$upArrow.on("click", _prevWish);
		$downArrow.on("click", _nextWish);
	}

	function _handleSave() {
		if (_hasOlympia === 1) {
			let order = [];
			if (_wishList.length > 0) {
				_wishList.forEach((value, index) => {
					order.push(value.id);
				});
				const data = {
					has_olympia_aspiration: _hasOlympia,
					order
				}
				student.setOlympiaAspirationOrder(data)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					console.log(json);
					let conf = confirm("儲存成功，欲往下一頁請按「確定」，留在此頁請按「取消」。");
					if (conf == true) {
						location.href = "./uploadEducation.html"
					}
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				})
			} else {
				alert('沒有選擇志願。');
			}
		} else {
			const data = {
				has_olympia_aspiration: _hasOlympia,
			}
			student.setOlympiaAspirationOrder(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				let conf = confirm("儲存成功，欲往下一頁請按「確定」，留在此頁請按「取消」。");
				if (conf == true) {
					location.href = "./uploadEducation.html"
				}
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			})
		}
	}

})();
