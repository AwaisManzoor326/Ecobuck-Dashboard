import React from "react";

interface DeviceIllustrationProps {
  status?: "online" | "offline";
  fillPercent?: number;
  temp?: number;
  humidity?: number;
  className?: string;
  showLayers?: boolean;
}

export const DeviceIllustration: React.FC<DeviceIllustrationProps> = ({
  status = "online",
  fillPercent = 82,
  temp = 36.8,
  humidity = 64,
  className = "w-36 h-48",
  showLayers = true,
}) => {
  const isOnline = status === "online";
  const cappedFill = Math.min(100, Math.max(0, fillPercent));

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        <defs>
          {/* Casing gradient */}
          <linearGradient id="bodyGrad" x1="20" y1="20" x2="180" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--surface)" />
            <stop offset="1" stopColor="var(--surface-soft)" />
          </linearGradient>

          {/* Organic compost layer gradients */}
          <linearGradient id="topScraps" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#65A30D" />
            <stop offset="1" stopColor="#84CC16" />
          </linearGradient>

          <linearGradient id="midDigestion" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#854D0E" />
            <stop offset="1" stopColor="#A16207" />
          </linearGradient>

          <linearGradient id="bottomHumus" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#3F2212" />
            <stop offset="1" stopColor="#1C0D02" />
          </linearGradient>

          <linearGradient id="lidGrad" x1="30" y1="10" x2="170" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3FAE6A" />
            <stop offset="1" stopColor="#2B854F" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Bin Body Shadow */}
        <ellipse cx="100" cy="245" rx="65" ry="10" fill="rgba(0,0,0,0.12)" />

        {/* Outer Casing */}
        <rect
          x="35"
          y="40"
          width="130"
          height="195"
          rx="24"
          fill="url(#bodyGrad)"
          stroke="var(--border)"
          strokeWidth="3"
        />

        {/* Top Lid / Seal */}
        <path
          d="M30 42 C30 25, 170 25, 170 42 L165 52 C165 52, 35 52, 35 52 Z"
          fill="url(#lidGrad)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* Eco Zindagi Branding Mark on Lid Handle */}
        <rect x="80" y="22" width="40" height="8" rx="4" fill="var(--surface)" opacity="0.85" />

        {/* Smart IoT Display & LED Panel */}
        <rect
          x="55"
          y="62"
          width="90"
          height="28"
          rx="8"
          fill="var(--background)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* Status LED */}
        <circle
          cx="68"
          cy="76"
          r="4"
          fill={isOnline ? "#4ADE80" : "#94A3B8"}
          filter={isOnline ? "url(#ledGlow)" : undefined}
        />

        {/* Live Digital Telemetry summary on bin screen */}
        <text x="80" y="75" fill="var(--text-primary)" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {isOnline ? `${temp.toFixed(1)}°C | ${humidity}%` : "OFFLINE"}
        </text>
        <text x="80" y="84" fill="var(--text-secondary)" fontSize="6.5" fontFamily="sans-serif">
          {isOnline ? `FILL: ${cappedFill}%` : "SYNC LOST"}
        </text>

        {/* Bin Window / Internal Compost Chamber Cross Section */}
        {showLayers && (
          <g>
            {/* Window frame */}
            <rect
              x="50"
              y="102"
              width="100"
              height="112"
              rx="12"
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth="2"
            />

            {/* Clip path for rounded window compost fill */}
            <g clipPath="url(#windowClip)">
              <clipPath id="windowClip">
                <rect x="52" y="104" width="96" height="108" rx="10" />
              </clipPath>

              {/* Background chamber grid */}
              <rect x="52" y="104" width="96" height="108" fill="var(--surface-soft)" />

              {/* Fill level dynamic block height */}
              {/* Max window height is 108. Fill level scales from y=212 up */}
              {(() => {
                const maxFillH = 100;
                const fillH = (cappedFill / 100) * maxFillH;
                const topY = 212 - fillH;

                return (
                  <g>
                    {/* Bottom Cured Humus layer */}
                    <rect x="52" y="180" width="96" height="32" fill="url(#bottomHumus)" />

                    {/* Middle Active Digestion layer */}
                    <rect x="52" y="140" width="96" height="40" fill="url(#midDigestion)" />

                    {/* Top Fresh Organic Waste layer */}
                    <rect x="52" y={topY} width="96" height={Math.max(0, 140 - topY)} fill="url(#topScraps)" />

                    {/* Animated Microbial Heat Waves */}
                    {isOnline && (
                      <path
                        d={`M 55 ${topY + 4} Q 75 ${topY - 3}, 95 ${topY + 4} T 135 ${topY + 4}`}
                        stroke="#4ADE80"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.8"
                      />
                    )}
                  </g>
                );
              })()}

              {/* Internal Temperature Sensor Probe Line */}
              <line x1="100" y1="104" x2="100" y2="165" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="100" cy="165" r="3.5" fill="var(--primary)" />
            </g>

            {/* Glass window glare effect */}
            <path d="M 54 106 L 120 106 L 54 170 Z" fill="white" opacity="0.08" />
          </g>
        )}

        {/* Lower Harvest Drawer Line */}
        <line x1="45" y1="222" x2="155" y2="222" stroke="var(--border)" strokeWidth="2" />
        <rect x="88" y="226" width="24" height="4" rx="2" fill="var(--text-secondary)" opacity="0.5" />

        {/* Eco Zindagi Product Badge */}
        <text
          x="100"
          y="20"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="1"
        >
          ECOBUCK
        </text>
      </svg>
    </div>
  );
};
