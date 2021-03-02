(() => {

	const baseUrl = env.baseUrl + '/students';

	let _diplomaFiles = [];
	let _transcriptsFiles = [];
	let _residentCertificateFiles = [];
	let _academicCertificateFiles = [];
	let _othersFiles = [];
	let _modalFiletype = "";
	let _modalFilename = "";

	/**
	*	cache DOM
	*/

	const $uploadEducationForm = $('#form-uploadEducation');
	const $fileUpload = $uploadEducationForm.find('.file-upload');
	const $residentUploadArea = $('#resident-upload-area');
	const $academicUploadArea = $('#academic-upload-area');
	const $diplomaUploadArea = $('#diploma-upload-area');
	const $transcriptsUploadArea = $('#transcripts-upload-area');
	const $othersUploadArea = $('#others-upload-area');
	const $precaution = document.getElementById('precaution');
	const $diplomaTitle = document.getElementById('diploma-title');
	const $diplomaPrecaution = document.getElementById('diploma-info-for-s5');
	const $imgModalBody= $('#detail-modal-body'); // modal 本體

	// 各項文憑考試
	const $diplomaBlockquote = $('#blockquote-diploma');
	const $diplomaFrom = $('#form-diploma');
	// const $diplomaTitle = $('#title-diploma');
	const diplomaImgArea = document.getElementById('diplomaImgArea');

	// 成績單
	const $transcriptsBlockquote = $('#blockquote-transcripts');
	const $transcriptsForm = $('#form-transcripts');
	const $transcriptsTitle = $('#title-transcripts');
	const transcriptsImgArea = document.getElementById('transcriptsImgArea');

	const residentCertificateImgArea = document.getElementById('residentCertificateImgArea');  // 僑居地居留證件
	const academicCertificateImgArea = document.getElementById('academicCertificateImgArea');  // 畢業證書、學歷證明文件
	const othersImgArea = document.getElementById('othersImgArea');  // 其他

	// Modal
	const $imgModal = $('#imgModal');
	const $modalDetailImg = $('#img-modalDetail');
	const $modalDeleteBtn = $('#btn-modalDelete');

	// 重整按鈕
	const $saveBtn = $('#btn-save');

	//已審核按鈕
	const $LockBtn = $('#btn-lock');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$fileUpload.on("change", _addImg);
	$modalDeleteBtn.on("click", _deleteImg);
	$saveBtn.on("click", function() {alert('儲存成功。'); window.location.reload();});
	

	function _init() {
		let files = student.getEducationFile()
		.then((res) => {
			if (res[0].ok && res[1].ok && res[2].ok && res[3].ok && res[4].ok && res[5].ok) {
				return [res[0].json(), res[1].json(), res[2].json(), res[3].json(), res[4].json(), res[5].json()];
			} else {
				throw res[0];
			}
		})
		.then((json) => {
			json[2].then((data) => {
				//不在開放期間直接跳轉回result頁面
				if(!data.can_admission_placement){
					location.href = './result.html';
				}
				//讓國際學校需要重選採計方式的同學自動跳轉到成績採計頁面
				if(!data.student_department_admission_placement_apply_way){
					location.href = './grade.html';
				}
				const malaysiaStage2ApplyWayId = [28, 29, 30, 31];//因為疫情今年（2021秋季入學）的馬來西亞學生 只剩 國際學校（O Level除外）的還在 S2
				if(malaysiaStage2ApplyWayId.indexOf(data.student_misc_data.admission_placement_apply_way) !== -1){
					$precaution.innerHTML = `
					<p>
						致：報名「聯合分發第2梯次」馬來西亞學生
						<br /><br />
						為因應全球疫情影響及爭取時效，本年馬來西亞「聯合分發」第2梯次<span class="text-danger" style="font-weight: bold">一律務必於填報系統上傳招生簡章規定之文件</span>，且紙本報名表件仍須送交我政府駐馬來西亞代表處或僑務主管機關指定之保薦單位，始完成報名。（<a href="https://drive.google.com/file/d/1qlR0Yom9DxwRO5yY1lMzPbAqrUzdMaNA/view?usp=sharing" target="_blank">點我看簡易報名流程圖</a>）
						<br />
						<ul>
							<li><b>步驟① 線上填報</b>：至2月28日（星期日）止；請於填報系統填寫個人基本資料及選填志願校系，檢視無誤後點選『完成填報』。</li>
							<li><b class="text-danger">步驟② 上傳簡章規定文件（NEW）：</b>&nbsp;至2月28日（星期日）止；請於本頁面上傳簡章規定文件。</li>
							<li><b>步驟③ 紙本繳件</b>：至2月28日（星期日）止，請於填報系統『下載報名表件』頁面列印系統產生的報名表件，並附上簡章規定文件，於期限內送交<a href="https://www.ocac.gov.tw/OCAC/Pages/VDetail.aspx?nodeid=1873&pid=6022463">保薦單位</a>（例：留台同學會、獨中）。</li>
						</ul>
						<br />
					</p>
					<hr>
					請同學上傳下列文件（詳請見<a href="https://cmn-hant.overseas.ncnu.edu.tw/sites/default/files/inline-files/04_110%E4%B8%80%E8%88%AC%E5%85%8D%E8%A9%A6_2.pdf" target="_blank">《一般地區招生簡章》</a>第三頁或<a href="https://drive.google.com/file/d/1ulFLXlFGGWi0jknjfctF65cW43UuA3QK/view?usp=sharing" target="_blank">點我看內容</a>）：
					<br /><br />
					<ul style="font-weight: bold">
						<li>僑居地居留證件（身分證或護照影本）</li>
						<li>在學證明 / 畢業證書 / 修業證明 / 離校證明</li>
						<li>中學成績單</li>
						<li>會考文憑（含成績單，例：SAT Subject Test測驗成績、A Level文憑成績、IBDP國際文憑預科成績），以中學最後三年成績申請者免附。</li>
						<li>其它（例：系統產生切結書、資料修正表等，無則免附。）</li>
					</ul>
					`;
					console.log($diplomaUploadArea);
					$diplomaTitle.innerText = '會考文憑（含成績單，例：SAT Subject Test測驗成績、A Level文憑成績、IBDP國際文憑預科成績），以中學最後三年成績申請者免附。';
					$('#diploma-info-for-s5').hide();
				} else {
					$precaution.innerHTML = `
					<p>
						致：報名「聯合分發第5梯次」馬來西亞學生
						<br /><br />
						為因應全球疫情影響及爭取時效，本年馬來西亞「聯合分發」第5梯次<span class="text-danger" style="font-weight: bold">一律務必於填報系統上傳招生簡章規定之文件</span>，且紙本報名表件仍須送交我政府駐馬來西亞代表處或僑務主管機關指定之保薦單位，始完成報名。（<a href="https://drive.google.com/file/d/14ovcQ3JhygxURZTLS86UWoE7Ha-0s74i/view?usp=sharing" target="_blank">點我看簡易報名流程圖</a>）
						<br />
						<ul>
							<li><b>步驟① 線上填報</b>：至3月31日（星期三）止；請於填報系統填寫個人基本資料及選填志願校系，檢視無誤後點選『完成填報』。</li>
							<li><b class="text-danger">步驟② 上傳簡章規定文件（NEW）：</b>&nbsp;至3月31日（星期三）止；請於本頁面上傳簡章規定文件。</li>
							<li><b>步驟③ 紙本繳件</b>：至3月31日（星期三）止，請於填報系統『下載報名表件』頁面列印系統產生的報名表件，並附上簡章規定文件，於期限內送交<a href="https://www.ocac.gov.tw/OCAC/Pages/VDetail.aspx?nodeid=1873&pid=6022463">保薦單位</a>（例：留台同學會、獨中）。</li>
						</ul>
						<br />
					</p>
					<hr>
					請同學上傳下列文件（詳請見<a href="https://cmn-hant.overseas.ncnu.edu.tw/sites/default/files/inline-files/03_110%E9%A6%AC%E4%BE%86%E8%A5%BF%E4%BA%9E_2.pdf" target="_blank">《馬來西亞地區招生簡章》</a>第三頁或<a href="https://drive.google.com/file/d/110tTtO5NUoZ6erywrUNT4QAizdr6kGPE/view?usp=sharing" target="_blank">點我看內容</a>）：
					<br /><br />
					<ul style="font-weight: bold">
						<li>僑居地居留證件（身分證或護照影本）</li>
						<li>在學證明 / 畢業證書 / 修業證明 / 離校證明</li>
						<li>中學成績單</li>
						<li>會考文憑（含成績單，例：STPM / A-LEVEL / SPM / O-LEVEL / 獨中統考）</li>
						<li>其它（例：系統產生切結書、資料修正表等，無則免附。）</li>
					</ul>
					`;
					$diplomaPrecaution.innerHTML = `
					<ul style="font-weight: bold">
						<li>持STPM文憑或A-LEVEL文憑申請者，如具有SPM中文成績或「Malaysian University English Test（MUET）」測驗成績單併請檢附。</li>
						<li>應屆畢業申請者，如因COVID-19疫情致報名時尚未取得STPM、SPM、Pernyataan文憑亦得申請，<b class="text-danger">惟須於文憑成績公布後10個日曆天內，於本頁面上傳提交會考文憑（含成績單），並將紙本文件送交原申請單位</b>，未完成上傳提交或未繳交紙本文件，一律不予分發。</li>
						<li>以華文獨中統考成績申請第5梯次限分發僑先部。</li>
					</ul>
					`;
					$diplomaTitle.innerText = '會考文憑（含成績單，例：STPM / A-LEVEL / SPM / O-LEVEL / 獨中統考）';
					$('#diploma-info-for-s5').show();
				}
				// <strong class="text-danger">*已繳交紙本報名表件者，仍請於本頁面補上傳簡章規定文件。</strong>
				//有僑編的就是已審核 就把儲存 上傳  刪除按鈕通通隱藏
				if(data.student_misc_data.overseas_student_id != null){
					$residentUploadArea.hide();
					$academicUploadArea.hide();
					$diplomaUploadArea.hide();
					$transcriptsUploadArea.hide();
					$othersUploadArea.hide();
					$modalDeleteBtn.hide();
					$saveBtn.hide();
					$LockBtn.show();
				}
			});

			json[0].then((data) => {
				_diplomaFiles = data.student_diploma;
			});

			json[1].then((data) => {  
				_transcriptsFiles = data.student_transcripts;
			});

			// 僑居地居留證件
			json[3].then((data) => {
				_residentCertificateFiles = data.student_resident_certificate;
			});

			// 畢業證書
			json[4].then((data) => {
				_academicCertificateFiles = data.student_academic_certificate;
			});

			json[5].then((data) => {
				_othersFiles = data.student_others;
			});

			Promise.all([json[0], json[1], json[3], json[4], json[5]]).then(() => {
				_renderImgArea();
			});

			// json[2].then((data) => {
			// 	if (data.student_qualification_verify.system_id === 2) {
			// 		$diplomaBlockquote.show();
			// 		$transcriptsBlockquote.show();
			// 	}
			// });
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		})
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function _renderImgArea() {
		// 各類會考文憑
		let diplomaAreaHTML = '';
		_diplomaFiles.forEach((file, index) => {
			const fileType = _getFileType(file.split('.')[1]);
			if(fileType === 'img'){
				diplomaAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/diploma/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="diploma" data-filename="' + file + '">';
			} else {
				diplomaAreaHTML += `
				<div
					class="img-thumbnail non-img-file-thumbnail img-edu"
					data-toggle="modal"
					data-target=".img-modal"
					data-filelink="${baseUrl}/diploma/${file}"
					data-filename="${file}"
					data-filetype="diploma"
					data-icon="fa-file-${fileType}-o"
				>
					<i 
						class="fa fa-file-${fileType}-o" aria-hidden="true"
						data-filename="${file}"
						data-filetype="diploma"
						data-icon="fa-file-${fileType}-o"
					>
					</i>
				</div>
			`;
			}
		})
		diplomaImgArea.innerHTML = diplomaAreaHTML;

		// 成績單
		let transcriptsAreaHTML = '';
		_transcriptsFiles.forEach((file, index) => {
			const fileType = _getFileType(file.split('.')[1]);
			if(fileType === 'img'){
				transcriptsAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/transcripts/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="transcripts" data-filename="' + file + '">';
			} else {
				transcriptsAreaHTML += `
				<div
					class="img-thumbnail non-img-file-thumbnail img-edu"
					data-toggle="modal"
					data-target=".img-modal"
					data-filelink="${baseUrl}/transcripts/${file}"
					data-filename="${file}"
					data-filetype="transcripts"
					data-icon="fa-file-${fileType}-o"
				>
					<i 
						class="fa fa-file-${fileType}-o" aria-hidden="true"
						data-filename="${file}"
						data-filetype="transcripts"
						data-icon="fa-file-${fileType}-o"
					>
					</i>
				</div>
			`;
			}
		})
		transcriptsImgArea.innerHTML = transcriptsAreaHTML;

		// 僑居地居留證件
		let residentCertificateAreaHTML = '';
		_residentCertificateFiles.forEach((file, index) => {
			const fileType = _getFileType(file.split('.')[1]);
			if(fileType === 'img'){
				residentCertificateAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/resident-certificate/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="resident-certificate" data-filename="' + file + '">';
			} else {
				residentCertificateAreaHTML += `
				<div
					class="img-thumbnail non-img-file-thumbnail img-edu"
					data-toggle="modal"
					data-target=".img-modal"
					data-filelink="${baseUrl}/resident-certificate/${file}"
					data-filename="${file}"
					data-filetype="resident-certificate"
					data-icon="fa-file-${fileType}-o"
				>
					<i 
						class="fa fa-file-${fileType}-o" aria-hidden="true"
						data-filename="${file}"
						data-filetype="resident-certificate"
						data-icon="fa-file-${fileType}-o"
					>
					</i>
				</div>
			`;
			}
		});
		residentCertificateImgArea.innerHTML = residentCertificateAreaHTML;

		// 畢業證書、學歷證明等
		let academicCertificateAreaHTML = '';
		_academicCertificateFiles.forEach((file, index) => {
			const fileType = _getFileType(file.split('.')[1]);
			if(fileType === 'img'){
				academicCertificateAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/academic-certificate/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="academic-certificate" data-filename="' + file + '">';
			} else {
				academicCertificateAreaHTML += `
				<div
					class="img-thumbnail non-img-file-thumbnail img-edu"
					data-toggle="modal"
					data-target=".img-modal"
					data-filelink="${baseUrl}/academic-certificate/${file}"
					data-filename="${file}"
					data-filetype="academic-certificate"
					data-icon="fa-file-${fileType}-o"
				>
					<i 
						class="fa fa-file-${fileType}-o" aria-hidden="true"
						data-filename="${file}"
						data-filetype="academic-certificate"
						data-icon="fa-file-${fileType}-o"
					>
					</i>
				</div>
			`;
			}
		});
		academicCertificateImgArea.innerHTML = academicCertificateAreaHTML;

		let othersAreaHTML = '';
		_othersFiles.forEach((file, index) => {
			const fileType = _getFileType(file.split('.')[1]);
			if(fileType === 'img'){
				othersAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/others/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="others" data-filename="' + file + '">';
			} else {
				othersAreaHTML += `
				<div
					class="img-thumbnail non-img-file-thumbnail img-edu"
					data-toggle="modal"
					data-target=".img-modal"
					data-filelink="${baseUrl}/others/${file}"
					data-filename="${file}"
					data-filetype="others"
					data-icon="fa-file-${fileType}-o"
				>
					<i 
						class="fa fa-file-${fileType}-o" aria-hidden="true"
						data-filename="${file}"
						data-filetype="others"
						data-icon="fa-file-${fileType}-o"
					>
					</i>
				</div>
			`;
			}
		});
		othersImgArea.innerHTML = othersAreaHTML;

		const $eduImg = $uploadEducationForm.find('.img-edu');
		$eduImg.on("click", _showDetail);
	}

	// 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

	function _addImg() {
		const uploadtype = $(this).data('uploadtype');
		const fileList = this.files;
		let sendData = new FormData();
		//偵測是否超過4MB
		if(sizeConversion(fileList[0].size)){
			alert('檔案過大，大小不能超過4MB！')
			return;
		}	

		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
		loading.start();
		student.uploadEducationFile(uploadtype, sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			if (uploadtype == "diploma") {
				_diplomaFiles = _diplomaFiles.concat(json.student_diploma);
			} else if (uploadtype == "transcripts") {
				_transcriptsFiles = _transcriptsFiles.concat(json.student_transcripts);
			} else if (uploadtype == "resident-certificate") {
				_residentCertificateFiles = _residentCertificateFiles.concat(json.student_resident_certificate);
			} else if (uploadtype == "academic-certificate") {
				_academicCertificateFiles = _academicCertificateFiles.concat(json.student_academic_certificate);
			} else if (uploadtype == "others") {
				_othersFiles = _othersFiles.concat(json.student_others);
			}
		})
		.then(() => {
			_renderImgArea();
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
				alert("圖片規格不符");
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				alert(data.messages[0]);
			})
			loading.complete();
		})
	}

	function _showDetail() {
		_modalFiletype = $(this).data('filetype');
		_modalFilename = $(this).data('filename');
		const fileType = _getFileType(_modalFilename.split('.')[1]);
		// 先清空 modal 內容
		$imgModalBody.html('');
		if(fileType === 'img'){
			$imgModalBody.html(`
				<img
					src="${baseUrl}/${_modalFiletype}/${_modalFilename}"
					class="img-fluid rounded img-ori"
				>
			`)
		} else {
			const icon = $(this).data('icon');
			$imgModalBody.html(`
			<div>
				<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>
			</div>

			<a class="btn btn-primary non-img-file-download" href="${baseUrl}/${_modalFiletype}/${_modalFilename}" target="_blank" >
				<i class="fa fa-download" aria-hidden="true"></i> 下載
			</a>
		`);
		}
	}

	function _deleteImg() {
		var deleteConfirm = confirm("確定要刪除嗎？");
		if (deleteConfirm === true) {
			$imgModal.modal('hide');
			loading.start();
			student.deleteEducationFile(_modalFiletype, _modalFilename)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				if (_modalFiletype === "diploma") {
					_diplomaFiles = json.student_diploma;
				} else if (_modalFiletype === "transcripts") {
					_transcriptsFiles = json.student_transcripts;
				} else if (_modalFiletype == "resident-certificate") {
					_residentCertificateFiles =  json.student_resident_certificate;
				} else if (_modalFiletype == "academic-certificate") {
					_academicCertificateFiles = json.student_academic_certificate;
				} else if (_modalFiletype == "others") {
					_othersFiles = json.student_others;
				}
			})
			.then(() => {
				_renderImgArea();
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else if (err.status && err.status === 404) {
					alert("沒有這張圖片。");
				}
				err.json && err.json().then((data) => {
					console.error(data.messages[0]);
					alert(data.messages[0]);
				})
				loading.complete();
			})
		}
	}

	//檔案大小計算是否超過4MB
	function sizeConversion(size) {
		let maxSize = 4*1024*1024;

		if(size < maxSize){
			return false;
		} else {
			return true;
		}
	}

})();
