// File ini dibuat otomatis oleh scripts/gen-template-registry.mjs
import type { ComponentType } from "react";
import type { TemplateProps } from "../lib/template-kit";
import AnimatedList from "./animated-list";
import AnimatedText from "./animated-text";
import AreaChart from "./area-chart";
import BlindsTransition from "./blinds-transition";
import BokehCircles from "./bokeh-circles";
import BounceText from "./bounce-text";
import BubblePopText from "./bubble-pop-text";
import CameraShake from "./camera-shake";
import CardFlip from "./card-flip";
import ChapterTitle from "./chapter-title";
import ChartAnimation from "./chart-animation";
import CinematicTitleIntro from "./cinematic-title-intro";
import CircularProgress from "./circular-progress";
import ClockWipe from "./clock-wipe";
import ComparisonChart from "./comparison-chart";
import CountdownIntro from "./countdown-intro";
import CountdownTimer from "./countdown-timer";
import CreditsRoll from "./credits-roll";
import CrossDissolve from "./cross-dissolve";
import DonutChart from "./donut-chart";
import EndCard from "./end-card";
import FadeThroughBlack from "./fade-through-black";
import FilmBurn from "./film-burn";
import FloatingBubbleText from "./floating-bubble-text";
import GalleryGrid from "./gallery-grid";
import GeometricPatterns from "./geometric-patterns";
import GlitchText from "./glitch-text";
import GradientShift from "./gradient-shift";
import GridPulse from "./grid-pulse";
import ImageCarousel from "./image-carousel";
import ImageComparisonSlider from "./image-comparison-slider";
import ImageZoomReveal from "./image-zoom-reveal";
import IrisTransition from "./iris-transition";
import KenBurns from "./ken-burns";
import LetterboxReveal from "./letterbox-reveal";
import LineChart from "./line-chart";
import LiquidWave from "./liquid-wave";
import LogoBlurReveal from "./logo-blur-reveal";
import LogoBounceDrop from "./logo-bounce-drop";
import LogoFadeReveal from "./logo-fade-reveal";
import LogoGlitchReveal from "./logo-glitch-reveal";
import LogoScaleRotate from "./logo-scale-rotate";
import LogoSpinReveal from "./logo-spin-reveal";
import LogoSplitReveal from "./logo-split-reveal";
import LogoStrokeDraw from "./logo-stroke-draw";
import LogoTypewriter from "./logo-typewriter";
import LowerThird from "./lower-third";
import MasonryGallery from "./masonry-gallery";
import MatrixRain from "./matrix-rain";
import MorphTransition from "./morph-transition";
import NoiseGrain from "./noise-grain";
import NotificationPop from "./notification-pop";
import ParallaxPan from "./parallax-pan";
import ParticleExplosion from "./particle-explosion";
import PhotoStack from "./photo-stack";
import PictureInPicture from "./picture-in-picture";
import PieChart from "./pie-chart";
import PixelTransition from "./pixel-transition";
import PolaroidFrame from "./polaroid-frame";
import PoppingText from "./popping-text";
import ProgressBars from "./progress-bars";
import ProgressSteps from "./progress-steps";
import PulsingText from "./pulsing-text";
import PushTransition from "./push-transition";
import QuoteCard from "./quote-card";
import RotatingCarousel from "./rotating-carousel";
import SlideText from "./slide-text";
import SlideWipe from "./slide-wipe";
import SoundWave from "./sound-wave";
import SplitScreen from "./split-screen";
import SpotlightReveal from "./spotlight-reveal";
import Starfield from "./starfield";
import StatCounter from "./stat-counter";
import SubscribeReminder from "./subscribe-reminder";
import TextHighlight from "./text-highlight";
import TitleSplit from "./title-split";
import TypewriterSubtitle from "./typewriter-subtitle";
import VignettePulse from "./vignette-pulse";
import WhipPan from "./whip-pan";
import ZoomPulse from "./zoom-pulse";
import ZoomThrough from "./zoom-through";
import type { TemplateName } from "./names";

export const templateRegistry: Record<TemplateName, ComponentType<TemplateProps>> = {
  "animated-list": AnimatedList,
  "animated-text": AnimatedText,
  "area-chart": AreaChart,
  "blinds-transition": BlindsTransition,
  "bokeh-circles": BokehCircles,
  "bounce-text": BounceText,
  "bubble-pop-text": BubblePopText,
  "camera-shake": CameraShake,
  "card-flip": CardFlip,
  "chapter-title": ChapterTitle,
  "chart-animation": ChartAnimation,
  "cinematic-title-intro": CinematicTitleIntro,
  "circular-progress": CircularProgress,
  "clock-wipe": ClockWipe,
  "comparison-chart": ComparisonChart,
  "countdown-intro": CountdownIntro,
  "countdown-timer": CountdownTimer,
  "credits-roll": CreditsRoll,
  "cross-dissolve": CrossDissolve,
  "donut-chart": DonutChart,
  "end-card": EndCard,
  "fade-through-black": FadeThroughBlack,
  "film-burn": FilmBurn,
  "floating-bubble-text": FloatingBubbleText,
  "gallery-grid": GalleryGrid,
  "geometric-patterns": GeometricPatterns,
  "glitch-text": GlitchText,
  "gradient-shift": GradientShift,
  "grid-pulse": GridPulse,
  "image-carousel": ImageCarousel,
  "image-comparison-slider": ImageComparisonSlider,
  "image-zoom-reveal": ImageZoomReveal,
  "iris-transition": IrisTransition,
  "ken-burns": KenBurns,
  "letterbox-reveal": LetterboxReveal,
  "line-chart": LineChart,
  "liquid-wave": LiquidWave,
  "logo-blur-reveal": LogoBlurReveal,
  "logo-bounce-drop": LogoBounceDrop,
  "logo-fade-reveal": LogoFadeReveal,
  "logo-glitch-reveal": LogoGlitchReveal,
  "logo-scale-rotate": LogoScaleRotate,
  "logo-spin-reveal": LogoSpinReveal,
  "logo-split-reveal": LogoSplitReveal,
  "logo-stroke-draw": LogoStrokeDraw,
  "logo-typewriter": LogoTypewriter,
  "lower-third": LowerThird,
  "masonry-gallery": MasonryGallery,
  "matrix-rain": MatrixRain,
  "morph-transition": MorphTransition,
  "noise-grain": NoiseGrain,
  "notification-pop": NotificationPop,
  "parallax-pan": ParallaxPan,
  "particle-explosion": ParticleExplosion,
  "photo-stack": PhotoStack,
  "picture-in-picture": PictureInPicture,
  "pie-chart": PieChart,
  "pixel-transition": PixelTransition,
  "polaroid-frame": PolaroidFrame,
  "popping-text": PoppingText,
  "progress-bars": ProgressBars,
  "progress-steps": ProgressSteps,
  "pulsing-text": PulsingText,
  "push-transition": PushTransition,
  "quote-card": QuoteCard,
  "rotating-carousel": RotatingCarousel,
  "slide-text": SlideText,
  "slide-wipe": SlideWipe,
  "sound-wave": SoundWave,
  "split-screen": SplitScreen,
  "spotlight-reveal": SpotlightReveal,
  "starfield": Starfield,
  "stat-counter": StatCounter,
  "subscribe-reminder": SubscribeReminder,
  "text-highlight": TextHighlight,
  "title-split": TitleSplit,
  "typewriter-subtitle": TypewriterSubtitle,
  "vignette-pulse": VignettePulse,
  "whip-pan": WhipPan,
  "zoom-pulse": ZoomPulse,
  "zoom-through": ZoomThrough,
};
