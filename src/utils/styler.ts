// 定义颜色和样式代码
// const Styles = {
//     Reset: "\x1b[0m",
//     Bright: "\x1b[1m",
//     Dim: "\x1b[2m",          //暗淡
//     Underscore: "\x1b[4m",
//     Blink: "\x1b[5m",
//     Reverse: "\x1b[7m",
//     Hidden: "\x1b[8m",
//     ResetBoldDim: "\x1b[22m", // 重置粗体/暗淡

//     FgBlack: "\x1b[30m",
//     FgRed: "\x1b[31m",
//     FgGreen: "\x1b[32m",
//     FgYellow: "\x1b[33m",
//     FgBlue: "\x1b[34m",
//     FgMagenta: "\x1b[35m",
//     FgCyan: "\x1b[36m",
//     FgWhite: "\x1b[37m",

//     BgBlack: "\x1b[40m",
//     BgRed: "\x1b[41m",
//     BgGreen: "\x1b[42m",
//     BgYellow: "\x1b[43m",
//     BgBlue: "\x1b[44m",
//     BgMagenta: "\x1b[45m",
//     BgCyan: "\x1b[46m",
//     BgWhite: "\x1b[47m",
// };

const Styles = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  ResetBoldDim: "\x1b[22m",

  FgBlack: "\x1b[30m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",

  BgGreen: "\x1b[42m",
  BgBlue: "\x1b[44m",
};

type Style = keyof typeof Styles;

// 扩展 styler 函数支持多种样式
export function styler(message: string, styles: Style[] = ["Reset"]): string {
  const appliedStyles = styles
    .map((style) => Styles[style] || Styles.Reset)
    .join("");
  return `${appliedStyles}${message}${Styles.Reset}`;
}

// 使用示例
// console.log(styler("粗体绿色文字", ["Bright", "FgGreen"]));
// console.log(styler("下划线蓝色背景文字", ["Underscore", "BgBlue", "FgWhite"]));
// console.log(styler("闪烁的红色文字", ["Blink", "FgRed"]));
