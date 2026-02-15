// ゲームの基本設定
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;
export const GAME_BG_COLOR = '#3366b2';

// プレイヤー設定
export const PLAYER = {
    START_X: 900,
    THROW_COOLDOWN: 300,
    MOVE_SOUND_KEY: 'move'
};

// 雪玉設定
export const SNOWBALL = {
    SPEED_PLAYER: -600,
    ACCELERATION_PLAYER: -1400,
    SPEED_ENEMY: 25
};

// スノーマン設定
export const SNOWMAN = {
    SPEED: 25,
    MIN_SPAWN_DELAY: 3000,
    MAX_SPAWN_DELAY: 6000,
    KNOCKBACK_MIN: 100,
    KNOCKBACK_MAX: 200,
    GOAL_X: 880
};

// スコア
export const SCORE = {
    INCREMENT_INTERVAL: 1000
};

// ==============================
// 教育用 追加定義
// ==============================

// 敵タイプ
export const ENEMY_TYPES = [
    'SQLバグ',
    'ウイルス',
    '無限ループ',
    'Nullバグ',
    'パスワードクラッカー',
    'スクリプト'
];

// 弾タイプ
export const BALL_TYPES = [
    'プレースホルダー',
    'ファイアウォール',
    'タイムアウト',
    '例外処理',
    'アカウントロック',
    'CSP'
];

// クリティカル対応表
// enemyType : ballType
export const CRITICAL_MAP = {
    'SQLバグ': {
        ball: 'プレースホルダー',
        color: 0x3498db
    },
    'ウイルス': {
        ball: 'ファイアウォール',
        color: 0x2ecc71
    },
    '無限ループ': {
        ball: 'タイムアウト',
        color: 0xe74c3c
    },
    'Nullバグ': {
        ball: '例外処理',
        color: 0x9b59b6
    },
    'パスワードクラッカー': {
        ball: 'アカウントロック',
        color: 0xf1c40f
    },
    'スクリプト': {
        ball: 'CSP',
        color: 0xe67e22
    }
};