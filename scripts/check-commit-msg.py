#!/usr/bin/env python3
"""校验 commit message 是否符合 UNIJMU 的 Gitmoji + Conventional Commits 规范。

规范见 unijmu-docs 的 document/ENGINEERING_GUIDE.md。
用法：
    check-commit-msg.py --file .git/COMMIT_EDITMSG
    check-commit-msg.py --text "✨ feat(feed): 支持话题标签"
"""
import argparse
import re
import sys

# emoji 去掉变体选择符 U+FE0F 后的形态 -> 允许的 type
MAPPING = {
    "✨": "feat", "🐛": "fix", "📝": "docs", "💄": "style", "♻": "refactor",
    "⚡": "perf", "✅": "test", "🔧": "chore", "👷": "ci", "⬆": "deps",
    "🔥": "remove", "🚚": "move", "🗃": "db", "🔒": "security", "🚀": "deploy",
    "🎉": "init", "🚧": "wip",
}
# 不允许进入 main 的类型
BLOCKED_ON_MAIN = {"wip"}
SKIP_PREFIXES = ("Merge ", "Revert ", "fixup!", "squash!")
PATTERN = re.compile(r"^(\S+)\s+([a-z]+)(\([a-z0-9\-./]+\))?:\s+(.+)$")
VS16 = "️"


def first_line(text: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            return line
    return ""


def check(subject: str, block_wip: bool = False) -> list:
    errors = []
    if not subject:
        return ["commit message 为空"]
    if subject.startswith(SKIP_PREFIXES):
        return []

    m = PATTERN.match(subject)
    if not m:
        return [
            "格式不符合 `<emoji> <type>(<scope>): <subject>`",
            "  例：✨ feat(feed): 支持话题标签筛选动态流",
        ]

    emoji, ctype, _scope, text = m.groups()
    key = emoji.replace(VS16, "")
    if key not in MAPPING:
        errors.append(f"emoji `{emoji}` 不在允许列表内，见 ENGINEERING_GUIDE.md 对照表")
    elif MAPPING[key] != ctype:
        errors.append(f"emoji `{emoji}` 应配合 type `{MAPPING[key]}`，实际是 `{ctype}`")

    if ctype not in MAPPING.values():
        errors.append(f"type `{ctype}` 不在允许列表内")
    if block_wip and ctype in BLOCKED_ON_MAIN:
        errors.append(f"type `{ctype}` 不允许合入 main")
    if len(text) > 50:
        errors.append(f"描述过长（{len(text)} 字），控制在 50 字以内")
    if text.endswith(("。", ".")):
        errors.append("描述结尾不要加句号")
    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file")
    ap.add_argument("--text")
    ap.add_argument("--block-wip", action="store_true")
    args = ap.parse_args()

    if args.file:
        with open(args.file, encoding="utf-8") as fh:
            subject = first_line(fh.read())
    elif args.text is not None:
        subject = first_line(args.text)
    else:
        subject = first_line(sys.stdin.read())

    errors = check(subject, block_wip=args.block_wip)
    if errors:
        print(f"✗ commit message 不合规：{subject}", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        print("  规范：unijmu-docs/document/ENGINEERING_GUIDE.md 第 3 节", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
