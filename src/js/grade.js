(() => {

	/**
	*	cache DOM
	*/

	const $applyWaysFieldSet = $('#apply-ways');
	const $goToFF = $('#go-to-FF');  // 「可以被分發去僑先部」的核取方塊
	
	/**
	*	init
	*/
	_init();

	/**
	*	bind event
	*/

	$applyWaysFieldSet.on('change.chooseOption', '.radio-option', _handleChoose);
	$('.btn-save').on('click', _handleSave);

	/**
	* event handler
	*/

	function _handleChoose() {
		if (+$(this).val() === 23) {
			// 以香港中學文憑考試成績 (DSE)、以香港高級程度會考成績 (ALE)、以香港中學會考成績 (CEE)申請
			$('.forCode23').fadeIn();
		} else {
			$('.forCode23').hide();
		}

		if (+$(this).val() === 1) {
			// code = 01 (華文獨中統考文憑) 要驗證 馬來西亞華文獨中統考准考證號碼
			$('.forCode01').fadeIn();
		} else {
			$('.forCode01').hide();
		}
	}

	async function _handleSave() {

		const id = $('.radio-option:checked').attr('data-id');
		const code = $('.radio-option:checked').val();
		if (!id || !code) {
			alert('請選擇您欲申請的成績採計方式');
			return;
		}
		const toFForNot = $goToFF.prop('checked');

		console.log(id);

		let data = {
			apply_way: id
		};

		if (+code === 1) {
			data.my_admission_ticket_no = $('.my_admission_ticket_no').val();
		}

		if (+code === 23) {
			data.year_of_hk_dse = $('.year_of_hk_dse').val();
			data.year_of_hk_ale = $('.year_of_hk_ale').val();
			data.year_of_hk_cee = $('.year_of_hk_cee').val();
		}

		loading.start();
		try {
			const choseFF = await student.setStudentGoToFForNot(toFForNot);
			if(!choseFF.ok){
				throw choseFF;
			}
		} catch (e) {
			e.json && e.json().then((data) => {
				console.error(data);

				alert(`${data.messages[0]}`);

				loading.complete();
			});
			return;
		}

		student.setStudentAdmissionPlacementApplyWay(data).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
			alert("儲存成功");
			if (json.student_misc_data.admission_placement_apply_way_data.code === '99999') { // 不參加聯分，原地 reload
				window.location.reload();
			} else { // 其餘導向下一頁
				location.href = "./placementSelection.html"
			}
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				alert(data.messages[0]);
			});
			loading.complete();
		});
	}

	function _init() {
		// 取得選項
		student.getStudentAvailableApplyWayList()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			let fieldSetHTML = '';

			json.forEach((file, index) => {
				fieldSetHTML += '<div class="form-group form-check"><label class="form-check-label"><input type="radio" class="form-check-input radio-option" name="grade" data-id="' + file.id + '" value=' + file.code + '>' + file.description + '</label></div>';
			});

			$applyWaysFieldSet.html(fieldSetHTML);
		})
		.then(() => {
			// 取得選擇的選項
			student.getStudentAdmissionPlacementApplyWay()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				const option = json.student_misc_data.admission_placement_apply_way_data ? json.student_misc_data.admission_placement_apply_way_data.code : null;
				const { year_of_hk_ale, year_of_hk_cee, year_of_hk_dse, my_admission_ticket_no } = json.student_misc_data;
				!!option && $(`.radio-option[value=${option}]`).trigger('click');
				$('.year_of_hk_dse').val(year_of_hk_dse || '');
				$('.year_of_hk_ale').val(year_of_hk_ale || '');
				$('.year_of_hk_cee').val(year_of_hk_cee || '');
				$('.my_admission_ticket_no').val(my_admission_ticket_no || '');
			})
		})
		.then(() => {
			// 取得學生是否願意去僑先部的資料
			student.getStudentGoToFForNot()
			.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
			.then((FF_or_not_json) => {
				/*
				 * 如果是假，代表願意分發到僑先部 => 打勾；
				 * 反之，為真就代表不願意
				 */
				if(FF_or_not_json.not_to_FF){  // 抵死不想去
					$goToFF.prop('checked', false);
				} else {  // 我都可以
					$goToFF.prop('checked', true);
				}
			})
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 403) {
				err.json && err.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		});
	}



})();
