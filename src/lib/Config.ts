type FolderMapping =  {
  [name: string]: string,
}

const FOLDER_MAPPING_KEY = 'FOLDER_MAPPING';
const RULES_KEY = 'RULES';

const DefaultRulesString =
`[
  {
    title: 'Youtube', // The title of the bookmark folder [string]
    urlPattern: 'www.youtube.com', // The pattern of urls [string | RegExp | function]
    normalizer: (url) => { // A function to judge duplication of bookmarks (optinal) [RegExp | function]
      const md = /v=(\\w+)/.exec(url);
      return md ? md[0] : null;
    },
    maxSize: 10, // The number of bookmarks to save in the folder [number]
  }
];`;

export async function getFolderMapping(): Promise<FolderMapping> {
  return ((await browser.storage.local.get(FOLDER_MAPPING_KEY))[FOLDER_MAPPING_KEY] as FolderMapping) || {};
}

export async function updateFolderMappingItem(name: string, folderId: string) {
  const mapping = await getFolderMapping();
  mapping[name] = folderId;
  return browser.storage.local.set({ [FOLDER_MAPPING_KEY]: mapping });
}

export async function getRulesAsString(): Promise<string> {
  return ((await browser.storage.local.get(RULES_KEY))[RULES_KEY] as string) || DefaultRulesString;
}

export async function saveRulesAsString(rules: string) {
  return browser.storage.local.set({ [RULES_KEY]: rules });
}