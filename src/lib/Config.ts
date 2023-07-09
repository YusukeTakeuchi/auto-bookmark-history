type FolderMapping =  {
  [name: string]: string,
}

const FOLDER_MAPPING_KEY = 'FOLDER_MAPPING';

export async function getFolderMapping(): Promise<FolderMapping> {
  return ((await browser.storage.local.get(FOLDER_MAPPING_KEY))[FOLDER_MAPPING_KEY] as FolderMapping) || {};
}

export async function updateFolderMappingItem(name: string, folderId: string) {
  const mapping = await getFolderMapping();
  mapping[name] = folderId;
  return browser.storage.local.set({ [FOLDER_MAPPING_KEY]: mapping });
}