# Changelog

This file documents all significant modifications made to the Astro Integration `astro-favicons`.

# 2.1.5

- fixed `package.json`

# 2.1.4
- Simplify type definitions, and properly revamp jsdoc (plan to update the complete documentation website when time permits)

# 2.1.3

### Major Changes

 - [#13](https://github.com/ACP-CODE/astro-favicons/issues/13) - Updated support for `manifest.webmanifest` to allow it to be validated through Application in Google Chrome Dev Tools. (暂无时间更新文档，具体参见 `favicons-lib` 中的 jsdoc 变更)

 - 移除了 `safari` 作为平台存在，`safari-pinned-tab.svg` 实现部分并入 `appleIcon`

## 2.1.0

- Added support for splashscrens: iPhone 14 Pro, iPhone 15 Pro, iPhone 15, iPhone 14 Pro Max, iPhone 15 Pro Max, iPhone 15 Plus, 8.3” iPad Mini, 10.9” iPad Air （虽然不是很重要，因为默认设置是关闭了该文件的生成）
- 修复 [#11](https://github.com/ACP-CODE/astro-favicons/issues/11) - `path` 未设置情况下，在 `astro.config.ts` 中会出现 ts 报错的问题

## 2.0.2

- [issues#7](https://github.com/ACP-CODE/astro-favicons/issues/7#issue-2036516313) - May be fixed (I'm not so sure, I just rolled back to the previous version).

## 2.0.1

- Fixed an issue where the color displayed on the terminal in dark night mode is inconsistent with the Astro 4.0.0 logger display。

## 2.0.0

- Make it look more like `astro v4.0.0`’s logger system.

## 1.2.0

- [issues#3](https://github.com/ACP-CODE/astro-favicons/issues/3) - May be fixed.

## 1.1.1

- [issues#4](https://github.com/ACP-CODE/astro-favicons/issues/4) - May be fixed.

## 1.1.0

- [79b3ad6](https://github.com/ACP-CODE/astro-favicons/pull/2/commits/79b3ad6ccbfcd6bbda80026d0686adde83ed4035)  - Update typo in README.md
- Update the JSDoc description about faviconsDarkMode. If you do not need to be compatible with the browser dark mode, you can set it to false.

## 1.0.1

- Update README.md

## 1.0.0

### Major Changes

- Updated ``favicons-lib``, Added:  Favicon Light and Dark Mode support

### Minor Changes

- Maked a base design for apple-touch-icon.png by offset:11.5, you can make your own

### Patch Changes

- Updated `favicons-lib`, fixed: link tag is missing when the name apple-touch-icon.png is missing.
