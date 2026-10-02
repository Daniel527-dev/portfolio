"use client";

import { useState } from "react";
import styles from "./demos.module.css";

const JUSTIFY = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
const ALIGN = ["stretch", "flex-start", "center", "flex-end", "baseline"];
const HEIGHTS = [48, 80, 64];

export default function FlexPlayground() {
  const [direction, setDirection] = useState<"row" | "column">("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");

  const css = `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
}`;

  return (
    <figure className={styles.demo}>
      <div className={styles.controlsGrid}>
        <fieldset className={styles.fieldset}>
          <legend>flex-direction</legend>
          {(["row", "column"] as const).map((d) => (
            <label key={d} className={styles.chip} data-checked={direction === d}>
              <input type="radio" name="direction" checked={direction === d} onChange={() => setDirection(d)} />
              {d}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>justify-content</legend>
          {JUSTIFY.map((j) => (
            <label key={j} className={styles.chip} data-checked={justify === j}>
              <input type="radio" name="justify" checked={justify === j} onChange={() => setJustify(j)} />
              {j}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>align-items</legend>
          {ALIGN.map((a) => (
            <label key={a} className={styles.chip} data-checked={align === a}>
              <input type="radio" name="align" checked={align === a} onChange={() => setAlign(a)} />
              {a}
            </label>
          ))}
        </fieldset>
      </div>

      <div
        className={styles.flexStage}
        style={{ flexDirection: direction, justifyContent: justify, alignItems: align }}
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={styles.flexItem}
            style={
              align === "stretch"
                ? undefined
                : direction === "row"
                  ? { height: h }
                  : { width: h + 40 }
            }
          >
            {i + 1}
          </div>
        ))}
      </div>
      <pre className={styles.cssOutput}>{css}</pre>
    </figure>
  );
}
