import { ResponsiveLayout } from "../layout/ResponsiveLayout.js";

export class BaseScene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    create() {
        this.layout = new ResponsiveLayout(this);

        this.build();      // 子クラスがUI生成
        this.relayout();   // 初期配置
        this.setMotion();

        this.scale.on("resize", () => {
            // スマホ時: 向きに応じて論理サイズを切り替え
            if (this.isMobileDisplay()) {
                this.updateMobileGameSize();
            }
            this.relayout();
        });
    }

    // 子クラスで上書きする
    build() {}

    // 子クラスで上書きする
    relayout() {}

    // 子クラスで上書きする
    setMotion() {}

    /** スマホ表示かどうか（幅768以下） */
    isMobileDisplay() {
        const parent = this.scale.parent;
        if (!parent || !parent.clientWidth) return false;
        return parent.clientWidth <= 768;
    }

    /** スマホ時、向きに応じて論理サイズを更新 */
    updateMobileGameSize() {
        const parent = this.scale.parent;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        const isLandscape = w > h;
        const wantW = isLandscape ? 1280 : 720;
        const wantH = isLandscape ? 720 : 1280;
        if (this.scale.width !== wantW || this.scale.height !== wantH) {
            this.scale.resize(wantW, wantH);
        }
    }
}