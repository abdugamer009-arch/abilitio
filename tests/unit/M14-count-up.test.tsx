import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CountUp } from "@/components/CountUp";

describe("M14 result numbers", () => {
  it("renders the true value on the first frame, including suffix and decimals", () => {
    expect(renderToStaticMarkup(<CountUp value={3} suffix="/9" />)).toContain("3/9");
    expect(renderToStaticMarkup(<CountUp value={87} suffix="/100" />)).toContain("87/100");
    expect(renderToStaticMarkup(<CountUp value={7.5} decimals={1} />)).toContain("7.5");
  });
});
