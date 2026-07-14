/* Hand-built SVG ornaments — roses, lilies, corner clusters, petals,
 * hummingbird, monogram, rings, divider. No external assets; colours
 * reference theme tokens. */

/** A single rose bloom (layered petals). Used inside clusters. */
function RoseBloom({
  cx,
  cy,
  s = 1,
  deep = false,
}: {
  readonly cx: number;
  readonly cy: number;
  readonly s?: number;
  readonly deep?: boolean;
}) {
  const outer = deep ? "var(--color-rose)" : "var(--color-blush)";
  const mid = deep ? "var(--color-rose-deep)" : "var(--color-rose)";
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={`o${a}`}
          cx={0}
          cy={-6}
          rx={5}
          ry={7}
          fill={outer}
          transform={`rotate(${a})`}
        />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <ellipse
          key={`i${a}`}
          cx={0}
          cy={-4}
          rx={3.4}
          ry={5}
          fill={mid}
          transform={`rotate(${a})`}
        />
      ))}
      <circle r={3} fill="var(--color-rose-deep)" />
      <circle r={1.4} fill="var(--color-gold)" />
    </g>
  );
}

/** A single lily (six pointed petals + stamens). Used inside clusters. */
function Lily({
  cx,
  cy,
  s = 1,
}: {
  readonly cx: number;
  readonly cy: number;
  readonly s?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path
          key={a}
          d="M0,0 C -3.5,-9 -1.5,-17 0,-20 C 1.5,-17 3.5,-9 0,0 Z"
          fill="var(--color-lily)"
          stroke="var(--color-blush)"
          strokeWidth={0.4}
          transform={`rotate(${a})`}
        />
      ))}
      {[-22, 0, 22].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1={0} y1={-2} x2={0} y2={-9} stroke="var(--color-gold)" strokeWidth={0.9} />
          <circle cx={0} cy={-10} r={1.5} fill="var(--color-gold)" />
        </g>
      ))}
    </g>
  );
}

/**
 * A corner cluster of roses + lilies with sage foliage. Pin it with the CSS
 * classes `bloom bloom--tl|tr|bl|br`.
 */
export function FloralCluster({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* foliage */}
      <path d="M84 60 C104 56 120 64 128 84 C108 88 90 82 84 60 Z" fill="var(--color-sage)" opacity="0.4" />
      <path d="M60 96 C66 116 58 130 42 132 C38 114 46 100 60 96 Z" fill="var(--color-sage)" opacity="0.36" />
      <path d="M26 62 C8 66 0 80 6 98 C24 94 32 80 26 62 Z" fill="var(--color-sage-deep)" opacity="0.3" />
      <path d="M72 40 C86 26 104 24 118 30 C108 44 90 50 72 40 Z" fill="var(--color-sage)" opacity="0.34" />

      {/* blooms */}
      <RoseBloom cx={36} cy={38} s={1.5} deep />
      <Lily cx={70} cy={32} s={1.15} />
      <RoseBloom cx={34} cy={72} s={1.15} />
      <Lily cx={54} cy={66} s={0.9} />
      <RoseBloom cx={68} cy={64} s={0.9} deep />
      <RoseBloom cx={52} cy={94} s={0.85} />
    </svg>
  );
}

/** A single rose petal — used by the petal rain. */
export function Petal({
  className,
  color = "var(--color-rose)",
  style,
}: {
  readonly className?: string;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 20 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0 C2 5 0 15 10 24 C20 15 18 5 10 0 Z"
        fill={color}
      />
      <path
        d="M10 3 C6 8 6 16 10 22"
        stroke="var(--color-rose-deep)"
        strokeWidth={0.7}
        opacity={0.5}
        fill="none"
      />
    </svg>
  );
}

/** A small stylised hummingbird in flight. */
export function Hummingbird({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 40 L2 46 L14 38 Z" fill="var(--color-accent-deep)" />
      <path d="M14 38 C20 30 28 26 36 26 C34 32 28 38 18 40 Z" fill="var(--color-accent)" />
      <circle cx="38" cy="24" r="4.4" fill="var(--color-accent-deep)" />
      <path d="M42 23 L60 20 L42 25 Z" fill="var(--color-ink-2)" />
      <path d="M22 34 C26 18 34 10 44 8 C40 22 34 32 24 36 Z" fill="var(--color-sage)" opacity="0.85" />
      <path d="M26 30 C30 20 36 14 42 12 C39 22 34 29 27 33 Z" fill="var(--color-blush)" opacity="0.8" />
    </svg>
  );
}

/** P & C monogram inside a double ring. */
export function Monogram({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="P and C monogram"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.5" opacity="0.32" />
      <text x="43" y="73" fontFamily="var(--font-display)" fontStyle="italic" fontSize="46" fill="currentColor">
        P
      </text>
      <text x="63" y="73" fontFamily="var(--font-display)" fontStyle="italic" fontSize="46" fill="currentColor">
        C
      </text>
    </svg>
  );
}

/** Two interlocking rings — a small ceremonial motif. */
export function GoldenRings({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 48"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="26" r="17" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="26" r="17" stroke="currentColor" strokeWidth="2" />
      <path d="M40 6 l4 7 l-8 0 z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** A slim horizontal floral divider used under section headings. */
export function FloralDivider({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "min(220px, 55vw)", height: "auto", margin: "0 auto" }}
    >
      <line x1="8" y1="12" x2="98" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="142" y1="12" x2="232" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <g transform="translate(120 12)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-4} rx={3} ry={4.5} fill="var(--color-blush)" transform={`rotate(${a})`} />
        ))}
        <circle r={2.4} fill="var(--color-rose-deep)" />
      </g>
      <circle cx="106" cy="12" r="1.8" fill="var(--color-sage)" />
      <circle cx="134" cy="12" r="1.8" fill="var(--color-sage)" />
    </svg>
  );
}
