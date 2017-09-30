(() => {
	/**
	* private variable
	*/
	let _identity = 1;

	/**
	* cache dom
	*/
	const $signUpForm = $('#form-signUp');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $applyPeerStatusPadio = $signUpForm.find('.radio-applyPeerStatus');

	// 在台僑生、在台港澳生
	const $taiwanUniversityRadio = $signUpForm.find('.radio-taiwanUniversity');
	const $applyPeerRadio = $signUpForm.find('.radio-applyPeer');
	const $applyPeerYearInput = $signUpForm.find('.input-applyPeerYear');
	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');

	/**
	* bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);
	$taiwanUniversityRadio.on('change', _checkTaiwanUniversity);
	$applyPeerRadio.on('change', _checkApplyPeer);
	$applyPeerYearInput.on('blur', _checkApplyPeerYear);
	$applyPeerStatusPadio.on('change', _checkApplyPeerStatus);
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);

	/**
	* event handler
	*/
	function _handleChangeIdentity() {
		const identity = _identity = +$(this).val();
		$signUpForm.find('.question').hide();
		switch (identity) {
			case 1:
			case 2:
				break;
			case 3:
				$signUpForm.find('.question.overseas').fadeIn()[0].reset();
				$signUpForm.find('.question.overseas input[type=radio]:checked').trigger('change');
				break;
			case 4:
			case 5:
				$signUpForm.find('.question.inTaiwan').fadeIn()[0].reset();
				$signUpForm.find('.question.inTaiwan input[type=radio]:checked').trigger('change');
				break;
		}
	}

	// 請問您是否曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過？
	function _checkTaiwanUniversity() {
		const has = +$(this).val();
		if (!has) {
			const theReallyIdentity = _identity === 4 ? 1 : 3;
			const identityName = { 1: '港澳生', 3: '海外僑生' };
			alert(`身份別應為 ${identityName[theReallyIdentity]}`);
			$signUpForm.find(`.radio-identity[value="${theReallyIdentity}"]`).prop('checked', true).trigger('change');
		}
	}

	// 請問您是否曾經向本會申請同級學程（【帶入報名學生選定之申請類別】），並經由本會分發？
	function _checkApplyPeer() {
		const has = +$(this).val();
		!!has && $signUpForm.find('.applyPeerMore').fadeIn();
		!!has || $signUpForm.find('.applyPeerMore').fadeOut();
	}

	// 哪一年曾經向本會申請同級學程
	function _checkApplyPeerYear() {
		const $this = $(this);
		!!$this[0].checkValidity() && $this.removeClass('invalidInput');
		!!$this[0].checkValidity() || $this.addClass('invalidInput');
	}

	// 曾經向本會申請同級學程，擇一
	function _checkApplyPeerStatus() {
		const option = +$(this).val();
		$signUpForm.find('.applyPeerStatusAlert').hide();
		if (option === 1) {
			$signUpForm.find('.applyPeerStatusAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.applyPeerStatusAlert.invalid').fadeIn();
		}
	}

	// 海外僑生 曾分發與否
	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	// 海外僑生 曾分發與否 7選1
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

	// 海外僑生 海外居留年限
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
				$signUpForm.find('.stayLimitAlert.valid').fadeIn();
				break;
		}
	}
})();
