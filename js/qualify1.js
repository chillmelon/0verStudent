(() => {
	/**
	*	private variable
	*/
	let _currentIdentity = 1;

	/**
	*	cache DOM
	*/
	const $signUpForm = $('#form-signUp');
	const $email = $signUpForm.find('#email');
	const $password = $signUpForm.find('#password');
	const $passwordConfirm = $signUpForm.find('#passwordConfirm');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	var $checkIdAlert = $signUpForm.find('#checkIdAlert');
	var $holdpassport = $signUpForm.find('.holdpassport');
	var $holdpassportPForm = $signUpForm.find('#holdpassportPForm');
	var $holdpassportP = $signUpForm.find('.holdpassportP');
	var $getPForm = $signUpForm.find('#getPForm');
	var $holdOtherPassportForm = $signUpForm.find('#holdOtherPassportForm');

	/**
	*	init
	*/
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	$passwordConfirm.on('blur', _handleValidatePassword);
	$identityRadio.on('change', _handleChangeIdentity);
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation)
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassport.on('click', _switchHoldpassportPForm);
	$holdpassportP.on('click', _switchPassportForm);

	// 確認兩次密碼輸入相同
	function _handleValidatePassword() {
		const $this = $(this);
		const oriPass = $password.val();
		const currentPass = $this.val();
		if (oriPass !== currentPass) {
			$this.addClass('invalidInput');
		} else {
			$this.removeClass('invalidInput');
		}
	}

	// 選擇身份別
	// 1: 港澳 2: 海外 3: 港澳具外國
	function _handleChangeIdentity () {
		_currentIdentity = $(this).val();
		$signUpForm.find('.question').hide();
		switch(_currentIdentity) {
			case '1':
				$signUpForm.find('.question.kangAo').fadeIn();
				break;
			case '2':
				$signUpForm.find('.question.overseas').fadeIn();
				break;
			case '3':
				$signUpForm.find('.question.kangAoSpecial').fadeIn();
				break;
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

	function _switchHoldpassportPForm() { // 是否持有英國國民(海外)護照或香港護照以外之旅行證照，或持有澳門護照以外之旅行證照？(含葡萄牙護照)
		var status = $(this).data('holdpassport');
		if (status) {
			$holdpassportPForm.fadeIn();
			_switchPassportForm();
		} else {
			$holdpassportPForm.fadeOut();
			$getPForm.fadeOut();
			$holdOtherPassportForm.fadeOut();
		}
	}

	function _switchPassportForm() { // 您是否持有葡萄牙護照？
		var status = $(this).data('holdpassportp');
		if (status) {
			$getPForm.fadeIn();
			$holdOtherPassportForm.fadeOut();
		} else {
			$holdOtherPassportForm.fadeIn();
			$getPForm.fadeOut();
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
})();