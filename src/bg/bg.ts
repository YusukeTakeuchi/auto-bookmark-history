import { BookmarkRuleset } from "lib/BookmarkRuleset"
import { getRulesAsString } from "lib/Config";

async function historyVisited(historyItem: browser.history.HistoryItem) {
  try {
    if (historyItem.url == null || historyItem.title == null) {
      return;
    }

    const settingsStr = await getRulesAsString();
    console.log({ settingsStr });
    console.log(eval(settingsStr));
    const ruleset = new BookmarkRuleset(eval(settingsStr));


    // @ts-ignore
    ruleset.execute(historyItem);
  } catch(error) {
    console.error( { msg: 'Error adding a bookmark', error });
  }
}

browser.history.onVisited.addListener(historyVisited);
// @ts-ignore
browser.history.onTitleChanged.addListener(historyVisited);