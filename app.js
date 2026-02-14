// GoogleフォームのURLと各項目のentry IDを指定する場所
// ユーザー様に取得いただいたIDをここに埋め込みます
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeQ6MX4g98oRY77JvVyAnSUH9nnK9CPXm3tnHdWUXeqHhoG5g';
const ENTRY_ID_NAME = 'entry.2146929291'; // 「名前」のentry ID
const ENTRY_ID_STATUS = 'entry.2039162242'; // 「ステータス」のentry ID

document.addEventListener('DOMContentLoaded', () => {
    const btnIn = document.getElementById('btn-in');
    const btnOut = document.getElementById('btn-out');
    const statusMessage = document.getElementById('status-message');

    // 出勤ボタン
    btnIn.addEventListener('click', () => {
        sendData('出勤');
    });

    // 退勤ボタン
    btnOut.addEventListener('click', () => {
        sendData('退勤');
    });

    async function sendData(status) {
        // 選択されているユーザー名を取得
        const selectedUser = document.querySelector('input[name="user"]:checked').value;
        // 表示用の名前（Aさん、Bさん）を取得
        const userLabel = document.querySelector('input[name="user"]:checked + span').textContent;

        // UIフィードバック
        statusMessage.textContent = `${userLabel}の${status}を記録中...`;
        statusMessage.style.color = '#fff';
        btnIn.disabled = true;
        btnOut.disabled = true;

        // 送信データ作成
        // Googleフォームは x-www-form-urlencoded 形式で送る必要がある
        const formData = new URLSearchParams();
        formData.append(ENTRY_ID_NAME, userLabel); // 名前
        formData.append(ENTRY_ID_STATUS, status);  // ステータス

        try {
            // mode: 'no-cors' が重要。
            // これがないとGoogleフォームへの送信はクロスドメイン制約でエラーになる（またはブロックされる）
            // ただし、'no-cors'だと成功したかどうかの正確なレスポンス（ステータスコード200など）は読めない
            await fetch(FORM_URL + '/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // no-corsなのでエラーが出なければ成功とみなす
            statusMessage.textContent = `✅ ${userLabel}の${status}を記録しました！`;
            setTimeout(() => {
                statusMessage.textContent = '';
                btnIn.disabled = false;
                btnOut.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = '❌ エラーが発生しました。再試行してください。';
            btnIn.disabled = false;
            btnOut.disabled = false;
        }
    }
});
