(() => {
	/**
	*	cache DOM
	*/
	const $HK_MacaoNum = $('#HK_MacaoNum');
	const $otherNum = $('#otherNum');
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); });

	/**
	*	event handlet
	*/

	async function _init() {
		try {
		const response = await student.getAdmissionCount();
		if (!response.ok) { throw response; }
		const admissionCount = await response.json();
		$HK_MacaoNum.text(admissionCount.HK_Macao);
		$otherNum.text(admissionCount.other);

		} catch (e) {
			console.log(e);
		}
		loading.complete();
	}

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: email,
			password: sha256(pass)
		}

		loading.start();
		student.login(loginData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		})
		.then((json) => {
			console.log(!!json.student_misc_data.confirmed_at);
			if (!!json.student_misc_data.confirmed_at) {
				location.href = './uploadReviewItems.html';
			} else {
				location.href = './systemChoose.html';
			}
			loading.complete();
		})
		.catch((err) => {
			err === 401 && alert('帳號或密碼輸入錯誤。');
			loading.complete();
		})
	}

})();
