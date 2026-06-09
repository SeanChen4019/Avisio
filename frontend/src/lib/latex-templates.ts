const B = String.fromCharCode(92); // backslash character

type Template = [string, string];
export const TEMPLATES: Template[] = [
  ["分式", B + "frac{a}{b}"],
  ["根号", B + "sqrt{x}"],
  ["n次根", B + "sqrt[n]{x}"],
  ["上标", "x^{2}"],
  ["下标", "x_{i}"],
  ["积分", B + "int_{a}^{b}"],
  ["求和", B + "sum_{i=1}^{n}"],
  ["向量", B + "vec{v}"],
  ["极限", B + "lim_{x " + B + "to 0}"],
];
