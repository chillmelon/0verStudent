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

	// 在台僑生、在台港澳生
	const $taiwanUniversityRadio = $signUpForm.find('.radio-taiwanUniversity');
	const $applyPeerRadio = $signUpForm.find('.radio-applyPeer');

	/**
	* bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);
	$taiwanUniversityRadio.on('change', _checkTaiwanUniversity);
	$applyPeerRadio.on('change', _checkApplyPeer);

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
				break;
			case 4:
			case 5:
				$signUpForm.find('.question.inTaiwan').fadeIn()[0].reset();
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
})();
