"use strict";

const form = document.querySelector("#scores");
const count = document.querySelector("#count");
const guaranteed = document.querySelector("#guaranteed");

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function formatScore(score) {
  return Math.floor(score / 10) + ":" + score % 10;
}

function scoreTable(rows, label) {
  const table = element("table");
  table.setAttribute("aria-label", label);
  const headings = table.createTHead().insertRow();
  for (const title of ["清华 vs 北理工", "清华 vs 北信科"]) {
    const th = element("th", title);
    th.scope = "col";
    headings.append(th);
  }
  const body = table.createTBody();
  for (const [tech, info] of rows) {
    const row = body.insertRow();
    for (const score of [tech, info]) row.append(element("td", formatScore(score)));
  }
  return table;
}

function render() {
  const tech = form.elements.namedItem("tech").value;
  const info = form.elements.namedItem("info").value;
  const rows = window.qualificationResults?.[tech + "-" + info];
  if (!rows) {
    count.textContent = "";
    guaranteed.replaceChildren(element("p", "赛果数据未加载，请刷新页面。", "empty"));
    return;
  }
  const passing = rows.filter(row => row[2] === "出线");
  count.textContent = passing.length + " 种";
  guaranteed.replaceChildren(passing.length
    ? scoreTable(passing, "确定出线的比分组合")
    : element("p", "这组对手比分下，没有能确保清华出线的打法。", "empty"));
}

form.addEventListener("change", render);
render();
