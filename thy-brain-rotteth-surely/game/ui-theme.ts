import { game } from './engine.js';

const surface = {
    corner: 'cut', radius: 8, fill: '#181426', border: 1, borderColor: '#504260',
    textColor: '#f1eaf8', font: 'bold 16px sans-serif',
} as const;

function action(fill: string, rim: string, hoverFill: string, accent: string) {
    return {
        ...surface, fill, borderColor: rim,
        hover: { fill: hoverFill, borderColor: accent, textColor: '#ffffff' },
        pressed: { fill: '#100e1a', borderColor: accent, offsetY: 2 },
        disabled: { fill: '#15131c', borderColor: '#393341', textColor: '#827a90', alpha: 0.72 },
    };
}

export function installUiTheme(): void {
    const secondary = action('#241a34', '#69547f', '#38274c', '#baa0d3');
    game.ui.defineTheme({
        name: 'neural',
        font: '16px sans-serif',
        styles: {
            default: secondary,
            icon: secondary,
            good: action('#15313c', '#5aadb8', '#1d4552', '#86f6ef'),
            blue: action('#252037', '#715c91', '#3a2c52', '#c897e8'),
            bad: action('#2e1927', '#8e4e64', '#452437', '#eb889d'),
            panel: { ...surface, fill: '#181426f5' },
            dark: { ...surface, fill: '#181426f5' },
            title: { ...surface, fill: '#2b1d3d', textColor: '#ebd4ff', font: 'bold 22px sans-serif' },
            heading: { textColor: '#eee4ff', font: 'bold 36px sans-serif' },
            label: { textColor: '#eee4ff', font: '16px sans-serif' },
            field: { ...surface, fill: '#211a30', textColor: '#f1eaf8' },
            focus: { border: 2, borderColor: '#86f6ef', radius: 8, corner: 'cut' },
        },
    });
    game.ui.theme = 'neural';
}
