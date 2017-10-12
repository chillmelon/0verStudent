(() => {
	/**
	*	private variable
	*/
	let _currentIdentity = 1;
	let _typeOfKangAo = 1;

	/**
	* init
	*/
	function _init() {
		// set Continent & Country select option
		student.getCountryList().then((data) => {
			$passportContinentSelect.empty();
			data.forEach((val, i) => {
				$passportContinentSelect.append(`<option value="${i}">${val.continent}</option>`);
			});

			$passportCountrySelect.empty();
			data[0].country.forEach((val, i) => {
				$passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
			});	
		});
	}

	/**
	*	cache DOM
	*/
	const $signUpForm = $('#form-signUp');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $saveBtn = $signUpForm.find('.btn-save');

	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');

	// 港澳生
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $taiwanHousehold = $signUpForm.find('.radio-taiwanHousehold');
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');
	const $passportContinentSelect = $signUpForm.find('.select-passportContinent');
	const $passportCountrySelect = $signUpForm.find('.select-passportCountry');
	const $KA_isDistributionRadio = $signUpForm.find('.question.kangAo .kangAo_radio-isDistribution');
	const $KA_distributionMoreQuestion = $signUpForm.find('.question.kangAo .kangAo_distributionMoreQuestion');
	const $KA_stayLimitRadio = $signUpForm.find('.question.kangAo .kangAo_radio-stayLimit');
	const $KA_hasBeenTaiwanRadio = $signUpForm.find('.question.kangAo .kangAo_radio-hasBeenTaiwan');
	const $KA1_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType1_radio-whyHasBeenTaiwan');
	const $KA2_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType2_radio-whyHasBeenTaiwan');

	/**
	*	init
	*/
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);
	$saveBtn.on('click', _handleSave);

	// 海外僑生
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);

	// 港澳生
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$taiwanHousehold.on('change', _checkTaiwanHousehold);
	$portugalPassportRadio.on('change', _checkPortugalPassport);
	$portugalPassportTime.on('change', _checkPortugalPassportTime);
	$passportContinentSelect.on('change', _setCountryOption);
	$KA_isDistributionRadio.on('change', _handleKAIsDistribution);
	$KA_distributionMoreQuestion.on('change', _checkKADistributionValidation);
	$KA_stayLimitRadio.on('change', _checkKAStayLimitValidation);
	$KA_hasBeenTaiwanRadio.on('change', _checkKAHasBeenTaiwanValidation);
	$KA1_whyHasBeenTaiwan.on('change', _checkKA1WhyHasBeenTaiwanValidation);
	$KA2_whyHasBeenTaiwan.on('change', _checkKA2WhyHasBeenTaiwanValidation);

	/**
	*	event handler
	*/
	// 選擇身份別
	// 1: 港澳 2: 海外 3: 港澳具外國
	function _handleChangeIdentity () {
		_currentIdentity = $(this).val();
		$signUpForm.find('.question').hide();
		switch(_currentIdentity) {
			case '1':
			case '3':
				$signUpForm.find('.question.kangAo').fadeIn();
				break;
			case '2':
				$signUpForm.find('.question.overseas').fadeIn();
				break;
		}
	}

	// 儲存
	function _handleSave() {
		if (+_currentIdentity === 2) {
			// 海外僑生
			const isDistribution = +$signUpForm.find('.isDistribution:checked').val();
			const distributionTime = $signUpForm.find('inpit-distributionTime').val();
			const distributionOption = +$signUpForm.find('.distributionMoreQuestion:checked').val();
			const stayLimitOption = +$signUpForm.find('.radio-stayLimit:checked').val();
			const hasBeenTaiwan = +$signUpForm.find('.radio-hasBeenTaiwan:checked').val();
			const hasBeenTaiwanOption = +$signUpForm.find('.radio-whyHasBeenTaiwan:checked').val();
			const invalidDistributionOption = [3, 4, 5, 6];
			let valid = true;
			if (!!isDistribution && invalidDistributionOption.includes(distributionOption) ||
				!!isDistribution && distributionTime === '' ||
				stayLimitOption ===1 ||
				!!hasBeenTaiwan && hasBeenTaiwanOption === 8) {
				valid = false;
			}

			if (valid) {
				console.log(`是否曾經分發來臺就學過？ ${!!isDistribution}`);
				console.log(`曾分發來臺於西元幾年分發來台？ ${distributionTime}`);
				console.log(`曾分發來臺請就下列選項擇一勾選 ${distributionOption}`);
				console.log(`海外居留年限 ${stayLimitOption}`);
				console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!hasBeenTaiwan}`);
				console.log(`在台停留日期請就下列選項，擇一勾選，並檢附證明文件： ${hasBeenTaiwanOption}`);
				console.error('還沒判斷是否已選定身份別，若是，則要帶 force_update');
				student.verifyQualification({
					system_id: 1,
					identity: 3,
					has_come_to_taiwan: !!isDistribution,
					come_to_taiwan_at: distributionTime,
					reason_selection_of_come_to_taiwan: distributionOption,
					overseas_residence_time: stayLimitOption,
					stay_over_120_days_in_taiwan: !!hasBeenTaiwan,
					reason_selection_of_stay_over_120_days_in_taiwan: hasBeenTaiwanOption,
					force_update: true // TODO:
				})
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					console.log(json);
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				});
			} else {
				alert('身份不具報名資格');
			}
		} else {
			// 港澳生
			const idCard = +$signUpForm.find('.radio-idCard:checked').val();
			const holdpassport = +$signUpForm.find('.radio-holdpassport:checked').val();
			const taiwanHousehold = +$signUpForm.find('.radio-taiwanHousehold:checked').val();
			const portugalPassport = +$signUpForm.find('.radio-portugalPassport:checked').val();
			const portugalPassportTime = $signUpForm.find('.input-portugalPassportTime').val();
			const passportCountry = $passportCountrySelect.val();
			const KA_isDistribution = +$signUpForm.find('.kangAo_radio-isDistribution:checked').val();
			const KA_distributionTime = $signUpForm.find('.kangAo_input-distributionTime').val();
			const KA_distributionMoreQuestion = +$signUpForm.find('.kangAo_distributionMoreQuestion:checked').val();
			const KA_stayLimitOption = +$signUpForm.find('.kangAo_radio-stayLimit:checked').val();
			const KA_hasBeenTaiwan = +$signUpForm.find('.kangAo_radio-hasBeenTaiwan:checked').val();
			const KA1_whyHasBeenTaiwanOption = +$signUpForm.find('.kangAoType1_radio-whyHasBeenTaiwan:checked').val();
			const KA2_whyHasBeenTaiwanOption = +$signUpForm.find('.kangAoType2_radio-whyHasBeenTaiwan:checked').val();
			const invalidDistributionOption = [3, 4, 5, 6];
			let valid = true;
			if (!idCard ||
				!_typeOfKangAo ||
				!!KA_isDistribution && KA_distributionTime === '' ||
				!!KA_isDistribution && invalidDistributionOption.includes(KA_distributionMoreQuestion) ||
				KA_stayLimitOption === 1 ||
				!!KA_hasBeenTaiwan && _typeOfKangAo === 1 && KA1_whyHasBeenTaiwanOption === 11 ||
				!!KA_hasBeenTaiwan && _typeOfKangAo === 2 && KA2_whyHasBeenTaiwanOption === 8) {
				valid = false;
			}

			if (valid) {
				console.log(`請問您是否擁有香港或澳門永久性居民身分證？ ${!!idCard}`);
				console.log(`是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照？ ${!!holdpassport}`);
				console.log(`是否曾在臺設有戶籍？ ${!!taiwanHousehold}`);
				console.log(`是否持有葡萄牙護照？ ${!!portugalPassport}`);
				console.log(`於何時首次取得葡萄牙護照？ ${portugalPassportTime.replace(/-/g, '/')}`);
				console.log(`您持有哪一個國家之護照？ ${passportCountry}`);
				console.log(`曾分發來臺 ${!!KA_isDistribution}`);
				console.log(`於西元幾年分發來台？ ${KA_distributionTime}`);
				console.log(`曾分發來臺並請就下列選項擇一勾選 ${KA_distributionMoreQuestion}`);
				console.log(`海外居留年限 ${KA_stayLimitOption}`);
				console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!KA_hasBeenTaiwan}`);
				console.log(`在台停留日期請就下列選項，擇一勾選，並檢附證明文件：{{{ type1 }}} ${KA1_whyHasBeenTaiwanOption}`);
				console.log(`在台停留日期請就下列選項，擇一勾選，並檢附證明文件：{{{ type2 }}} ${KA2_whyHasBeenTaiwanOption}`);
				console.error('還沒判斷是否已選定身份別，若是，則要帶 force_update');
				student.verifyQualification({
					system_id: 1,
					identity: _typeOfKangAo,
					HK_Macao_permanent_residency: !!idCard,
					except_HK_Macao_passport: !!holdpassport,
					taiwan_census: !!taiwanHousehold,
					portugal_passport: !!portugalPassport,
					first_get_portugal_passport_at: portugalPassportTime.replace(/-/g, '/'),
					which_nation_passport: passportCountry
					has_come_to_taiwan: !!KA_isDistribution,
					come_to_taiwan_at: KA_distributionTime,
					reason_selection_of_come_to_taiwan: KA_distributionMoreQuestion,
					overseas_residence_time: KA_stayLimitOption,
					stay_over_120_days_in_taiwan: !!KA_hasBeenTaiwan,
					reason_selection_of_stay_over_120_days_in_taiwan: _typeOfKangAo === 1 ? KA1_whyHasBeenTaiwanOption : KA2_whyHasBeenTaiwanOption,
					force_update: true
				})
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					console.log(json);
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				});
			} else {
				alert('資料未正確填寫，或身份不具報名資格');
			}
		}
	}

	// 判斷是否分發來台就學的一推選項是否符合資格
	function _checkDistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const validOption = [1, 2, 7];
		$signUpForm.find('.distributionMoreAlert').hide();
		if (validOption.includes(option)) {
			$signUpForm.find('.distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 海外居留年限判斷
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 為何在台超過一百二十天
	function _checkWhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$('.whyHasBeenTaiwanAlert').hide();
		if (option === 8) {
			$('.whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$('.whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 是否擁有香港或澳門永久性居民身分證
	function _cehckIdCardValidation() {
		const $this = $(this);
		const idCard = +$this.val();
		!!idCard && $signUpForm.find('.idCardAlert.invalid').fadeOut();
		!!idCard || $signUpForm.find('.idCardAlert.invalid').fadeIn();
	}

	// 是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照
	function _checkHoldpassport() {
		const $this = $(this);
		const holdpassport = +$this.val();
		!!holdpassport && $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeIn() && _setTypeOfKangAo(null);
		!!holdpassport || $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeOut() && _setTypeOfKangAo(1);
	}

	// 是否曾在臺設有戶籍
	function _checkTaiwanHousehold() {
		$portugalPassportTime.val('').trigger('change');
		$signUpForm.find('.radio-portugalPassport:checked').trigger('change');
		_setTypeOfKangAo(null);
	}

	// 是否持有葡萄牙護照
	function _checkPortugalPassport() {
		const $this = $(this);
		const portugalPassport = +$this.val();
		$signUpForm.find('.whichPassportAlert.valid1').fadeOut();
		$signUpForm.find('.whichPassportAlert.valid2').fadeOut();
		if (portugalPassport) {
			_currentIdentity = 1;
			_setTypeOfKangAo(null);
			$signUpForm.find('.whichPassport').fadeOut();
			$signUpForm.find('.portugalPassportMore').fadeIn();
			$portugalPassportTime.val('').trigger('change');
		} else {
			$signUpForm.find('.whichPassport').fadeIn();
			$signUpForm.find('.portugalPassportMore').fadeOut();
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.whichPassportAlert.valid1').fadeIn();
			} else {
				_currentIdentity = 3;
				_setTypeOfKangAo(2);
				$signUpForm.find('.whichPassportAlert.valid2').fadeIn();
			}
		}
	}

	// 於何時首次取得葡萄牙護照
	function _checkPortugalPassportTime() {
		const $this = $(this);
		const portugalPassportTime = $this.val();
		$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeOut();
		if (portugalPassportTime === '') {
			return;
		}
		
		if (moment(portugalPassportTime).isBefore('1999-12-20')) {
			// 身分確認為港澳生【甲】
			_currentIdentity = 1;
			_setTypeOfKangAo(1);
			$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeIn();
		} else {
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeIn();
			} else {
				// 身分確認為「港澳具外國國籍之華裔學生」【乙】
				_currentIdentity = 3;
				_setTypeOfKangAo(2);
				$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeIn();
			}
		}
	}

	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}

	// 選洲，更換國家選項
	function _setCountryOption() {
		const order = $(this).val();
		$passportCountrySelect.empty();
		student.getCountryList().then((data) => {
			data[order].country.forEach((val, i) => {
				$passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
			});
		});
	}

	// 港澳生 是否分發來台
	function _handleKAIsDistribution() {
		const $this = $(this);
		const isDistribution = +$this.val();
		!!isDistribution && $signUpForm.find('.kangAo_distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('.kangAo_distributionMore').fadeOut();
	}

	function _checkKADistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const valid = [1, 2];
		$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeOut();
		$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeOut();
		if (valid.includes(option)) {
			$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 港澳生 海外居留年限
	function _checkKAStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAo_stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.kangAo_stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.kangAo_stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 港澳生 在台停留日期
	function _checkKAHasBeenTaiwanValidation() {
		const $this = $(this);
		const has = +$this.val();
		$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeOut();
		$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeOut();
		if (has) {
			switch (_typeOfKangAo) {
				case 1:
					$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeIn();
					break;
				case 2:
					$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeIn();
					break;
				default:
					alert('請確保上述問題已正確填答');
					$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
					break;
			}
		}
	}


	// 港澳生 甲 為何在台停留一堆問題
	function _checkKA1WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 11) {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 港澳生 乙 為何在台停留一堆問題
	function _checkKA2WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 8) {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	/**
	*	private method
	*/
	function _setTypeOfKangAo(type) {
		console.log(`Kang Ao type changed: ${type}`);
		$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
		switch (type) {
			case 1:
				_typeOfKangAo = 1;
				break;
			case 2:
				_typeOfKangAo = 2;
				break;
			default:
				_typeOfKangAo = null;
				break;
		}
	}

	_init();
})();
