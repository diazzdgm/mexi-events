import React, { useState } from 'react';
import { BarChart3, Heart } from 'lucide-react';

export default function PopularityChart({ events }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!events || events.length === 0) return null;

    const maxLikes = Math.max(...events.map(e => e.likes_count || 0), 1);
    const barHeight = 26;
    const barGap = 8;
    const labelWidth = 100;
    const valueWidth = 32;
    const chartPadding = 8;
    const width = 256;
    const innerWidth = width - labelWidth - valueWidth - chartPadding * 2;
    const height = events.length * (barHeight + barGap) + chartPadding * 2;

    return (
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-mexi-pink" />
                <h4 className="text-white text-sm font-bold">Popularity Chart</h4>
            </div>
            <p className="text-[10px] text-gray-400 mb-3">Likes per event (hover for details)</p>

            <svg width={width} height={height} className="overflow-visible">
                {events.map((event, i) => {
                    const likes = event.likes_count || 0;
                    const barWidth = (likes / maxLikes) * innerWidth;
                    const y = chartPadding + i * (barHeight + barGap);
                    const isHovered = hoveredIndex === i;
                    const title = event.event_title || 'Untitled';
                    const shortTitle = title.length > 14 ? title.slice(0, 13) + '…' : title;

                    return (
                        <g
                            key={event.id}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <text
                                x={chartPadding}
                                y={y + barHeight / 2 + 4}
                                fill={isHovered ? '#ec4899' : '#cbd5e1'}
                                fontSize="11"
                                fontWeight={isHovered ? '700' : '500'}
                            >
                                {shortTitle}
                            </text>

                            <rect
                                x={chartPadding + labelWidth}
                                y={y}
                                width={innerWidth}
                                height={barHeight}
                                fill="rgba(255,255,255,0.04)"
                                rx="4"
                            />

                            <rect
                                x={chartPadding + labelWidth}
                                y={y}
                                width={Math.max(barWidth, 2)}
                                height={barHeight}
                                fill={isHovered ? 'url(#gradHover)' : 'url(#gradBar)'}
                                rx="4"
                                style={{ transition: 'fill 0.2s' }}
                            />

                            <text
                                x={chartPadding + labelWidth + innerWidth + 6}
                                y={y + barHeight / 2 + 4}
                                fill={isHovered ? '#ec4899' : '#f1f5f9'}
                                fontSize="11"
                                fontWeight="700"
                            >
                                {likes}
                            </text>

                            {isHovered && (
                                <g>
                                    <rect
                                        x={chartPadding}
                                        y={y - 28}
                                        width={width - chartPadding * 2}
                                        height={24}
                                        fill="#0f172a"
                                        stroke="#ec4899"
                                        strokeWidth="1"
                                        rx="6"
                                    />
                                    <text
                                        x={chartPadding + 8}
                                        y={y - 11}
                                        fill="#ec4899"
                                        fontSize="10"
                                        fontWeight="700"
                                    >
                                        {title} — {event.state_name}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id="gradBar" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#be185d" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="gradHover" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f9a8d4" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2 pt-2 border-t border-slate-700/40">
                <Heart size={10} className="fill-mexi-pink text-mexi-pink" />
                <span>Based on community likes</span>
            </div>
        </div>
    );
}
