import { memo } from "react";
// Static, trusted artwork copied from the supplied pass 4 references.
const TrailDrawingMarkup =
  '<svg aria-hidden="true" viewBox="0 0 420 330"   style="display: block; width: 100%; height: auto;">\n<g style="transform-origin: 350px 86px; animation: d4-spin 30s linear infinite; "><path d="M396 86H408M382.5 118.5L391 127M350 132V144M317.5 118.5L309 127M304 86H292M317.5 53.5L309 45M350 40V28M382.5 53.5L391 45" fill="none" stroke="#1d1b16" stroke-width="4" stroke-linecap="round"></path></g>\n<circle cx="350" cy="86" r="38" fill="#ffd93d" stroke="#1d1b16" stroke-width="3.5"></circle>\n<path d="M334 80q4 -5 8 0M358 80q4 -5 8 0" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path>\n<circle cx="331" cy="93" r="4.5" fill="#ff9e8a"></circle><circle cx="369" cy="93" r="4.5" fill="#ff9e8a"></circle>\n<path d="M341 94q9 9 18 0" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path>\n<g style="animation: d4-drift 7s ease-in-out infinite; "><path d="M44 78a14 14 0 0 1 6-24a18 18 0 0 1 32-5a13 13 0 0 1 19 15a10 10 0 0 1-3 14Z" fill="#fff" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path></g>\n<g style="animation: d4-drift 9s ease-in-out infinite reverse; "><path d="M176 50a10 10 0 0 1 4-17a13 13 0 0 1 23-4a9 9 0 0 1 14 11a7 7 0 0 1-2 10Z" fill="#fff" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path></g>\n<path d="M-10 236C60 180 140 196 220 160C290 128 330 120 430 116V340H-10Z" fill="#c6ebd0" stroke="#1d1b16" stroke-width="3.5" stroke-linejoin="round"></path>\n<path d="M-10 298C80 262 160 302 250 274C320 252 380 256 430 248V340H-10Z" fill="#e8f7ec" stroke="#1d1b16" stroke-width="3.5" stroke-linejoin="round"></path>\n<path d="M60 206l4-8 3 8M150 186l4-8 3 8M370 136l4-8 3 8M330 284l4-8 3 8M200 300l4-8 3 8" fill="none" stroke="#157a3f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>\n<path d="M24 322C60 312 80 300 104 292C140 280 160 262 186 246C214 228 236 214 252 192C266 172 280 152 296 138" fill="none" stroke="#1d1b16" stroke-width="22" stroke-linecap="round"></path>\n<path d="M24 322C60 312 80 300 104 292C140 280 160 262 186 246C214 228 236 214 252 192C266 172 280 152 296 138" fill="none" stroke="#fff6d6" stroke-width="16" stroke-linecap="round"></path>\n<path d="M24 322C60 312 80 300 104 292C140 280 160 262 186 246C214 228 236 214 252 192C266 172 280 152 296 138" fill="none" stroke="#c9bd9c" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 9"></path>\n<path d="M22 322V290" fill="none" stroke="#1d1b16" stroke-width="3.5" stroke-linecap="round"></path><path d="M22 290l20 7-20 7Z" fill="#d9381e" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<circle cx="132" cy="238" r="34" fill="#fff3b8" class="d4-ring d4-ring-0" style=" transition: opacity .35s ease;"></circle>\n<path d="M132 298V252" fill="none" stroke="#1d1b16" stroke-width="4" stroke-linecap="round"></path>\n<rect x="104" y="220" width="56" height="34" rx="7" fill="#d6f5e0" stroke="#1d1b16" stroke-width="3"></rect>\n<path d="M122 229h6a4 4 0 1 1 8 0h6v6a4 4 0 1 1 0 8v5h-20Z" fill="#fff" stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round"></path>\n<circle cx="214" cy="190" r="36" fill="#fff3b8" class="d4-ring d4-ring-1" style=" transition: opacity .35s ease;"></circle>\n<path d="M214 240V170" fill="none" stroke="#1d1b16" stroke-width="4" stroke-linecap="round"></path>\n<path d="M194 168h38l9 9-9 9h-38Z" fill="#fff0c2" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<path d="M236 194h-38l-9 9 9 9h38Z" fill="#fde0dc" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<path d="M203 177h20M226 203h-20" fill="none" stroke="#1d1b16" stroke-width="2.5" stroke-linecap="round"></path>\n<circle cx="298" cy="112" r="40" fill="#fff3b8" class="d4-ring d4-ring-2" style=" transition: opacity .35s ease;"></circle>\n<rect x="281" y="86" width="34" height="50" rx="4" fill="#fff3b8" stroke="#1d1b16" stroke-width="3.5"></rect>\n<path d="M287 132L298 96M298 132L306 100" fill="none" stroke="#ffd93d" stroke-width="4" stroke-linecap="round"></path>\n<path d="M315 86L331 92V142L315 136Z" fill="#d9381e" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<circle cx="320" cy="114" r="2.5" fill="#1d1b16"></circle>\n<g transform="translate(36 150)"><path d="M0 -12C1.5 -4 4 -1.5 12 0C4 1.5 1.5 4 0 12C-1.5 4 -4 1.5 -12 0C-4 -1.5 -1.5 -4 0 -12Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round" style="transform-box: fill-box; transform-origin: center; animation: d4-twinkle 2.8s ease-in-out infinite; "></path></g>\n<g transform="translate(250 104) scale(0.8)"><path d="M0 -12C1.5 -4 4 -1.5 12 0C4 1.5 1.5 4 0 12C-1.5 4 -4 1.5 -12 0C-4 -1.5 -1.5 -4 0 -12Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round" style="transform-box: fill-box; transform-origin: center; animation: d4-twinkle 2.8s ease-in-out infinite; animation-delay: .8s; "></path></g>\n<g transform="translate(400 196)"><path d="M0 -12C1.5 -4 4 -1.5 12 0C4 1.5 1.5 4 0 12C-1.5 4 -4 1.5 -12 0C-4 -1.5 -1.5 -4 0 -12Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round" style="transform-box: fill-box; transform-origin: center; animation: d4-twinkle 2.8s ease-in-out infinite; animation-delay: 1.6s; "></path></g>\n<g class="d4-trail-marker" style=" transition: transform .9s cubic-bezier(.45,1.35,.5,1);">\n<ellipse cx="0" cy="0" rx="17" ry="4.5" fill="#1d1b16" opacity="0.18"></ellipse>\n<g style="animation: d4-hero-bob 1.1s ease-in-out infinite; ">\n<path d="M-7 -11V-1M7 -11V-1" fill="none" stroke="#1d1b16" stroke-width="4" stroke-linecap="round"></path>\n<rect x="-13" y="-25" width="26" height="16" rx="6" fill="#d6f5e0" stroke="#1d1b16" stroke-width="3"></rect>\n<g style="transform-origin: 12px -20px; animation: d4-hero-wave 1.2s ease-in-out infinite; "><path d="M12 -20Q22 -24 24 -36" fill="none" stroke="#1d1b16" stroke-width="3.5" stroke-linecap="round"></path></g>\n<path d="M-12 -19Q-19 -14 -20 -7" fill="none" stroke="#1d1b16" stroke-width="3.5" stroke-linecap="round"></path>\n<rect x="-19" y="-57" width="38" height="32" rx="11" fill="#ffd93d" stroke="#1d1b16" stroke-width="3"></rect>\n<rect x="-13" y="-51" width="26" height="19" rx="6" fill="#1d1b16"></rect>\n<circle cx="-6" cy="-43" r="3" fill="#45c97a"></circle><circle cx="6" cy="-43" r="3" fill="#45c97a"></circle>\n<path d="M-5 -37q5 4 10 0" fill="none" stroke="#45c97a" stroke-width="2" stroke-linecap="round"></path>\n<path d="M0 -57V-65" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path>\n<circle cx="0" cy="-68" r="4.5" fill="#d9381e" stroke="#1d1b16" stroke-width="2.5"></circle>\n</g>\n</g>\n</svg>';
