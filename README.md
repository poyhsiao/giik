giik
----

A static site generator for book.

針對書籍的靜態網頁產生器

## 安裝

```bash
$ npm install -g giik
```

## 建立書籍

### 1. 建立新目錄

```bash
$ mkdir book
$ cd book
```

### 2. 建立 giik.js

可參考 [example-giik.js](./example-giik.js)

內建四個 middleware 可使用

1. markdown
2. jadeTemplate - 使用前必須安 jade
3. duration
4. copy

### 3. 建立放置書籍容（markdown）的目錄

```bash
$ mkdir source
```

在這個目錄下每一個子目錄都是一個 chapter，目錄名稱用來設定章節先後順序還有網址，像是現在我們建立第一章，然後期望他的網址長相是 `http://mydomain/chapter-one`

```
$ mkdir 1-chapter-one
```

在每個 chapter 下面必須有 `chapter.json` 這個檔案，裡面設定其他這個 chapter 的詳細資訊

```javascript
{
  "name": "什麼是 giik ？",
  "number": 1,
  "sections": [
    {
      "name": "GIIIIIIIIK!",
      "authors": ["Po-Ying Chen <poying.me@gmail.com>"],
      "number": null,
      "source": "./test.md"
    }
  ]
}
```

### 4. 產生網頁

```bash
$ giik source site
```

執行完後就能在 site 目錄下看到網們的網頁啦

## License

The MIT License (MIT)

[http://poying.mit-license.org/](http://poying.mit-license.org/)
