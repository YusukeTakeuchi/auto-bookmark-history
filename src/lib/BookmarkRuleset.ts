import { getFolderMapping, updateFolderMappingItem } from "./Config";

export type BookmarkSetting = {
  title: string,
  urlPattern: string | RegExp | ((url: string) => boolean),
  normalizer?: RegExp | ((url: string) => string | null),
  maxSize?: number,
}

type UrlPattern = {
  label: string,
  match: (url: string) => boolean,
}

type Normalizer = (url: string) => string | null

type BookmarkRuleParams = {
  title: string,
  folderId: string | null,
  urlPattern: UrlPattern,
  normalizer: Normalizer | null,
  maxSize: number,
}

const DEFAULT_MAX_SIZE = 10;

export class BookmarkRuleset {
  settings: BookmarkSetting[]

  constructor(settings: BookmarkSetting[]) {
    this.settings = settings;
  }

  execute({ url, title }: { url: string, title: string }) {
    const converter = new SettingsConverter();
    const paramsList = this.settings.map(converter.convert.bind(converter));

    for (const paramsP of paramsList) {
      paramsP.then((params) => {
        (new BookmarkRule(params)).execute(url, title);
      })
    }
  }
}

class BookmarkRule {
  params: BookmarkRuleParams
  #folderId: string | null

  constructor (params: BookmarkRuleParams) {
    this.params = params;
    this.#folderId = params.folderId; // can be modified if a new folder is created
  }

  async execute(url: string, title: string) {
    if (this.params.urlPattern.match(url)) {
      const normalizedUrl = this.#normalizeUrl(url);
      if (normalizedUrl == null) {
        return;
      }

      const folder = await this.#getOrCreateFolder();

      this.#addBookmark(folder.id, url, title, normalizedUrl);
    }
  }

  #normalizeUrl(url: string) {
    const { normalizer } = this.params;
    return normalizer ? normalizer(url) : url;
  }

  async #getOrCreateFolder() {
    let folder = this.#folderId == null ? null :
      await browser.bookmarks.get(this.#folderId).then((folder) => folder[0]).catch(() => null);
    if (folder == null) {
      folder = await browser.bookmarks.create({
        title: this.params.title,
      })
    }
    updateFolderMappingItem(this.params.title, folder.id);
    this.#folderId = folder.id;

    return folder;
  }

  async #addBookmark(folderId: string, url: string, title: string, normalizedUrl: string) {
    const newBookmark = await browser.bookmarks.create({
      index: 0,
      parentId: folderId,
      title: title,
      url: url,
    });

    const folder = (await browser.bookmarks.getSubTree(folderId))[0];

    if (folder.children != null) {
      // Remove duplicate bookmarks and bookmarks that exceed the maxSize
      let count = 0;
      for (const child of folder.children) {
        if (newBookmark.id !== child.id &&
            child.url != null &&
            this.#normalizeUrl(child.url) === normalizedUrl) {
          browser.bookmarks.remove(child.id);
          continue;
        }
        if (count >= this.params.maxSize) {
          browser.bookmarks.remove(child.id);
          continue;
        }
        count++;
      }
    }
  }
}

class SettingsConverter {
  #folderMappingPromise: Promise<{ [name: string]: string; }>;

  constructor() {
    this.#folderMappingPromise = getFolderMapping();
    this.#folderMappingPromise.then((v) => console.log(v));
  }

  async convert(setting: BookmarkSetting): Promise<BookmarkRuleParams> {
    const folderId = (await this.#folderMappingPromise)[setting.title] || null;

    let urlPattern: UrlPattern;

    if (typeof setting.urlPattern === 'string') {
      urlPattern = {
        label: setting.urlPattern,
        match: (url) => url.includes(setting.urlPattern as string),
      }
    } else if (setting.urlPattern instanceof RegExp) {
      urlPattern = {
        label: setting.urlPattern.toString(),
        match: (url) => (setting.urlPattern as RegExp).test(url),
      }
    } else if (typeof setting.urlPattern === 'function') {
      urlPattern = {
        label: "<function>",
        match: setting.urlPattern,
      }
    } else {
      throw `Invalid value: ${setting.urlPattern} for urlPattern `;
    }

    let normalizer: Normalizer | null;
    if (setting.normalizer instanceof RegExp) {
      const regex = setting.normalizer
      normalizer = (url) => {
        const md = url.match(regex);
        return md == null ? null : md[0];
      }
    } else if (typeof setting.normalizer === 'function') {
      normalizer = setting.normalizer;
    } else if (setting.normalizer == null) {
      normalizer = null;
    } else {
      throw `Invalid value: ${setting.normalizer} for normalizer `;
    }

    const maxSize = setting.maxSize || DEFAULT_MAX_SIZE;

    return {
      title: setting.title,
      folderId,
      urlPattern,
      normalizer,
      maxSize,
    };
  }
}

