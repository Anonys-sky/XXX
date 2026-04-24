"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GraphInput, GraphOutcome } from "@/types";

interface NeuralGraphProps {
  inputs: GraphInput[];
  outcomes: GraphOutcome[];
}

interface LineCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function NeuralGraph({ inputs, outcomes }: NeuralGraphProps) {
  const flowRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ left: LineCoords[]; right: LineCoords[] }>({
    left: [],
    right: [],
  });
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const container = flowRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setSvgSize({ w: rect.width, h: rect.height });

    const inputDots = container.querySelectorAll(".col-inputs .connector-dot.right");
    const engineLeftDot = container.querySelector(".col-engine .connector-dot.left");
    const engineRightDot = container.querySelector(".col-engine .connector-dot.right");
    const outcomeDots = container.querySelectorAll(".col-outcomes .connector-dot.left");

    const toLocal = (el: Element) => ({
      x: el.getBoundingClientRect().left - rect.left + el.getBoundingClientRect().width / 2,
      y: el.getBoundingClientRect().top - rect.top + el.getBoundingClientRect().height / 2,
    });

    const leftLines: LineCoords[] = [];
    inputDots.forEach((dot) => {
      if (engineLeftDot) {
        const p1 = toLocal(dot);
        const p2 = toLocal(engineLeftDot);
        leftLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      }
    });

    const rightLines: LineCoords[] = [];
    outcomeDots.forEach((dot) => {
      if (engineRightDot) {
        const p1 = toLocal(engineRightDot);
        const p2 = toLocal(dot);
        rightLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      }
    });

    setLines({ left: leftLines, right: rightLines });
  }, []);

  useEffect(() => {
    // Measure after mount + after card entrance animations settle
    measure();
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [measure, inputs, outcomes]);

  const buildPath = (l: LineCoords) => {
    const dx = l.x2 - l.x1;
    const cp1x = l.x1 + dx * 0.4;
    const cp2x = l.x2 - dx * 0.4;
    return `M ${l.x1} ${l.y1} C ${cp1x} ${l.y1}, ${cp2x} ${l.y2}, ${l.x2} ${l.y2}`;
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h3>NEURAL DECISION GRAPH</h3>
      </div>

      <div className="graph-flow" ref={flowRef}>
        {/* Input Column */}
        <div className="graph-col col-inputs">
          {inputs.map((inp, i) => (
            <div
              key={i}
              className="graph-card input-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="card-icon">
                <i className={`fa-solid ${inp.icon}`}></i>
              </div>
              <div className="card-info">
                <p className="label">INPUT</p>
                <h4>{inp.name}</h4>
                <p className="value">{inp.amount}</p>
              </div>
              <div className="connector-dot right"></div>
            </div>
          ))}
        </div>

        {/* SVG Overlay — connection lines */}
        <svg
          className="graph-svg-overlay"
          viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
          aria-hidden="true"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {lines.left.map((l, i) => {
            const d = buildPath(l);
            return (
              <g key={`l-${i}`}>
                <path d={d} className="conn-glow" />
                <path d={d} className="conn-line" id={`left-path-${i}`} />
                <circle r="2.5" className="conn-particle" filter="url(#glow)">
                  <animateMotion dur={`${1.4 + i * 0.25}s`} repeatCount="indefinite">
                    <mpath href={`#left-path-${i}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {lines.right.map((l, i) => {
            const d = buildPath(l);
            return (
              <g key={`r-${i}`}>
                <path d={d} className="conn-glow" />
                <path d={d} className="conn-line" id={`right-path-${i}`} />
                <circle r="2.5" className="conn-particle" filter="url(#glow)">
                  <animateMotion dur={`${1.4 + i * 0.25}s`} repeatCount="indefinite">
                    <mpath href={`#right-path-${i}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Engine Column */}
        <div className="graph-col col-engine">
          <div className="engine-node">
            <div className="engine-ring"></div>
            <div className="connector-dot left"></div>
            <i className="fa-solid fa-brain"></i>
            <div className="connector-dot right"></div>
          </div>
          <p className="engine-label">POCKETCFO ENGINE</p>
        </div>

        {/* Outcome Column */}
        <div className="graph-col col-outcomes">
          {outcomes.map((out, i) => {
            const statusIcon =
              out.status === "rejected"
                ? "fa-circle-xmark"
                : out.status === "approved"
                ? "fa-circle-check"
                : "fa-clock";
            const statusLabel = out.status.toUpperCase();
            return (
              <div
                key={i}
                className={`graph-card outcome-card ${out.status}`}
                style={{ animationDelay: `${0.3 + i * 0.12}s` }}
              >
                <div className="connector-dot left"></div>
                <div className="outcome-header">
                  <i className={`fa-solid ${statusIcon}`}></i> {statusLabel}
                </div>
                <h4>{out.title}</h4>
                <p>{out.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
