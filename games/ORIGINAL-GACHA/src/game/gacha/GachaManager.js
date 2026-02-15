import { drawTen } from "./GachaLogic.js";

class Manager
{
    rarityMap = {
        // レアリティ: { 使用可否, 画像URL, }
        UR:  { enabled: false, images: [], },
        SSR: { enabled: false, images: [], },
        SR:  { enabled: false, images: [], },
        R:   { enabled: false, images: [], },
        N:   { enabled: false, images: [], },
    }

    // ガチャ結果
    lastResults = [];

    /**
     * 画像の格納
     * @param rarity レアリティ名
     * @param file 画像ファイル
     * @return { Array<{ok: boolean, url | message: string}> }
     */
    setImage(rarity, file) {
        // 画像判定
        if (!file.type.startsWith("image/")) {
            return { ok: false, message: "画像ファイルを選択してください" };
        }

        const url = URL.createObjectURL(file);
        this.rarityMap[rarity].images.push(url);

        return { ok: true, url };
    }

    /**
     * レアリティ・画像チェック
     * @return {boolean}
     */
    canGacha() {
        return Object.values(this.rarityMap).some(r => r.enabled && r.images.length > 0);
    }

    /**
     * 10連ガチャ
     */
    gacha() {
        this.lastResults = drawTen(this.rarityMap);
    }

    /**
     * 初期化
     */
    reset() {
        Object.keys(this.rarityMap).forEach(r => {
            this.rarityMap[r] = { enabled: false, images: [] };
        });
    
        this.lastResults = [];
    }
}

export const GachaManager = new Manager();
