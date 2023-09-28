// @internal
export interface ILogger {
  info(...msg: string[]): void;
  success(...msg: string[]): void;
  warn(...msg: string[]): void;
  error(...msg: string[]): void;
}

// @internal
export class Logger implements ILogger {
  private colors = {
    reset: '\x1b[0m',
    fg: {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      cyanBold: '\x1b[1m\x1b[36m'
    },
  } as const;

  private packageName: string;

  constructor(packageName: string) {
    this.packageName = packageName;
  }

  private log(msg: string[], prefix: string = '') {
    const s = msg.join('\n');

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeMsg = `\x1b[2m${hours}:${minutes}:${seconds}\x1b[22m`

    console.log(
      `${timeMsg} %s[${this.packageName}]%s ${s}`,
      prefix,
      prefix ? this.colors.reset : ''
    );
  }

  info(...msg: string[]) {
    this.log(msg, this.colors.fg.cyanBold);
  }

  success(...msg: string[]) {
    this.log(msg, this.colors.fg.cyanBold);
  }

  warn(...msg: string[]) {
    this.log([`${this.colors.fg.yellow}(!)${this.colors.reset} ${msg}`], this.colors.fg.cyanBold);
  }

  error(...msg: string[]) {
    this.log([`${this.colors.fg.red}failed!${this.colors.reset}`, ...msg], this.colors.fg.cyanBold);
  }
}
