# prompton-cli

Prompton GraphQL APIを操作するCLI。人間とAIツール（Claude Code等）の両方が使うことを前提としている。

## コンセプト

- **AI-first CLI**: Claude CodeのようなAIエージェントが主要ユーザー。エラーメッセージ、ヘルプ、出力はAIが解釈しやすい形式にする。
- **デフォルトJSON出力**: 出力はデフォルトでJSON。AIがパースしやすく、フィールド名で意味が明確、ネスト構造もそのまま表現できる。人間向けには `--text, -t` オプションでテーブル/key-value形式に切り替える。printer.tsは `--text` 時のみ使用。
- **RESTful引数設計**: `prompton <resource> [id] [sub-resource] [options]` — REST APIのURLパスと同じ構造。
- **Hono as CLI router**: Honoの`app.request()`でCLI引数をHTTPリクエストに変換しルーティングする。サーバーは起動しない。
- **1ファイル1エンドポイント**: `src/commands/<resource>/<action>.ts` がそれぞれ1つのエンドポイントに対応。
- **責務の分離**: ハンドラーはデータ取得+`c.json()`で返すだけ。出力フォーマットは`printer.ts`、エラーは`lib/errors.ts`のカスタム例外。

## アーキテクチャ

```
src/
├── index.ts              # ルート定義 + CLI引数→Honoリクエスト変換
├── factory.ts            # 共有Honoファクトリ
├── client.ts             # GraphQLクライアント (gql.tada + fetch)
├── router.ts             # CLI引数パーサー (--flag → query params)
├── printer.ts            # パスベースの出力フォーマッター
├── on-error.ts           # エラーハンドラー
├── lib/
│   └── errors.ts         # HTTPExceptionベースのカスタムエラー
├── graphql-env.d.ts      # gql.tada自動生成型定義
└── commands/
    ├── works/
    │   ├── index.ts      # GET /works (一覧)
    │   └── show.ts       # GET /works/:work (詳細)
    └── users/
        ├── index.ts      # GET /users (一覧)
        ├── show.ts       # GET /users/:user (詳細)
        └── works.ts      # GET /users/:user/works (ユーザーの作品)
```

## 技術スタック

- **Hono**: ルーティング、バリデーション（zValidator）、エラーハンドリング
- **gql.tada**: 型安全なGraphQLクエリ（introspection.jsonからスキーマ取得）
- **Zod**: クエリパラメータのバリデーション
- **tsdown**: ビルド（単一ESMファイル出力）

## コマンド体系

```
prompton works                    # 一覧（複数形 = list）
prompton works <id>               # 詳細（ID指定 = get）
prompton works create             # 作成（動詞 = 変更操作）
prompton works <id> update        # 更新
prompton works <id> delete        # 削除
prompton users <id> works         # ネストリソース（1段まで）
prompton <command> --help         # エンドポイント単位のヘルプ
```

## 新しいエンドポイントの追加手順

1. `src/commands/<resource>/<action>.ts` を作成
2. zodスキーマ、GraphQLクエリ、`factory.createHandlers()`を定義し`export default`
3. `help`文字列を`export`
4. `src/index.ts`にimportして`app.get()`（または`app.post()`）で登録
5. `src/printer.ts`に `--text` 用の出力関数を追加（JSONはデフォルトで対応済み）

## コーディング規約

- importパスは`@/`エイリアス、拡張子なし
- パスパラメータはリソース名と一致させる（`:user`, `:work`）— ネスト時のID衝突を防ぐ
- 読み取りはGET + クエリパラメータ、変更操作はPOST + ボディ
- エラーは`lib/errors.ts`のカスタム例外をthrow（`NotFoundException`等）
- factoryは`factory.ts`の共有インスタンスを使う
- biomeでフォーマット
- 動的import（`import()`）は禁止。常に静的importを使う
