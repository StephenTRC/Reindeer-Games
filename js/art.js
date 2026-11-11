/* Reindeer Games — original SVG artwork (static markup, no user input). */
(function () {
  'use strict';

  /* Side-on running reindeer for the race. `color` tints the nose and scarf. */
  function reindeerSide(color) {
    return '' +
      '<svg class="deer" viewBox="0 0 130 104" aria-hidden="true">' +
      '<g class="deer-legs deer-legs--back" fill="#7a4a25">' +
      '<rect x="30" y="58" width="8" height="36" rx="4"/><rect x="74" y="58" width="8" height="36" rx="4"/></g>' +
      '<g class="deer-legs deer-legs--front" fill="#8f5a2f">' +
      '<rect x="40" y="58" width="8" height="36" rx="4"/><rect x="64" y="58" width="8" height="36" rx="4"/></g>' +
      '<ellipse cx="26" cy="47" rx="7" ry="5" fill="#f4e6cf"/>' +
      '<ellipse cx="56" cy="56" rx="32" ry="17" fill="#a9703f"/>' +
      '<ellipse cx="54" cy="64" rx="22" ry="8" fill="#c4915e"/>' +
      '<path d="M70 60 L82 26 L99 30 L90 62 Z" fill="#a9703f"/>' +
      '<path d="M76 46 L93 51 L91 59 L74 54 Z" fill="' + color + '"/>' +
      '<path d="M78 53 L72 72 L80 72 L84 55 Z" fill="' + color + '" opacity=".85"/>' +
      '<g fill="none" stroke="#f1dcb3" stroke-width="3.4" stroke-linecap="round">' +
      '<path d="M90 18 C88 9 84 5 77 3"/><path d="M88 11 L81 12"/>' +
      '<path d="M95 16 C97 8 101 5 107 3"/><path d="M97 9 L103 11"/></g>' +
      '<ellipse cx="85" cy="20" rx="7" ry="4" fill="#8f5a2f" transform="rotate(-28 85 20)"/>' +
      '<ellipse cx="97" cy="28" rx="14" ry="11" fill="#a9703f"/>' +
      '<ellipse cx="109" cy="33" rx="10" ry="7.5" fill="#c4915e"/>' +
      '<circle cx="118" cy="31" r="5.5" fill="' + color + '"/>' +
      '<circle cx="116.4" cy="29.4" r="1.6" fill="#fff" opacity=".8"/>' +
      '<circle cx="100" cy="25" r="2.6" fill="#2a170b"/><circle cx="100.9" cy="24.1" r=".9" fill="#fff"/>' +
      '</svg>';
  }

  /* Front-facing reindeer face for the home page. */
  function reindeerFace() {
    return '' +
      '<svg viewBox="0 0 240 250" aria-hidden="true">' +
      '<g fill="none" stroke="#f1dcb3" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M86 96 C70 70 62 46 66 16"/><path d="M73 58 C56 54 44 44 38 28"/><path d="M67 34 C78 30 86 22 90 10"/>' +
      '<path d="M154 96 C170 70 178 46 174 16"/><path d="M167 58 C184 54 196 44 202 28"/><path d="M173 34 C162 30 154 22 150 10"/></g>' +
      '<ellipse cx="52" cy="118" rx="30" ry="15" fill="#8f5a2f" transform="rotate(-24 52 118)"/>' +
      '<ellipse cx="54" cy="119" rx="18" ry="8" fill="#e9b6a0" transform="rotate(-24 54 119)"/>' +
      '<ellipse cx="188" cy="118" rx="30" ry="15" fill="#8f5a2f" transform="rotate(24 188 118)"/>' +
      '<ellipse cx="186" cy="119" rx="18" ry="8" fill="#e9b6a0" transform="rotate(24 186 119)"/>' +
      '<path d="M120 80 C168 80 190 112 186 152 C182 196 156 232 120 232 C84 232 58 196 54 152 C50 112 72 80 120 80 Z" fill="#a9703f"/>' +
      '<ellipse cx="120" cy="196" rx="46" ry="36" fill="#d2a271"/>' +
      '<g class="blink"><ellipse cx="92" cy="140" rx="10" ry="12" fill="#2a170b"/><circle cx="95" cy="135" r="3.6" fill="#fff"/>' +
      '<ellipse cx="148" cy="140" rx="10" ry="12" fill="#2a170b"/><circle cx="151" cy="135" r="3.6" fill="#fff"/></g>' +
      '<circle class="nose-glow" cx="120" cy="178" r="34" fill="#ff5a5f" opacity=".28"/>' +
      '<ellipse cx="120" cy="178" rx="22" ry="18" fill="#e5383f"/>' +
      '<ellipse cx="112" cy="171" rx="7" ry="4.5" fill="#fff" opacity=".7"/>' +
      '<path d="M100 206 C110 218 130 218 140 206" fill="none" stroke="#7a4a25" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* Snowy hills + pines along the bottom of the home page. */
  function hills() {
    function pine(x, y, s) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
        '<rect x="-4" y="38" width="8" height="14" fill="#5b3a1e"/>' +
        '<path d="M0 -30 L20 0 H10 L26 22 H14 L30 42 H-30 L-14 22 H-26 L-10 0 H-20 Z" fill="#12564a"/>' +
        '<path d="M0 -30 L9 -16 C4 -19 -4 -19 -9 -16 Z M-10 0 C-4 -6 4 -6 10 0 Z M-14 22 C-6 15 6 15 14 22 Z" fill="#eef8fb"/></g>';
    }
    return '' +
      '<svg viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0 120 C200 50 420 70 640 120 C860 170 1100 60 1440 110 V220 H0 Z" fill="#0f4a5c"/>' +
      pine(180, 78, 1) + pine(250, 96, 0.7) + pine(1130, 70, 1.1) + pine(1210, 92, 0.75) + pine(760, 124, 0.6) +
      '<path d="M0 170 C260 100 520 190 800 150 C1040 116 1240 150 1440 130 V220 H0 Z" fill="#dff1f6"/>' +
      '<path d="M0 196 C300 150 620 214 900 186 C1140 162 1300 190 1440 176 V220 H0 Z" fill="#ffffff"/>' +
      '</svg>';
  }

  window.RG.art = { reindeerSide: reindeerSide, reindeerFace: reindeerFace, hills: hills };
})();
