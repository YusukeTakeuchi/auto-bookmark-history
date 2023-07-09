import { BookmarkRuleset } from "lib/BookmarkRuleset"

const BookmarkSettings = 
  [
    {
      title: 'Youtube', // string
      urlPattern: 'www.youtube.com', // string | RegExp | function
      normalizer: (url: string) => { // RegExp | function
        const md = /v=(\w+)/.exec(url);
        return md ? md[0] : null;
      },
      maxSize: 10, // number
    }
  ];

const ruleset = new BookmarkRuleset(BookmarkSettings);

async function historyVisited(historyItem: browser.history.HistoryItem) {
  if (historyItem.url == null || historyItem.title == null) {
    return;
  }

  // @ts-ignore
  ruleset.execute(historyItem);
}

browser.history.onVisited.addListener(historyVisited);
// @ts-ignore
browser.history.onTitleChanged.addListener(historyVisited);