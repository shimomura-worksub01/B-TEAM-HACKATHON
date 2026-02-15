import { RARITY_ORDER } from "../../src/game/gacha/GachaTable.js";
import { GachaManager } from "../../src/game/gacha/GachaManager.js";
import { GameApp } from "../../src/game/Game.js";

const container = document.getElementById("rarity-container");

/**
 * レアリティブロック(HTML)の作成
 */
RARITY_ORDER.forEach(r => {

    const block = document.createElement("div");
    block.className = "rarity-item";

    block.innerHTML = `
        <div class="rarity-header">
            <span>${r}</span>
            <label class="toggle">
                <input type="checkbox" id="enable-${r}">
                <span class="slider"></span>
            </label>
        </div>

        <label class="file-label" for="file-${r}">画像を選択</label>
        <input type="file" id="file-${r}" accept="image/*" multiple>

        <div class="preview-grid" id="preview-${r}"></div>
    `;

    container.appendChild(block);

    const checkbox = document.getElementById(`enable-${r}`);
    const fileInput = document.getElementById(`file-${r}`);
    const preview = document.getElementById(`preview-${r}`);

    // レアリティの使用ステータスを更新
    checkbox.onchange = e => {
        GachaManager.rarityMap[r].enabled = e.target.checked;
    };

    // 挿入画像の更新
    fileInput.onchange = e => {
        const files = Array.from(e.target.files);

        files.forEach(file => {

            // 画像格納
            const result = GachaManager.setImage(r, file);
            if (!result.ok) {
                // ファイル形式チェック
                showToast(result.message, "error");
                return;
            }

            // プレビュー
            addPreview(r, result.url, preview);
        });

        fileInput.value = "";
    };
});

/**
 * 画像プレビューの作成
 * @param rarity レアリティ名
 * @param url 画像URL
 * @param previewContainer プレビュー表示エリア
 */
function addPreview(rarity, url, previewContainer) {
    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";

    const img = document.createElement("img");
    img.src = url;

    const del = document.createElement("button");
    del.textContent = "×";

    del.onclick = () => {
        // 配列から削除
        const list = GachaManager.rarityMap[rarity].images;
        const index = list.indexOf(url);
        if (index > -1) list.splice(index, 1);

        // DOM削除
        wrapper.remove();

        URL.revokeObjectURL(url);
    }

    wrapper.appendChild(img);
    wrapper.appendChild(del);
    previewContainer.appendChild(wrapper);
}

/**
 * 表示スクリーンの切り替え
 * @param screenId セクションID
 */
window.showScreen = (screenId) => {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
};

document.getElementById("main-btn").onclick = () => {
    window.location.href = '../../index.html';
}

document.getElementById("start-btn").onclick = () => {
    window.showScreen("setting");
}

document.getElementById("buck-btn").onclick = () => {
    window.showScreen("menu");
}

document.getElementById("next-btn").onclick = () => {
    // 画像登録済みチェック
    if (!GachaManager.canGacha()) {
        showToast("レアリティに画像を設定してください。", "error");
        return;
    }

    window.showScreen("game-container");
    new GameApp();
}

/**
 * メニュー画面へ遷移
 * @param gameInstance Phaserのインスタンス
 */
window.backToMenu = (gameInstance) => {
    if (gameInstance) {
        // インスタンス削除
        gameInstance.destroy(true);
    }

    // データ初期化
    GachaManager.reset();

    // 設定初期化
    resetSetting();

    window.showScreen("menu");
};

/**
 * 設定の初期化
 */
function resetSetting() {
    RARITY_ORDER.forEach(r => {
        // トグルOFF
        const checkbox = document.getElementById(`enable-${r}`);
        if (checkbox) checkbox.checked = false;

        // ファイルinputリセット
        const fileInput = document.getElementById(`file-${r}`);
        if (fileInput) fileInput.value = "";

        // プレビュー削除
        const preview = document.getElementById(`preview-${r}`);
        if (preview) preview.innerHTML = "";
    });
}

/**
 * トーストメッセージ
 * @param message 表示内容
 * @param type success | error
 */
function showToast(message, type = "error") {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.className = "";
    toast.classList.add("show", type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