export const TrailDrawing = memo(function TrailDrawing() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: TrailDrawingMarkup }} />;
});
const WavingAbbiMarkup =
  '<svg aria-hidden="true" width="132" height="140" viewBox="0 0 140 150"   style="flex: none;">\n<ellipse cx="70" cy="142" rx="38" ry="6" fill="#1d1b16" opacity="0.15"></ellipse>\n<g style="animation: d4-bob 2.4s ease-in-out infinite; ">\n<path d="M56 116V138M84 116V138" fill="none" stroke="#1d1b16" stroke-width="7" stroke-linecap="round"></path>\n<rect x="40" y="86" width="60" height="38" rx="14" fill="#d6f5e0" stroke="#1d1b16" stroke-width="4"></rect>\n<circle cx="70" cy="105" r="7" fill="#ffd93d" stroke="#1d1b16" stroke-width="3"></circle>\n<path d="M42 100Q26 108 24 124" fill="none" stroke="#1d1b16" stroke-width="6" stroke-linecap="round"></path>\n<g style="transform-origin: 98px 98px; animation: d4-wave 1.1s ease-in-out infinite; "><path d="M98 98Q118 88 122 64" fill="none" stroke="#1d1b16" stroke-width="6" stroke-linecap="round"></path><circle cx="122" cy="60" r="8" fill="#ffd93d" stroke="#1d1b16" stroke-width="3.5"></circle></g>\n<rect x="24" y="22" width="92" height="70" rx="24" fill="#ffd93d" stroke="#1d1b16" stroke-width="4"></rect>\n<rect x="38" y="34" width="64" height="44" rx="14" fill="#1d1b16"></rect>\n<g style="transform-box: fill-box; transform-origin: center; animation: d4-blink 4s ease-in-out infinite; "><rect x="50" y="46" width="10" height="13" rx="5" fill="#45c97a"></rect><rect x="80" y="46" width="10" height="13" rx="5" fill="#45c97a"></rect></g>\n<path d="M60 66q10 8 20 0" fill="none" stroke="#45c97a" stroke-width="3.5" stroke-linecap="round"></path>\n<circle cx="32" cy="70" r="5" fill="#ff9e8a"></circle><circle cx="108" cy="70" r="5" fill="#ff9e8a"></circle>\n<path d="M70 22V8" fill="none" stroke="#1d1b16" stroke-width="4" stroke-linecap="round"></path>\n<circle cx="70" cy="7" r="6.5" fill="#d9381e" stroke="#1d1b16" stroke-width="3"></circle>\n</g>\n</svg>';
