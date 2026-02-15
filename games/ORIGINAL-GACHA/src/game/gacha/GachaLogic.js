import { RARITY_ORDER, RARITY_RATE, GACHA_COUNT } from "./GachaTable.js";

/**
 * 10連ガチャ
 * @param { Object.<string, {enabled: boolean, images: string[]}> } rarityMap
 * @return {Array<{rarity: string, image: string}>} 結果の配列（10件）
 */
export function drawTen(rarityMap)
{
    // 有効かつ画像が1枚以上あるレアリティを高い順に抽出
    const enabled = RARITY_ORDER.filter(
        r => rarityMap[r].enabled && rarityMap[r].images.length > 0
    );

    // 有効な中で最も高いレアリティ（先頭）
    const highest = enabled[0];

    const results = [];

    // ガチャ実施
    for (let count = 0; count < GACHA_COUNT; count++) {
        const rarity = drawRarity(enabled);
        results.push({
            rarity,
            image: randomImage(rarityMap[rarity].images),
        });
    }

    // 1度も最高レアリティ(highest)が出ていなければ、ランダムで1枠を最高レアリティに差し替え（最低保証）
    if (!results.some(r => r.rarity === highest)) {
        const index = Math.floor(Math.random() * GACHA_COUNT);
        results[index] = {
            rarity: highest,
            image: randomImage(rarityMap[highest].images),
        }
    }
    return results;
}

/**
 * レアリティを確率に従って1回抽選
 * @param list レアリティ名の配列（レア度の高い順）
 * @return {string} 選ばれたレアリティ名
 */
function drawRarity(list)
{
    // 全レアリティの確率の合計を計算
    const total = list.reduce((s, r) => s + RARITY_RATE[r], 0);
    let rand = Math.random() * total;

     // 0～totalの乱数から各確率を引いていき、0以下になったレアリティを返す
    for (const r of list) {
        rand -= RARITY_RATE[r];
        if (rand <= 0) return r;
    }

    // 端数で最後まで回った場合はリストの最後の要素を返す
    return list[list.length - 1];
}

/**
 * 画像配列からランダムに1枚取得
 * @param images 画像URLの配列
 * @return {string} 選ばれた画像
 */
function randomImage(images)
{
    return images[Math.floor(Math.random() * images.length)];
}
