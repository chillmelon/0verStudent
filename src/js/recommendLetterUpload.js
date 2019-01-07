(() => {
    /**
     * init
     */
    _verify();

    /**
     *	bind event
     */

    $('body').on('change.upload', '.file-certificate', previewFile);

    /**
     * private method
     */
    async function _verify(){
        loading.complete();
        /*try {
            const email = _getParam('email', window.location.href);
            const token = _getParam('token', window.location.href);

            const response = await student.verifyEmail(email, token);
            if (!response.ok) { throw response; }

            $('#alert-valid').show();
            setTimeout(() => {
                location.href = './index.html';
            }, 3000);
            loading.complete();
        } catch (e) {
            e.json && e.json().then((data) => {
                console.error(data);

                if (e.status && e.status === 400) {
                    $('#alert-invalid').show();

                    setTimeout(() => {
                        location.href = './index.html';
                    }, 3000);
                } else {
                    alert(`${data.messages[0]}`);

                    setTimeout(() => {
                        location.href = './index.html';
                    }, 0);
                }

                loading.complete();
            });
        }*/
    }

    function _getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    async function previewFile(){
        const fileList = this.files;
        let data = new FormData();
        checkFile(this); //檢查檔案類型
        var files = []; //等等要生成JSON用
        for (let i = 0; i < fileList.length; i++) {
            data.append('files[]', fileList[i].name);
            console.log(fileList[i].name);
            files.push(fileList[i].name); //update array data
        }
        var  fileJSON = JSON.stringify(files); //file name (base64) file list
        localStorage.setItem('recommendLetterFile',fileJSON);
        document.getElementById('preview').innerHTML = fileJSON;
    }

    //檢查檔案類型
    function checkFile(sender){
        var extension = new Array(".jpg", ".png", ".pdf,.jpeg");// 可接受的附檔名
        var fileExtension = sender.value;
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.'));
        if (extension.indexOf(fileExtension) < 0) {
            alert("非可接受的檔案類型，可接受的副檔名有：" + extension.toString());
            sender.value = null;
            return false;
        } else {
            return true;
        }
    }
    //localStorage.removeItem("recommendLetterFile"); //清除localStorage
})();