export const WavingAbbi = memo(function WavingAbbi() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: WavingAbbiMarkup }} />;
});
const PaperPlaneMarkup =
  '<svg aria-hidden="true" width="230" height="150" viewBox="0 0 230 150" aria-hidden="true" style="flex: none; overflow: visible;">\n<path d="M8 140C40 120 30 80 70 84C110 88 96 130 132 116C160 104 150 60 176 46" fill="none" stroke="#2f62d0" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 8"></path>\n<g style="transform-origin: 196px 36px; animation: fly 3.6s ease-in-out infinite; ">\n<path d="M170 46L226 14L204 62L192 48Z" fill="#fff" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<path d="M192 48L226 14L184 44Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<path d="M192 48L194 60L200 54" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>\n</g>\n</svg>';
export const PaperPlane = memo(function PaperPlane() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: PaperPlaneMarkup }} />;
});
const GraduationDrawingMarkup =
  '<svg aria-hidden="true" width="200" height="170" viewBox="0 0 200 170" aria-hidden="true" style="flex: none;">\n<ellipse cx="100" cy="158" rx="80" ry="8" fill="#1d1b16" opacity="0.15"></ellipse>\n<path d="M30 70L100 36L170 70L100 104Z" fill="#1d1b16" transform="translate(5 5)"></path>\n<path d="M30 70L100 36L170 70L100 104Z" fill="#2f62d0" stroke="#1d1b16" stroke-width="3.5" stroke-linejoin="round"></path>\n<path d="M56 84V120C56 134 144 134 144 120V84L100 104Z" fill="#fff" stroke="#1d1b16" stroke-width="3.5" stroke-linejoin="round"></path>\n<path d="M100 70L162 88V122" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path>\n<path d="M156 122h12l-2 18h-8Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path>\n<path d="M70 52l-6-14M130 52l6-14M100 30V14" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path>\n</svg>';
