import {zColor} from '@remotion/zod-types';
import {gridlines} from '@remotion/effects/gridlines';
import React from 'react';
import {
	AbsoluteFill,
	Interactive,
	Solid,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const notebookPaperSchema = z.object({
	palette: z.enum(['custom', 'indigo', 'emerald', 'rose', 'amber']),
	baseColor: zColor(),
	blob1: zColor(), // cahaya utama
	blob2: zColor(), // cahaya pendamping (pojok bawah)
	blob3: zColor(), // tint gradient dasar
	blob4: zColor(), // highlight tipis di atas
	gridColor: zColor(),
	gridSize: z.number().min(20).max(120).step(2),
	glowOpacity: z.number().min(0).max(1).step(0.05),
	animate: z.boolean(),
});

export type NotebookPaperProps = z.infer<typeof notebookPaperSchema>;

export const notebookPaperDefaults: NotebookPaperProps = {
	palette: 'custom',
	baseColor: '#080b1a',
	blob1: '#4f46e5',
	blob2: '#7c3aed',
	blob3: '#1d4ed8',
	blob4: '#a5b4fc',
	gridColor: 'rgba(255, 255, 255, 0.06)',
	gridSize: 54,
	glowOpacity: 0.4,
	animate: true,
};

// Semua preset analogous (satu keluarga warna)
const PRESETS = {
	indigo: {
		base: '#080b1a',
		blobs: ['#4f46e5', '#7c3aed', '#1d4ed8', '#a5b4fc'],
		grid: 'rgba(199, 210, 254, 0.06)',
	},
	emerald: {
		base: '#04120e',
		blobs: ['#059669', '#0d9488', '#047857', '#99f6e4'],
		grid: 'rgba(167, 243, 208, 0.06)',
	},
	rose: {
		base: '#14060c',
		blobs: ['#e11d48', '#c026d3', '#9f1239', '#fda4af'],
		grid: 'rgba(254, 205, 211, 0.06)',
	},
	amber: {
		base: '#130b04',
		blobs: ['#ea580c', '#d97706', '#9a3412', '#fed7aa'],
		grid: 'rgba(254, 215, 170, 0.06)',
	},
} as const;

const GRAIN =
	"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const NotebookPaperInner: React.FC<Partial<NotebookPaperProps>> = (
	incoming,
) => {
	const props: NotebookPaperProps = {...notebookPaperDefaults, ...incoming};
	const {height, width, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const preset = props.palette === 'custom' ? null : PRESETS[props.palette];
	const base = preset ? preset.base : props.baseColor;
	const [c1, c2, c3, c4] = preset
		? preset.blobs
		: [props.blob1, props.blob2, props.blob3, props.blob4];
	const gridColor = preset ? preset.grid : props.gridColor;

	// Satu gerakan sangat pelan, loop mulus
	const t = props.animate ? (frame / durationInFrames) * Math.PI * 2 : 0;
	const sway = Math.sin(t) * 6;
	const breathe = 1 + Math.cos(t) * 0.04;

	const main = Math.min(1, props.glowOpacity * 2.2);

	return (
		<AbsoluteFill style={{backgroundColor: base}}>
			{/* 1. Gradient dasar: menyatukan seluruh background */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(165deg, ${c3} 0%, transparent 65%)`,
					opacity: 0.35,
				}}
			/>

			{/* 2. Cahaya utama: satu sumber besar dari atas */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'screen',
					opacity: main,
					background: `radial-gradient(${95 * breathe}% ${65 * breathe}% at ${50 + sway}% -8%, ${c1} 0%, transparent 70%)`,
				}}
			/>

			{/* 3. Cahaya pendamping: tipis, pojok kanan bawah, warna tetangga */}
			<AbsoluteFill
				style={{
					mixBlendMode: 'screen',
					opacity: main * 0.55,
					background: `radial-gradient(75% 55% at ${100 - sway}% 108%, ${c2} 0%, transparent 70%)`,
				}}
			/>

			{/* 4. Grid halus, paling jelas di atas lalu memudar ke bawah */}
			<AbsoluteFill
				style={{
					WebkitMaskImage:
						'radial-gradient(ellipse at 50% 0%, black 10%, transparent 75%)',
					maskImage:
						'radial-gradient(ellipse at 50% 0%, black 10%, transparent 75%)',
				}}
			>
				<Solid
					color={'rgba(0,0,0,0)'}
					width={width}
					height={height}
					effects={[
						gridlines({
							gridSize: props.gridSize,
							lineWidth: 1.5,
							lineColor: gridColor,
						}),
						gridlines({
							gridSize: props.gridSize * 5,
							lineWidth: 2.5,
							lineColor: gridColor,
						}),
					]}
				/>
			</AbsoluteFill>

			{/* 5. Highlight tipis di tepi atas */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${c4} 0%, transparent 14%)`,
					opacity: 0.1,
				}}
			/>

			{/* 6. Vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
				}}
			/>

			{/* 7. Grain */}
			<AbsoluteFill
				style={{
					backgroundImage: GRAIN,
					opacity: 0.08,
					mixBlendMode: 'overlay',
				}}
			/>
		</AbsoluteFill>
	);
};

export const NotebookPaper = Interactive.create({
	Component: NotebookPaperInner,
	layout: 'absolute-fill',
});