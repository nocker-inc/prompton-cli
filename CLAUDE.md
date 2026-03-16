# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# prompton-cli

Prompton GraphQL APIを操作するCLI。人間とAIツール（Claude Code等）の両方が使うことを前提としている。

## コンセプト

- **AI-first CLI**: Claude CodeのようなAIエージェントが主要ユーザー。エラーメッセージ、ヘルプ、出力はAIが解釈しやすい形式にする。
- **デフォルトJSON出力**: 出力はデフォルトでJSON。AIがパースしやすく、フィールド名で意味が明確、ネスト構造もそのまま表現できる。人間向けには `--text, -t` オプションでテーブル/key-value形式に切り替える。printer.tsは `--text` 時のみ使用。
- **RESTful引数設計**: `prompton <resource> [id] [sub-resource] [options]` — REST APIのURLパスと同じ構造。
- **Hono as CLI router**: Honoの`app.request()`でCLI引数をHTTPリクエストに変換しルーティングする。サーバーは起動しない。
- **1ファイル1エンドポイント**: `src/routes/<resource>/<action>.ts` がそれぞれ1つのエンドポイントに対応。
- **責務の分離**: ハンドラーはデータ取得+`c.json()`で返すだけ。出力フォーマットは`printer.ts`、エラーは`lib/errors.ts`のカスタム例外。

## コマンド

```sh
vp pack              # ビルド（dist/index.mjs）
vp pack --watch      # ウォッチモード
vp test              # テスト実行（bun:test）
vp check             # フォーマット + リント + 型チェック
vp fmt               # フォーマット（セミコロンなし）
bun src/index.ts     # ソースから直接実行
bun test             # テスト実行（bun直接）
npx gql.tada generate-output  # GraphQL型定義を再生成
make publish         # ビルド + npm publish
```

## アーキテクチャ

CLI引数の処理フロー:
```
CLI引数 → router.ts (パス+フラグに分離)
  → GETならクエリパラメータ、POSTならJSONボディに変換
  → app.request(url) でHonoルーターに渡す
  → ハンドラーがGraphQL実行 → c.json()で返す
  → index.tsで出力（デフォルトJSON、--textならprinter.ts）
```

認証フロー:
```
prompton login → ブラウザでGoogleログイン → refresh tokenを~/.config/prompton/credentials.jsonに保存
毎リクエスト → refresh token → Firebase REST APIでID token取得 → Authorization headerに付与
```

## 技術スタック

- **vp (Vite Plus)**: ビルド（vp pack = tsdown）、フォーマット、リント、テスト
- **Hono**: ルーティング、バリデーション（zValidator）、エラーハンドリング
- **gql.tada**: 型安全なGraphQLクエリ（`https://prompton.io/graphql` からスキーマ取得）
- **Zod**: クエリパラメータ/ボディのバリデーション
- **Firebase Auth**: Google OAuth（デスクトップアプリ型）でログイン

## コマンド体系

```
prompton works                    # 一覧（複数形 = list）
prompton works <id>               # 詳細（ID指定 = get）
prompton works create             # 作成（動詞 = 変更操作）
prompton works <id> update        # 更新
prompton works <id> delete        # 削除
prompton users <id> works         # ネストリソース（1段まで）
prompton my works                 # 自分のデータ（viewer経由）
prompton <command> --help         # エンドポイント単位のヘルプ
```

## 新しいエンドポイントの追加手順

1. `src/routes/<resource>/<action>.ts` を作成
2. zodスキーマ、GraphQLクエリ、`factory.createHandlers()`を定義し`export default`
3. `help`文字列を`export`
4. `src/index.ts`にimportして`app.get()`（または`app.post()`）で登録
5. GETレスポンスには `withPageURL` / `withPageURLs` でページURLを付与
6. POSTの場合は `router.ts` の `POST_COMMANDS` にコマンド名を追加
7. `src/printer.ts`に `--text` 用の出力関数を追加（JSONはデフォルトで対応済み）

## コーディング規約

- importパスは`@/`エイリアス、拡張子なし
- パスパラメータはリソース名と一致させる（`:user`, `:work`）— ネスト時のID衝突を防ぐ
- 読み取りはGET + クエリパラメータ、変更操作はPOST + ボディ
- エラーは`lib/errors.ts`のカスタム例外をthrow（`NotFoundException`等）
- factoryは`factory.ts`の共有インスタンスを使う
- biomeでフォーマット
- 動的import（`import()`）は禁止。常に静的importを使う