export const GraduationDrawing = memo(function GraduationDrawing() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: GraduationDrawingMarkup }} />
  );
});

const PostmarkMarkup =
  '<svg aria-hidden="true" width="74" height="40" viewBox="0 0 74 40"><path d="M2 8Q10 2 18 8T34 8T50 8T66 8M2 20Q10 14 18 20T34 20T50 20T66 20M2 32Q10 26 18 32T34 32T50 32T66 32" fill="none" stroke="#c9bd9c" stroke-width="2.5" stroke-linecap="round"></path></svg>';
export const Postmark = memo(function Postmark() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: PostmarkMarkup }} />;
});

const PostageLogoMarkup =
  '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 40 40"><path d="M21.5 6.5L38 36.5H5Z" fill="#1d1b16"></path><path d="M19.5 4L36 34H3Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path><path d="M19.5 4V22M12.5 34L19.5 22L26.5 34" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path></svg>';
export const PostageLogo = memo(function PostageLogo() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: PostageLogoMarkup }} />;
});

const PhotoPinMarkup =
  '<svg aria-hidden="true" width="30" height="34" viewBox="0 0 30 34" aria-hidden="true"><path d="M15 20V33" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path><ellipse cx="15" cy="20" rx="11" ry="4" fill="#b8241a" stroke="#1d1b16" stroke-width="2.5"></ellipse><path d="M8 19L10 6H20L22 19Z" fill="#d9381e" stroke="#1d1b16" stroke-width="2.5" stroke-linejoin="round"></path><ellipse cx="15" cy="6" rx="8" ry="3.5" fill="#ff7a66" stroke="#1d1b16" stroke-width="2.5"></ellipse></svg>';
export const PhotoPin = memo(function PhotoPin() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: PhotoPinMarkup }} />;
});

const FounderCrownMarkup =
  '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 30L4 12L13 19L20 7L27 19L36 12L34 30Z" fill="#ffd93d" stroke="#1d1b16" stroke-width="3" stroke-linejoin="round"></path><path d="M6 34H34" stroke="#1d1b16" stroke-width="3.5" stroke-linecap="round"></path><circle cx="20" cy="22" r="2.5" fill="#d9381e"></circle></svg>';
export const FounderCrown = memo(function FounderCrown() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: FounderCrownMarkup }} />;
});

const AssessmentNoteIconMarkup =
  '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1d1b16" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" fill="#fff"></rect><path d="M9 3h6v3H9z" fill="#ffd93d"></path><path d="M8.5 11l2 2 4-4M8.5 16h7"></path></svg>';
export const AssessmentNoteIcon = memo(function AssessmentNoteIcon() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: AssessmentNoteIconMarkup }} />
  );
});

const TaskNoteIconMarkup =
  '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1d1b16" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="16" height="16" rx="3" fill="#fff"></rect><path d="M7 12l3.5 3.5L21 5" stroke="#157a3f" stroke-width="3"></path></svg>';
export const TaskNoteIcon = memo(function TaskNoteIcon() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: TaskNoteIconMarkup }} />;
});

const WeekNoteIconMarkup =
  '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1d1b16" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="#fff"></rect><path d="M3 10h18M8 3v4M16 3v4" ></path><path d="M3 10h18v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="#d9381e"></path></svg>';
export const WeekNoteIcon = memo(function WeekNoteIcon() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: WeekNoteIconMarkup }} />;
});

const ContactCircleMarkup =
  '<svg aria-hidden="true" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true"><path class="ns" d="M30 20C90 2 230 2 280 26C306 40 300 78 260 90C200 106 90 106 40 92C8 82 2 50 20 32C30 22 48 14 70 10" fill="none" stroke="#d9381e" stroke-width="4" stroke-linecap="round"></path></svg>';
export const ContactCircle = memo(function ContactCircle() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: ContactCircleMarkup }} />;
});

const ContactDividerMarkup =
  '<svg aria-hidden="true" viewBox="0 0 1200 14" preserveAspectRatio="none" aria-hidden="true"><path class="ns" d="M2 8C120 2 240 12 360 7S600 2 720 8S960 13 1080 6S1180 4 1198 8" fill="none" stroke="#1d1b16" stroke-width="3" stroke-linecap="round"></path></svg>';
export const ContactDivider = memo(function ContactDivider() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: ContactDividerMarkup }} />;
});

const OddPracticeIconMarkup =
  '<svg width="40" height="40" viewBox="0 0 44 44" aria-hidden="true"><circle cx="12" cy="13" r="6.5" fill="#fff" stroke="#1d1b16" stroke-width="2.5"></circle><circle cx="32" cy="13" r="6.5" fill="#fff" stroke="#1d1b16" stroke-width="2.5"></circle><circle cx="12" cy="32" r="6.5" fill="#fff" stroke="#1d1b16" stroke-width="2.5"></circle><rect x="25.5" y="25.5" width="13" height="13" rx="2" fill="#ffd93d" stroke="#1d1b16" stroke-width="2.5"></rect></svg>';
export const OddPracticeIcon = memo(function OddPracticeIcon() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: OddPracticeIconMarkup }} />
  );
});

const SeriesPracticeIconMarkup =
  '<svg width="40" height="40" viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="15" width="12" height="14" rx="2" fill="#fff" stroke="#1d1b16" stroke-width="2.2"></rect><rect x="16" y="15" width="12" height="14" rx="2" fill="#fff" stroke="#1d1b16" stroke-width="2.2"></rect><rect x="30" y="15" width="12" height="14" rx="2" fill="#ffd93d" stroke="#1d1b16" stroke-width="2.2"></rect><circle cx="8" cy="19" r="2" fill="#1d1b16"></circle><circle cx="22" cy="22" r="2" fill="#1d1b16"></circle><path d="M34 22h4" stroke="#1d1b16" stroke-width="2.2" stroke-linecap="round"></path></svg>';
export const SeriesPracticeIcon = memo(function SeriesPracticeIcon() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: SeriesPracticeIconMarkup }} />
  );
});

const GridPracticeIconMarkup =
  '<svg width="40" height="40" viewBox="0 0 44 44" aria-hidden="true"><rect x="4" y="4" width="36" height="36" rx="3" fill="#fff" stroke="#1d1b16" stroke-width="2.5"></rect><path d="M16 4V40M28 4V40M4 16H40M4 28H40" stroke="#1d1b16" stroke-width="2"></path><rect x="28" y="28" width="12" height="12" fill="#ffd93d" stroke="#1d1b16" stroke-width="2"></rect><circle cx="10" cy="10" r="2.5" fill="#1d1b16"></circle><circle cx="22" cy="22" r="2.5" fill="#1d1b16"></circle></svg>';
export const GridPracticeIcon = memo(function GridPracticeIcon() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: GridPracticeIconMarkup }} />
  );
});

const TurnPracticeIconMarkup =
  '<svg width="40" height="40" viewBox="0 0 44 44" aria-hidden="true"><path d="M8 8V30H18" fill="none" stroke="#1d1b16" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26 10A12 12 0 0 1 36 30" fill="none" stroke="#d9381e" stroke-width="2.8" stroke-linecap="round"></path><path d="M30.5 28.5L36 30L37 24.5" fill="none" stroke="#d9381e" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
export const TurnPracticeIcon = memo(function TurnPracticeIcon() {
  return (
    <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: TurnPracticeIconMarkup }} />
  );
});

export const SendPlane = memo(function SendPlane() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4z" />
    </svg>
  );
});

export const HeroAnnotation = memo(function HeroAnnotation() {
  return (
    <svg
      width="58"
      height="44"
      viewBox="0 0 58 44"
      fill="none"
      stroke="var(--pen-blue)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8C26 2 46 10 44 34" />
      <path d="M40.6 26.8L44 34L48.6 27.4" />
    </svg>
  );
});

const AbbiAvatarMarkup = WavingAbbiMarkup.replace(
  'width="132" height="140"',
  'width="40" height="40"',
)
  .replace('viewBox="0 0 140 150"', 'viewBox="20 -2 100 100"')
  .replace(/ style="[^"]*"/g, "");
export const AbbiAvatar = memo(function AbbiAvatar() {
  return <span className="d4-drawing" dangerouslySetInnerHTML={{ __html: AbbiAvatarMarkup }} />;
});
